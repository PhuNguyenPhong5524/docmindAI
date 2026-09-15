import fs from 'fs';
import multer from 'multer';
import Document from '../models/document.model.js';
import { chunkText } from '../services/chunker.service.js';
import { PDFParse } from 'pdf-parse'; // <-- ĐIỂM MẤU CHỐT: Gọi Class của bản V2

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

    // --- CÁCH ĐỌC CHUẨN CỦA BẢN V2 ---
    const dataBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();

    // Lấy thông tin bản text (xử lý linh hoạt để tránh lỗi undefined)
    const extractedText = pdfData.text || pdfData;
    const totalPages = pdfData.total || 1;

    // Cắt Chunk
    const textChunks = chunkText(extractedText, 1000, 200);

    newDoc.total_pages = totalPages;
    newDoc.status = 'READY';
    await newDoc.save();

    res.status(201).json({ 
      success: true, 
      message: 'Tải, đọc và cắt file PDF thành công!', 
      data: newDoc,
      total_chunks: textChunks.length, 
      preview_text: extractedText.substring(0, 150) 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xử lý file: ' + error.message });
  }
};