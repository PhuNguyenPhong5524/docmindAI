import express from 'express';
import { deleteUserHistorySession, getUserHistory } from '../controllers/history.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserHistory);
router.delete('/:document_id', authMiddleware, deleteUserHistorySession);

export default router;
