import express from 'express';
import { register, login, logout } from '../controllers/auth/auth.controller.js';
import refreshToken from '../controllers/auth/refreshToken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post("/refresh-token", refreshToken );

export default router;