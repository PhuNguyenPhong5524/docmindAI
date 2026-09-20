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

// Đã gỡ bỏ authorizeRole, chỉ giữ lại authMiddleware để xác thực người dùng đã đăng nhập
router.post('/upload', authMiddleware, uploadConfig.single('pdf_file'), handleUploadErrors, uploadDocument);

router.get('/', authMiddleware, getAllDocuments);

router.delete('/:id', authMiddleware, deleteDocument);

router.post('/:id/summary', authMiddleware, summarizeDocument);

router.post('/compare', authMiddleware, compareDocuments);

export default router;
