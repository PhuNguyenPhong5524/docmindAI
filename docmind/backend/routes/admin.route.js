import express from 'express';
import { getAllUsers, toggleUserLock, createUser } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Lấy danh sách users
router.get('/users', authMiddleware, getAllUsers);

// Khóa/Mở khóa user
router.patch('/users/:id/toggle-lock', authMiddleware, toggleUserLock);

// Thêm người dùng mới (Đường dẫn API mà lúc nãy Frontend gọi bị thiếu)
router.post('/users', authMiddleware, createUser);

export default router;