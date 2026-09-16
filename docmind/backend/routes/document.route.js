import express from 'express';
import { uploadDocument, uploadConfig, getAllDocuments, deleteDocument } from '../controllers/document.controller.js';

const router = express.Router();

// Route 1: Upload file PDF
router.post('/upload', uploadConfig.single('pdf_file'), uploadDocument);

// Route 2: Lấy danh sách file
router.get('/', getAllDocuments);

// Route 3: Xóa file theo ID
router.delete('/:id', deleteDocument);

export default router;