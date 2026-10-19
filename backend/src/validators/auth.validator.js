/**
 * Authentication Input Validation Helper
 */
const ApiError = require('../utils/apiError');

const validateLogin = (req, res, next) => {
  const { username, email, identifier, password } = req.body;
  const userIdentifier = identifier || username || email;

  const errors = [];
  if (!userIdentifier || !userIdentifier.trim()) {
    errors.push({ field: 'identifier', message: 'Username or email is required' });
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    throw ApiError.validation(errors, 'Validation error during login');
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }
  if (!newPassword || newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters long' });
  }
  if (newPassword !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'New password and confirmation do not match' });
  }

  if (errors.length > 0) {
    throw ApiError.validation(errors, 'Validation error during password change');
  }

  next();
};

const validateForgotPassword = (req, res, next) => {
  const { email, identifier, username } = req.body;
  const target = email || identifier || username;

  if (!target || !target.trim()) {
    throw ApiError.validation(
      [{ field: 'email', message: 'Email or username is required to request a password reset' }],
      'Validation error'
    );
  }

  next();
};

const validateResetPassword = (req, res, next) => {
  const { resetToken, newPassword, confirmPassword } = req.body;
  const errors = [];

  if (!resetToken || !resetToken.trim()) {
    errors.push({ field: 'resetToken', message: 'Reset token is required' });
  }
  if (!newPassword || newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters long' });
  }
  if (newPassword !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    throw ApiError.validation(errors, 'Validation error during password reset');
  }

  next();
};

module.exports = {
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
};
