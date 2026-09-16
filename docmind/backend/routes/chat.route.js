import express from 'express';
import { askQuestion, getChatHistory } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/ask', askQuestion);
router.get('/history/:document_id', getChatHistory);

export default router;