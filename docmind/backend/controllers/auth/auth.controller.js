import User from '../../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Tính năng Đăng ký
// export const register = async (req, res) => {
//   try {
//     const { full_name, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ full_name, email, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ success: true, message: 'Đăng ký thành công' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Lỗi server' });
//   }
// };

export const register = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword } = req.body;

    // Validate dữ liệu
    if (!full_name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu xác nhận không khớp",
      });
    }

    // Check email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user theo model
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: "USER",
      isActive: true,
    });

    return res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      user: {
        _id: newUser._id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi đăng ký tài khoản!",
      error: error.message,
    });
  }
};


// Tính năng Đăng nhập
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || user.status === 'BLOCKED') {
//       return res.status(400).json({ success: false, message: 'Sai email hoặc tài khoản bị khóa' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Sai mật khẩu' });
//     }

//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_SECRET, { expiresIn: '1d' });
//     res.status(200).json({ success: true, token, user: { full_name: user.full_name, email: user.email, role: user.role } });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Lỗi server' });
//   }
// };


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // tìm user bằng email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Account is locked",
      });
    }

    // access token (ngắn hạn)
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      ACCESS_SECRET,
      { expiresIn: "30m" },
    );

    // refresh token (dài hạn)
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // lưu refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // trả data cho frontend
    //local
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false, // true nếu deploy HTTPS
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    // });
    // deploy
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};