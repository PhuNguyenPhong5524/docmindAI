import express from 'express';
import { getUserNotifications, markAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', getUserNotifications);
router.patch('/:id/read', markAsRead);

export default router;