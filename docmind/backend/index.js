import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
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

// Route cơ bản để kiểm tra server
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend Node.js/Express đang chạy thành công!",
  });
});
// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));
// Khởi chạy HTTP Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});