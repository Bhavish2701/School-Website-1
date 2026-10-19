/**
 * Standardized API Response Formatter
 *
 * Ensures consistent contract across all endpoints:
 * Success: { success: true, message: "...", data: {}, errors: null }
 * Error:   { success: false, message: "...", data: null, errors: {} }
 */

/**
 * Format success payload
 */
const formatSuccess = (data = {}, message = 'Operation completed successfully') => {
  return {
    success: true,
    message,
    data: data || {},
    errors: null,
  };
};

/**
 * Format error payload
 */
const formatError = (message = 'An error occurred', errors = {}) => {
  // Ensure errors is an object
  let formattedErrors = errors;
  if (Array.isArray(errors)) {
    formattedErrors = {};
    errors.forEach((err, idx) => {
      const key = err.field || err.param || `error_${idx}`;
      formattedErrors[key] = err.message || err.msg || String(err);
    });
  } else if (typeof errors !== 'object' || errors === null) {
    formattedErrors = { detail: String(errors) };
  }

  return {
    success: false,
    message,
    data: null,
    errors: formattedErrors,
  };
};

/**
 * Express helper to send formatted success response
 */
const sendSuccess = (res, data = {}, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json(formatSuccess(data, message));
};

/**
 * Express helper to send formatted error response
 */
const sendError = (res, message = 'Request failed', errors = {}, statusCode = 400) => {
  return res.status(statusCode).json(formatError(message, errors));
};

module.exports = {
  formatSuccess,
  formatError,
  sendSuccess,
  sendError,
  // Alias for backward compatibility
  apiResponse: (data = {}, message = 'Operation successful') => formatSuccess(data, message),
  ApiResponse: {
    success: (res, message = 'Operation successful', data = {}, statusCode = 200) => sendSuccess(res, data, message, statusCode),
    error: (res, message = 'Request failed', errors = {}, statusCode = 400) => sendError(res, message, errors, statusCode),
  },
};
