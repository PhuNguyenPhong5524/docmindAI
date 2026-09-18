import mongoose from 'mongoose';
import Document from '../models/document.model.js';
import Message from '../models/message.model.js';
import { generateAnswer } from '../services/ai.service.js';
import { retrieveRelevantChunks } from '../services/retrieval.service.js';

const NOT_FOUND_ANSWER = 'Tôi không tìm thấy thông tin này trong các tài liệu đã chọn.';

const getCurrentUserId = (req) => req.user?.userId;

const buildContext = (chunks) => chunks
  .map((chunk) => `[Trang ${chunk.page_number}]\n${chunk.text_content}`)
  .join('\n\n');

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
      return res.status(401).json({ success: false, message: 'Không xác định được người dùng.' });
    }

    if (!document_id || !question?.trim()) {
      return res.status(400).json({ success: false, message: 'Thiếu document_id hoặc question.' });
    }

    if (!mongoose.isValidObjectId(document_id)) {
      return res.status(400).json({ success: false, message: 'document_id không hợp lệ.' });
    }

    const document = await Document.findOne({
      _id: document_id,
      owner_id: userId
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu.' });
    }

    if (document.status !== 'READY') {
      return res.status(409).json({
        success: false,
        message: 'Tài liệu chưa sẵn sàng để hỏi AI.'
      });
    }

    const chunks = await retrieveRelevantChunks(document._id, question.trim(), 5);
    let answer = NOT_FOUND_ANSWER;
    let citations = [];

    if (chunks.length > 0) {
      const context = buildContext(chunks);
      answer = await generateAnswer(context, question.trim());

      if (!answer.includes(NOT_FOUND_ANSWER) && !answer.toLowerCase().includes('không tìm thấy')) {
        citations = buildCitations(chunks, document);
      }
    }

    await saveChatMessages({
      userId,
      documentId: document._id,
      question: question.trim(),
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
    return res.status(500).json({ success: false, message: 'Không thể xử lý câu hỏi.' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { document_id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Không xác định được người dùng.' });
    }

    if (!mongoose.isValidObjectId(document_id)) {
      return res.status(400).json({ success: false, message: 'document_id không hợp lệ.' });
    }

    const document = await Document.findOne({
      _id: document_id,
      owner_id: userId
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu.' });
    }

    const history = await Message.find({
      user_id: userId,
      document_id
    }).sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: history });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi lấy lịch sử chat.' });
  }
};
