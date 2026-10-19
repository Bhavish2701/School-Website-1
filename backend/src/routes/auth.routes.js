/**
 * Authentication Routes
 * Base mount path: /api/v1/auth
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const {
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
} = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

// Public Authentication Endpoints (with rate limiting on sensitive routes)
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authLimiter, validateForgotPassword, authController.forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, authController.resetPassword);

// Protected Authentication Endpoints
router.get('/me', authenticate, authController.getMe);
router.post('/change-password', authenticate, validateChangePassword, authController.changePassword);

module.exports = router;
