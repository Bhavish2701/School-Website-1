/**
 * Authentication Controller
 * Implements JWT authentication, token lifecycle, and credential management
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const { User } = require('../models/user.model');

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and issue JWT access & refresh tokens
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { username, email, identifier, password } = req.body;
  const userIdentifier = (identifier || username || email || '').trim().toLowerCase();

  // Find user by username or email and include password field
  const user = await User.findOne({
    $or: [{ username: userIdentifier }, { email: userIdentifier }],
  }).select('+password +refreshToken');

  if (!user) {
    throw ApiError.unauthorized('Invalid username/email or password', 'INVALID_CREDENTIALS');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid username/email or password', 'INVALID_CREDENTIALS');
  }

  // Check account active status
  if (!user.isActive) {
    throw ApiError.forbidden(
      'Your account is deactivated. Please contact the administrator.',
      'ACCOUNT_DEACTIVATED'
    );
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Persist refresh token & last login timestamp
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: config.jwt.expire,
      },
    },
  });
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Invalidate refresh token and log user out
 * @access  Public / Authenticated
 */
const logout = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken;

  if (req.user) {
    // If authenticated via middleware
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
  } else if (incomingRefreshToken) {
    // If client supplied refreshToken in body
    await User.updateOne(
      { refreshToken: incomingRefreshToken },
      { $unset: { refreshToken: 1 } }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Exchange valid refresh token for a new access token
 * @access  Public
 */
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required', 'MISSING_REFRESH_TOKEN');
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token. Please log in again.', 'INVALID_REFRESH_TOKEN');
  }

  // Find user and select stored refresh token
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    throw ApiError.unauthorized('Refresh token is invalid or has been revoked', 'TOKEN_REVOKED');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Account is deactivated', 'ACCOUNT_DEACTIVATED');
  }

  // Issue new access token and rotate refresh token
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: 'Bearer',
        expiresIn: config.jwt.expire,
      },
    },
  });
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get currently authenticated user's profile
 * @access  Protected
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current user profile retrieved',
    data: {
      user: req.user.toJSON(),
    },
  });
});

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change authenticated user's password
 * @access  Protected
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Retrieve user with password hash
  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
  }

  // Update password and invalidate active refresh tokens
  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please log in again with your new password.',
  });
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Generate password reset token
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email, identifier, username } = req.body;
  const target = (email || identifier || username || '').trim().toLowerCase();

  const user = await User.findOne({
    $or: [{ email: target }, { username: target }],
  });

  // Always return consistent response to prevent username enumeration attacks
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account matches the provided identifier, a password reset token has been generated.',
    });
  }

  // Generate reset token and set expiry
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Password reset token generated successfully.',
    data: {
      resetToken,
      expiresIn: '15 minutes',
    },
  });
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // Hash incoming token to match stored sha256 hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw ApiError.badRequest('Password reset token is invalid or has expired', 'INVALID_RESET_TOKEN');
  }

  // Set new password and clear reset fields
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password has been successfully reset. Please log in with your new password.',
  });
});

module.exports = {
  login,
  logout,
  refresh,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
