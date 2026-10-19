/**
 * Custom Operational API Error Class
 */
class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error', code = 'INTERNAL_ERROR', errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', errors = {}) {
    return new ApiError(400, message, code, errors);
  }

  static unauthorized(message = 'Authentication required', code = 'UNAUTHORIZED', errors = {}) {
    return new ApiError(401, message, code, errors);
  }

  static forbidden(message = 'Access forbidden: Insufficient permissions', code = 'FORBIDDEN', errors = {}) {
    return new ApiError(403, message, code, errors);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND', errors = {}) {
    return new ApiError(404, message, code, errors);
  }

  static conflict(message = 'Resource conflict or duplicate entry', code = 'CONFLICT', errors = {}) {
    return new ApiError(409, message, code, errors);
  }

  static validation(errors = {}, message = 'Validation failed') {
    return new ApiError(422, message, 'VALIDATION_ERROR', errors);
  }

  static internal(message = 'An unexpected server error occurred', errors = {}) {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR', errors);
  }
}

module.exports = ApiError;
