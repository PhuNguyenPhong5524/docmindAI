import fs from 'fs';
import multer from 'multer';
import Document from '../models/document.model.js';
import Chunk from '../models/chunk.model.js';
import Message from '../models/message.model.js'; // Đã bổ sung Message để xóa lịch sử Chat
import { chunkText } from '../services/chunker.service.js';
import { generateEmbedding } from '../services/ai.service.js'; 
import { PDFParse } from 'pdf-parse';

// Cấu hình thư mục lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Hệ thống chỉ hỗ trợ file PDF!'), false);
};

export const uploadConfig = multer({ storage, fileFilter });

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Vui lòng chọn file PDF' });

    // 1. Lưu thông tin file vào Database
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

    // 2. Đọc chữ từ PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();

    const extractedText = pdfData.text || pdfData;
    const totalPages = pdfData.total || 1;

    // 3. Cắt Chunk
    const textChunks = chunkText(extractedText, 1000, 200);

    // --- 4. TRÁI TIM AI: MÃ HÓA VÀ LƯU VECTOR ---
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
    console.log("Đã lưu toàn bộ tri thức vào Database thành công!");
    // ---------------------------------------------

    // 5. Cập nhật trạng thái READY
    newDoc.total_pages = totalPages;
    newDoc.status = 'READY';
    await newDoc.save();

    res.status(201).json({ 
      success: true, 
      message: 'Tải, đọc, cắt và mã hóa file PDF thành công rực rỡ!', 
      data: newDoc,
      total_chunks: textChunks.length
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xử lý file: ' + error.message });
  }
};

// API Lấy danh sách toàn bộ tài liệu đã tải lên
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: documents.length,
      data: documents 
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách tài liệu:", error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};

// API Xóa tài liệu và toàn bộ dữ liệu liên quan (Chunks, Messages)
export const deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài liệu này!' });
    }

    // Dọn rác: Xóa toàn bộ Chunks và Lịch sử Chat của file này
    await Chunk.deleteMany({ document_id: documentId });
    await Message.deleteMany({ document_id: documentId });
    
    // Xóa file trong bảng Document
    await Document.findByIdAndDelete(documentId);

    res.status(200).json({ 
      success: true, 
      message: 'Đã xóa tài liệu và dọn dẹp bộ nhớ AI thành công!' 
    });
  } catch (error) {
    console.error("Lỗi khi xóa tài liệu:", error);
    res.status(500).json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
  }
};