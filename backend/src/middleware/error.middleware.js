/**
 * Centralized Error Handling Middleware
 *
 * Formats all exceptions to the uniform contract:
 * {
 *   "success": false,
 *   "message": "...",
 *   "data": null,
 *   "errors": {}
 * }
 */
const ApiError = require('../utils/apiError');
const { formatError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log unexpected errors
  if (!(err instanceof ApiError)) {
    console.error(`[Unhandled Error] ${err.name}: ${err.message}`, err.stack);
  }

  // 1. Handle SyntaxError for malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = ApiError.badRequest('Malformed JSON in request payload', 'INVALID_JSON', {
      body: 'Malformed JSON syntax',
    });
  }

  // 2. Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    const message = `Invalid value for parameter '${err.path}'`;
    error = ApiError.badRequest(message, 'INVALID_PARAMETER', {
      [err.path]: `Invalid value: ${err.value}`,
    });
  }

  // 3. Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errorMap = {};
    Object.values(err.errors || {}).forEach((val) => {
      errorMap[val.path] = val.message;
    });
    error = ApiError.validation(errorMap, 'Validation failed for model');
  }

  // 4. Handle MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const duplicateFields = Object.keys(err.keyValue || {});
    const errorMap = {};
    duplicateFields.forEach((field) => {
      errorMap[field] = `${field} already exists`;
    });
    error = ApiError.conflict('Duplicate entry detected', 'DUPLICATE_KEY', errorMap);
  }

  // 5. Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token', 'TOKEN_INVALID', {
      token: 'Token is invalid or corrupted',
    });
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authentication token has expired', 'TOKEN_EXPIRED', {
      token: 'Token has expired',
    });
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'An unexpected server error occurred';
  const errors = error.errors || {};

  // Construct strict standard response:
  // { success: false, message: "...", data: null, errors: {} }
  const payload = formatError(message, errors);

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
