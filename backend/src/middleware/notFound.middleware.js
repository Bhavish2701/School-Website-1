/**
 * 404 Route Not Found Middleware
 */
const ApiError = require('../utils/apiError');

const notFoundMiddleware = (req, res, next) => {
  const message = `Route not found: ${req.method} ${req.originalUrl}`;
  next(ApiError.notFound(message, 'ROUTE_NOT_FOUND'));
};

module.exports = notFoundMiddleware;
