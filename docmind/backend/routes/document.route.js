import express from 'express';
import { 
  uploadDocument, 
  uploadConfig, 
  getAllDocuments, 
  deleteDocument, 
  summarizeDocument, 
  compareDocuments 
} from '../controllers/document.controller.js';

const router = express.Router();

// Route 1: Upload file PDF
router.post('/upload', uploadConfig.single('pdf_file'), uploadDocument);

// Route 2: Lấy danh sách file
router.get('/', getAllDocuments);

// Route 3: Xóa file theo ID
router.delete('/:id', deleteDocument);

// Route 4: Tóm tắt tài liệu
router.post('/:id/summary', summarizeDocument);

// Route 5: So sánh 2 tài liệu
router.post('/compare', compareDocuments);

export default router;