import express from 'express';
import { askQuestion, getChatHistory } from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, askQuestion);
router.post('/ask', authMiddleware, askQuestion);
router.get('/history/:document_id', authMiddleware, getChatHistory);

export default router;
