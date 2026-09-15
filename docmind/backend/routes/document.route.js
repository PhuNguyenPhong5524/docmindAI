import express from 'express';
import { uploadConfig, uploadDocument } from '../controllers/document.controller.js';

const router = express.Router();

// Tạo API đường dẫn /api/documents/upload
router.post('/upload', uploadConfig.single('pdf_file'), uploadDocument);

export default router;