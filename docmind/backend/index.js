import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import thêm thư viện Socket.IO
import http from 'http';
import { Server } from 'socket.io';

// Import Routes
import authRoutes from './routes/auth.route.js';
import documentRoutes from './routes/document.route.js';
import chatRoutes from './routes/chat.route.js';
import adminRoutes from './routes/admin.route.js';
import notificationRoutes from './routes/notification.route.js';
import userDashboardRoutes from './routes/userDashboard.route.js';
import historyRoutes from './routes/history.route.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Cấu hình CORS
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = new Set([
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

app.use(
  cors({
    origin: Array.from(allowedOrigins),
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// --- KHỞI TẠO HTTP SERVER VÀ SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: Array.from(allowedOrigins),
    credentials: true,
  }
});

// Lắng nghe các kết nối Realtime từ Frontend
io.on('connection', (socket) => {
  console.log('🟢 Một user vừa kết nối Socket.IO:', socket.id);

  // Khi user đăng nhập thành công, FE sẽ gọi hàm này để join vào room riêng biệt
  socket.on('join_room', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} đã join phòng nhận thông báo!`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User ngắt kết nối:', socket.id);
  });
});

// Đính kèm "io" vào request để các Controller có thể dùng nó bắn thông báo
app.use((req, res, next) => {
  req.io = io;
  next();
});
// ------------------------------------------

// Đăng ký API
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userDashboardRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Chú ý: Đổi app.listen thành server.listen để chạy cả API và Socket cùng lúc
server.listen(PORT, () => {
  console.log(`🚀 Server HTTP & Socket.IO is running on http://localhost:${PORT}`);
});
