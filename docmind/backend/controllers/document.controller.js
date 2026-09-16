import fs from 'fs';
import multer from 'multer';
import Document from '../models/document.model.js';
import Chunk from '../models/chunk.model.js';
import Message from '../models/message.model.js';
import Notification from '../models/notification.model.js'; // Nhúng bảng Thông báo
import { chunkText } from '../services/chunker.service.js';
import { generateEmbedding, generateSummary, generateComparison } from '../services/ai.service.js'; 
import { PDFParse } from 'pdf-parse';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Hệ thống chỉ hỗ trợ file PDF!'), false);
};

export const uploadConfig = multer({ storage, fileFilter });

// API 1: Upload tài liệu (Đã tích hợp Notification & Socket.IO)
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Vui lòng chọn file PDF' });

    const newDoc = new Document({
      owner_id: "66f1234567890abcdef12345", 
      original_name: req.file.originalname,
      display_name: req.file.originalname,
      file_url: req.file.path,
      size: req.file.size,
      mime_type: req.file.mimetype,
      status: 'PROCESSING' 
    });
    await newDoc.save();

    const dataBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();

    const extractedText = pdfData.text || pdfData;
    const totalPages = pdfData.total || 1;

    const textChunks = chunkText(extractedText, 1000, 200);
    console.log(`Đang nhờ Gemini mã hóa ${textChunks.length} đoạn văn bản...`);
    
    const chunkPromises = textChunks.map(async (text, index) => {
      const vector = await generateEmbedding(text); 
      const newChunk = new Chunk({
        document_id: newDoc._id, 
        text_content: text,
        embedding: vector,       
        chunk_index: index
      });
      return newChunk.save(); 
    });

    await Promise.all(chunkPromises);

    newDoc.total_pages = totalPages;
    newDoc.status = 'READY';
    await newDoc.save();

    // --- TÍNH NĂNG MỚI: LƯU THÔNG BÁO VÀ BẮN SOCKET.IO ---
    const newNotification = new Notification({
      user_id: newDoc.owner_id,
      title: 'Tài liệu đã sẵn sàng',
      message: `File PDF "${newDoc.display_name}" đã xử lý xong. Bạn có thể trò chuyện ngay bây giờ!`,
      type: 'SUCCESS'
    });
    await newNotification.save();

    if (req.io) {
      req.io.to(`user:${newDoc.owner_id}`).emit('document:ready', { document_id: newDoc._id });
      req.io.to(`user:${newDoc.owner_id}`).emit('notification:new', newNotification);
    }
    // -----------------------------------------------------

    res.status(201).json({ 
      success: true, 
      message: 'Tải và xử lý file PDF thành công!', 
      data: newDoc
    });

  } catch (error) {
    console.error("Lỗi Upload:", error);
    res.status(500).json({ success: false, message: 'Lỗi khi xử lý file: ' + error.message });
  } 
};

// API 2: Lấy danh sách tài liệu
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// API 3: Xóa tài liệu
export const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu này!' });

    await Chunk.deleteMany({ document_id: documentId });
    await Message.deleteMany({ document_id: documentId });
    await Document.findByIdAndDelete(documentId);

    res.status(200).json({ success: true, message: 'Đã xóa tài liệu!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// API 4: Tóm tắt
export const summarizeDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || document.status !== 'READY') return res.status(400).json({ success: false, message: 'Tài liệu chưa sẵn sàng!' });

    const chunks = await Chunk.find({ document_id: req.params.id }).sort({ chunk_index: 1 });
    const fullText = chunks.map(c => c.text_content).join('\n\n');
    const summaryResult = await generateSummary(fullText);

    res.status(200).json({ success: true, summary: summaryResult });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// API 5: So sánh
export const compareDocuments = async (req, res) => {
  try {
    const { doc_id_1, doc_id_2, criteria } = req.body;
    if (!doc_id_1 || !doc_id_2 || !criteria) return res.status(400).json({ success: false, message: 'Thiếu thông tin!' });

    const chunksA = await Chunk.find({ document_id: doc_id_1 }).limit(15);
    const contextA = chunksA.map(c => c.text_content).join('\n');

    const chunksB = await Chunk.find({ document_id: doc_id_2 }).limit(15);
    const contextB = chunksB.map(c => c.text_content).join('\n');

    const comparisonResult = await generateComparison(contextA, contextB, criteria);
    res.status(200).json({ success: true, comparison: comparisonResult });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};