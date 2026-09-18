import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import Document from '../models/document.model.js';
import Chunk from '../models/chunk.model.js';
import Message from '../models/message.model.js';
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

  if (!filePath.startsWith(`${uploadsRoot}${path.sep}`)) {
    console.warn(`Bo qua xoa file ngoai thu muc uploads: ${fileUrl}`);
    return;
  }

  await fs.promises.unlink(filePath).catch((error) => {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  });
};

export const uploadDocument = async (req, res) => {
  let document = null;

  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Khong xac dinh duoc nguoi dung.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui long chon file PDF.'
      });
    }

    document = await Document.create({
      owner_id: userId,
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

    await createAndEmitNotification({
      io: req.io,
      userId: document.owner_id,
      documentId: document._id,
      title: 'Tai lieu da san sang',
      message: `File PDF "${document.display_name}" da xu ly xong. Ban co the tro chuyen ngay bay gio!`,
      type: 'SUCCESS',
      event: 'document:ready'
    });

    return res.status(201).json({
      success: true,
      message: 'Tai va xu ly file PDF thanh cong!',
      data: {
        _id: document._id,
        original_name: document.original_name,
        display_name: document.display_name,
        file_url: document.file_url,
        size: document.size,
        mime_type: document.mime_type,
        total_pages: document.total_pages,
        status: document.status,
        created_at: document.created_at
      }
    });
  } catch (error) {
    console.error('Loi xu ly tai lieu:', error.message);

    if (document) {
      try {
        await Chunk.deleteMany({ document_id: document._id });

        document.status = 'FAILED';
        document.error_message = error.message;
        await document.save();

        await createAndEmitNotification({
          io: req.io,
          userId: document.owner_id,
          documentId: document._id,
          title: 'Xu ly tai lieu that bai',
          message: `Khong the xu ly file "${document.display_name}".`,
          type: 'ERROR',
          event: 'document:failed'
        });
      } catch (cleanupError) {
        console.error('Loi cleanup tai lieu:', cleanupError.message);
      }
    } else if (req.file?.path && fs.existsSync(req.file.path)) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: 'Khong the xu ly tai lieu PDF.',
      error: getSafeDevError(error)
    });
  }
};

// API 2: Lay danh sach tai lieu
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ created_at: -1 });
    res.status(200).json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Loi he thong: ' + error.message });
  }
};

// API 3: Xoa tai lieu
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

// API 4: Tom tat
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

// API 5: So sanh
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
