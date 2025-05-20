const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route cho Đăng ký
// POST /api/auth/register
router.post('/register', authController.register);

// Route cho Xác thực Email
// GET /api/auth/verify-email?token=xxxx
router.get('/verify-email', authController.verifyEmail);

// Route cho Đăng nhập
// POST /api/auth/login
router.post('/login', authController.login);

// CÁC ROUTES KHÁC CHO AUTH SẼ THÊM SAU

module.exports = router;