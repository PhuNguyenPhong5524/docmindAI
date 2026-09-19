import mongoose from 'mongoose';
import Chunk from '../models/chunk.model.js';
import Document from '../models/document.model.js';
import Message from '../models/message.model.js';
import { generateAnswer } from '../services/ai.service.js';
import { retrieveRelevantChunks } from '../services/retrieval.service.js';

const NOT_FOUND_ANSWER = 'Toi khong tim thay thong tin nay trong cac tai lieu da chon.';

const getCurrentUserId = (req) => req.user?.userId;

const normalizeText = (text) => text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const isPageCountQuestion = (question) => {
  const normalizedQuestion = normalizeText(question);

  return normalizedQuestion.includes('bao nhieu trang')
    || normalizedQuestion.includes('tong so trang')
    || normalizedQuestion.includes('tong bao nhieu trang')
    || normalizedQuestion.includes('co may trang');
};

const isSummaryQuestion = (question) => {
  const normalizedQuestion = normalizeText(question);

  return normalizedQuestion.includes('tom tat')
    || normalizedQuestion.includes('noi dung chinh')
    || normalizedQuestion.includes('file nay noi ve gi')
    || normalizedQuestion.includes('tai lieu nay noi ve gi')
    || normalizedQuestion.includes('phan tich tai lieu')
    || normalizedQuestion.includes('tong hop noi dung');
};

const buildDocumentMetadataContext = (document) => [
  '[Thong tin tai lieu]',
  `Ten tai lieu: ${document.display_name || document.original_name}`,
  `Tong so trang: ${document.total_pages || 0}`
].join('\n');

const buildContext = (chunks, document) => {
  const chunkContext = chunks
    .map((chunk) => `[Trang ${chunk.page_number}]\n${chunk.text_content}`)
    .join('\n\n');

  return [buildDocumentMetadataContext(document), chunkContext].filter(Boolean).join('\n\n');
};

const pickRepresentativeChunks = (chunks, maxChunks) => {
  if (chunks.length <= maxChunks) return chunks;

  const pickedIndexes = new Set();
  const segments = Math.min(3, maxChunks);
  const perSegment = Math.floor(maxChunks / segments);
  const remainder = maxChunks % segments;
  const segmentSize = Math.ceil(chunks.length / segments);

  for (let segment = 0; segment < segments; segment += 1) {
    const start = segment * segmentSize;
    const end = Math.min(start + segmentSize, chunks.length);
    const take = perSegment + (segment < remainder ? 1 : 0);

    for (let offset = 0; offset < take && start + offset < end; offset += 1) {
      pickedIndexes.add(start + offset);
    }
  }

  return Array.from(pickedIndexes)
    .sort((a, b) => a - b)
    .map((index) => chunks[index]);
};

const retrieveSummaryChunks = async (documentId) => {
  const totalChunks = await Chunk.countDocuments({ document_id: documentId });
  const limit = totalChunks > 24 ? 18 : 12;
  const chunks = await Chunk.find({ document_id: documentId })
    .sort({ chunk_index: 1 })
    .select('document_id text_content chunk_index page_number')
    .lean();

  return pickRepresentativeChunks(chunks, limit);
};

const buildCitations = (chunks, document) => {
  const seen = new Set();

  return chunks.reduce((citations, chunk) => {
    const key = `${chunk.document_id}:${chunk.page_number}`;

    if (seen.has(key)) return citations;
    seen.add(key);

    citations.push({
      document_id: document._id,
      document_name: document.display_name || document.original_name,
      page_number: chunk.page_number,
      excerpt: chunk.text_content.slice(0, 300)
    });

    return citations;
  }, []);
};

const saveChatMessages = async ({ userId, documentId, question, answer, citations }) => {
  await Message.create([
    {
      user_id: userId,
      document_id: documentId,
      role: 'user',
      content: question
    },
    {
      user_id: userId,
      document_id: documentId,
      role: 'ai',
      content: answer,
      citations
    }
  ]);
};

export const askQuestion = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { document_id, question } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Khong xac dinh duoc nguoi dung.' });
    }

    if (!document_id || !question?.trim()) {
      return res.status(400).json({ success: false, message: 'Thieu document_id hoac question.' });
    }

    if (!mongoose.isValidObjectId(document_id)) {
      return res.status(400).json({ success: false, message: 'document_id khong hop le.' });
    }

    const document = await Document.findOne({
      _id: document_id,
      owner_id: userId
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Khong tim thay tai lieu.' });
    }

    if (document.status !== 'READY') {
      return res.status(409).json({
        success: false,
        message: 'Tai lieu chua san sang de hoi AI.'
      });
    }

    const safeQuestion = question.trim();

    if (isPageCountQuestion(safeQuestion)) {
      const answer = `Tai lieu "${document.display_name || document.original_name}" co tong cong ${document.total_pages || 0} trang.`;
      const citations = [];

      await saveChatMessages({
        userId,
        documentId: document._id,
        question: safeQuestion,
        answer,
        citations
      });

      return res.status(200).json({
        success: true,
        answer,
        citations
      });
    }

    const chunks = isSummaryQuestion(safeQuestion)
      ? await retrieveSummaryChunks(document._id)
      : await retrieveRelevantChunks(document._id, safeQuestion, 5);

    let answer = NOT_FOUND_ANSWER;
    let citations = [];

    if (chunks.length > 0) {
      const context = buildContext(chunks, document);
      answer = await generateAnswer(context, safeQuestion);

      if (!normalizeText(answer).includes(normalizeText(NOT_FOUND_ANSWER)) && !normalizeText(answer).includes('khong tim thay')) {
        citations = buildCitations(chunks, document);
      }
    }

    await saveChatMessages({
      userId,
      documentId: document._id,
      question: safeQuestion,
      answer,
      citations
    });

    return res.status(200).json({
      success: true,
      answer,
      citations
    });
  } catch (error) {
    console.error('Loi Chat API:', error.message);
    return res.status(500).json({ success: false, message: 'Khong the xu ly cau hoi.' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { document_id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Khong xac dinh duoc nguoi dung.' });
    }

    if (!mongoose.isValidObjectId(document_id)) {
      return res.status(400).json({ success: false, message: 'document_id khong hop le.' });
    }

    const document = await Document.findOne({
      _id: document_id,
      owner_id: userId
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Khong tim thay tai lieu.' });
    }

    const history = await Message.find({
      user_id: userId,
      document_id
    }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Loi lay lich su chat.' });
  }
};
