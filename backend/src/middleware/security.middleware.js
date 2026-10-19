/**
 * Production Security Middleware Suite
 * Includes Helmet HTTP Headers, HSTS, and Recursive NoSQL Query Sanitization
 */
const helmet = require('helmet');

const isProd = process.env.NODE_ENV === 'production';

/**
 * Production Helmet configuration
 */
const securityHeaders = helmet({
  contentSecurityPolicy: isProd
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
        },
      }
    : false, // relaxed for development testing
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: isProd
    ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      }
    : false,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

/**
 * Sanitize NoSQL Injection
 * Recursively strips keys starting with '$' or containing '.' from target objects
 */
const sanitizeData = (target) => {
  if (target && typeof target === 'object') {
    Object.keys(target).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete target[key];
      } else if (typeof target[key] === 'object' && target[key] !== null) {
        sanitizeData(target[key]);
      }
    });
  }
};

const sanitizeInput = (req, res, next) => {
  if (req.body) sanitizeData(req.body);
  if (req.params) sanitizeData(req.params);
  if (req.query) sanitizeData(req.query);
  next();
};

module.exports = {
  securityHeaders,
  sanitizeInput,
};
