import express from 'express';
import multer from 'multer';
import { 
  uploadDocument, 
  uploadConfig, 
  getAllDocuments, 
  deleteDocument, 
  summarizeDocument, 
  compareDocuments 
} from '../controllers/document.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorizeRole from '../middleware/authorizeRole.middleware.js';

const router = express.Router();

const handleUploadErrors = (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File PDF khong duoc vuot qua 20MB.'
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || 'Khong the upload file PDF.'
  });
};

// Route 1: Upload file PDF
// Field upload thong nhat trong Postman/Frontend: pdf_file
router.post('/upload', authMiddleware, authorizeRole("USER"), uploadConfig.single('pdf_file'), handleUploadErrors, uploadDocument);

// Route 2: Lấy danh sách file
router.get('/', getAllDocuments);

// Route 3: Xóa file theo ID
router.delete('/:id', deleteDocument);

// Route 4: Tóm tắt tài liệu
router.post('/:id/summary', summarizeDocument);

// Route 5: So sánh 2 tài liệu
router.post('/compare', compareDocuments);

export default router;
