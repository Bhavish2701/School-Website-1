/**
 * Rate Limiting Middleware
 * Protects APIs against brute-force attacks and denial-of-service
 */
const rateLimit = require('express-rate-limit');
const { formatError } = require('../utils/apiResponse');

/**
 * Standard API Rate Limiter
 * 200 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 10000 : 200,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      formatError(
        'Too many requests from this IP. Please try again after 15 minutes.',
        { rateLimit: 'API rate limit exceeded. Please throttle your requests.' }
      )
    );
  },
});

/**
 * Strict Authentication Rate Limiter
 * 10 login / credential reset attempts per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : (process.env.NODE_ENV === 'test' ? 10000 : 500),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      formatError(
        'Too many authentication attempts. Please try again after 15 minutes.',
        { authLimit: 'Authentication rate limit reached. Access temporarily locked.' }
      )
    );
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
