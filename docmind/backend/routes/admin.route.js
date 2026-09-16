import express from 'express';
import { getDashboardStats, getAllUsers, toggleUserLock } from '../controllers/admin.controller.js';

const router = express.Router();

// Route 1: Xem Dashboard
router.get('/dashboard', getDashboardStats);

// Route 2: Quản lý danh sách User
router.get('/users', getAllUsers);

// Route 3: Khóa/Mở khóa tài khoản
router.patch('/users/:id/toggle-lock', toggleUserLock);

export default router;