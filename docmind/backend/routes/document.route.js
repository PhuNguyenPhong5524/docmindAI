import express from 'express';
import { uploadDocument, uploadConfig, getAllDocuments } from '../controllers/document.controller.js';

const router = express.Router();

// Route 1: Upload file PDF
router.post('/upload', uploadConfig.single('pdf_file'), uploadDocument);

// Route 2: Lấy danh sách file 
router.get('/', getAllDocuments);

export default router;