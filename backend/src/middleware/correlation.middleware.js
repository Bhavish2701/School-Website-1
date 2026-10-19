/**
 * Correlation ID Middleware
 * Assigns a unique request ID to track request lifecycles.
 */
const crypto = require('crypto');

const correlationMiddleware = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = incomingId || crypto.randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

module.exports = correlationMiddleware;
