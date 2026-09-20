import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import Document from '../models/document.model.js';
import Chunk from '../models/chunk.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js'; 
import { chunkText } from '../services/chunker.service.js';
import { generateComparison, generateDocumentEmbedding, generateSummary } from '../services/ai.service.js';
import { createAndEmitNotification } from '../services/notification.service.js';

const UPLOAD_DIR = 'uploads/';
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const SCANNED_PDF_MESSAGE = 'Khong the trich xuat noi dung PDF. Tai lieu co the la PDF scan.';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const safeBaseName = baseName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'document';

    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName}${ext.toLowerCase()}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('He thong chi ho tro file PDF.'), false);
  }
  cb(null, true);
};

export const uploadConfig = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

const getPdfPages = async (filePath) => {
  const dataBuffer = await fs.promises.readFile(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const pdfData = await parser.getText({ pageJoiner: '' });
  const pages = (pdfData.pages || []).map((page) => ({
    pageNumber: page.num,
    text: page.text?.trim() || ''
  }));

  if (!pages.some((page) => page.text)) {
    throw new Error(SCANNED_PDF_MESSAGE);
  }

  return {
    totalPages: pdfData.total,
    pages
  };
};

const createChunksForPages = async ({ pages, documentId }) => {
  let chunkIndex = 0;
  for (const page of pages) {
    const pageChunks = chunkText(page.text, 1000, 200);
    for (const text of pageChunks) {
      const embedding = await generateDocumentEmbedding(text);
      await Chunk.create({
        document_id: documentId,
        text_content: text,
        embedding,
        chunk_index: chunkIndex,
        page_number: page.pageNumber
      });
      chunkIndex += 1;
    }
  }
  if (chunkIndex === 0) {
    throw new Error(SCANNED_PDF_MESSAGE);
  }
};

const getSafeDevError = (error) => {
  if (process.env.NODE_ENV !== 'development') return undefined;
  if (!error?.message) return undefined;
  if (error.message.includes('GEMINI_API_KEY')) return undefined;
  return error.message;
};

const deleteUploadedFile = async (fileUrl) => {
  if (!fileUrl) return;
  const uploadsRoot = path.resolve(UPLOAD_DIR);
  const filePath = path.resolve(fileUrl);
  if (!filePath.startsWith(`${uploadsRoot}${path.sep}`)) return;
  await fs.promises.unlink(filePath).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
};

export const uploadDocument = async (req, res) => {
  let document = null;
  try {
    const userId = req.user?.userId || req.user?.id; 

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui long chon file PDF.' });
    }

    document = await Document.create({
      owner_id: userId || null,
      original_name: req.file.originalname,
      display_name: req.file.originalname,
      file_url: req.file.path,
      size: req.file.size,
      mime_type: req.file.mimetype,
      total_pages: 0,
      status: 'PROCESSING',
      error_message: null
    });

    const { totalPages, pages } = await getPdfPages(req.file.path);
    await createChunksForPages({ pages, documentId: document._id });

    document.total_pages = totalPages;
    document.status = 'READY';
    document.error_message = null;
    await document.save();

    return res.status(201).json({
      success: true,
      message: 'Tai va xu ly file PDF thanh cong!',
      data: document
    });
  } catch (error) {
    if (document) {
      try {
        await Chunk.deleteMany({ document_id: document._id });
        document.status = 'FAILED';
        document.error_message = error.message;
        await document.save();
      } catch (e) {}
    } else if (req.file?.path && fs.existsSync(req.file.path)) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }
    return res.status(500).json({ success: false, message: 'Khong the xu ly tai lieu PDF.', error: getSafeDevError(error) });
  }
};

// ĐÃ SỬA: Lấy tên người dùng bằng thủ công thay vì populate để tránh sập API
export const getAllDocuments = async (req, res) => {
  try {
    // 1. Lấy toàn bộ tài liệu
    const documents = await Document.find().sort({ created_at: -1 }).lean();

    // 2. Lấy toàn bộ User để chuẩn bị ghép nối
    const users = await User.find().select('name email full_name').lean();
    
    // Tạo 1 từ điển (Map) để dò tìm User ID cho nhanh
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    // 3. Ghép tên vào từng tài liệu
    const formattedDocs = documents.map(doc => {
      let ownerName = 'Người dùng ẩn';
      
      if (doc.owner_id && userMap[doc.owner_id.toString()]) {
        const u = userMap[doc.owner_id.toString()];
        ownerName = u.name || u.full_name || u.email || 'Người dùng hệ thống';
      }

      return {
        ...doc,
        owner_name: ownerName
      };
    });

    res.status(200).json({ success: true, count: formattedDocs.length, data: formattedDocs });
  } catch (error) {
    console.error("Lỗi get documents:", error);
    res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ success: false, message: 'Khong tim thay tai lieu nay!' });
    await Chunk.deleteMany({ document_id: documentId });
    await Message.deleteMany({ document_id: documentId });
    await Document.findByIdAndDelete(documentId);
    await deleteUploadedFile(document.file_url);
    res.status(200).json({ success: true, message: 'Da xoa tai lieu!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

export const summarizeDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || document.status !== 'READY') return res.status(400).json({ success: false, message: 'Tai lieu chua san sang!' });
    const chunks = await Chunk.find({ document_id: req.params.id }).sort({ chunk_index: 1 });
    const fullText = chunks.map(c => c.text_content).join('\n\n');
    const summaryResult = await generateSummary(fullText);
    res.status(200).json({ success: true, summary: summaryResult });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

export const compareDocuments = async (req, res) => {
  try {
    const { doc_id_1, doc_id_2, criteria } = req.body;
    if (!doc_id_1 || !doc_id_2 || !criteria) return res.status(400).json({ success: false, message: 'Thieu thong tin!' });
    const chunksA = await Chunk.find({ document_id: doc_id_1 }).limit(15);
    const contextA = chunksA.map(c => c.text_content).join('\n');
    const chunksB = await Chunk.find({ document_id: doc_id_2 }).limit(15);
    const contextB = chunksB.map(c => c.text_content).join('\n');
    const comparisonResult = await generateComparison(contextA, contextB, criteria);
    res.status(200).json({ success: true, comparison: comparisonResult });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};