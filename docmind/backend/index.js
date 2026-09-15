import express from "express";
import cors from "cors";
import authRoutes from './routes/auth.route.js';
import documentRoutes from './routes/document.route.js';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import User from './models/user.model.js';
import Document from './models/document.model.js';
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
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

// Middleware xử lý dữ liệu đầu vào
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
// Route cơ bản để kiểm tra server
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend Node.js/Express đang chạy thành công!",
  });
});

// Kết nối MongoDB (Đã ghép nối với file .env của Tiến)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// API Đăng ký tài khoản (Đã đồng bộ trường full_name theo Business Rule)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body; 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng!' });
    }
    const newUser = new User({ full_name, email, password });
    await newUser.save();
    res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API lấy danh sách document
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});  

// Khởi chạy HTTP Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});