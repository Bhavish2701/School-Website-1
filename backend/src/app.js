/**
 * Express Application Configuration and Middleware Pipeline
 * Production Architecture: Cloudflare -> Nginx -> Express API Cluster
 */
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const { securityHeaders, sanitizeInput } = require('./middleware/security.middleware');
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const correlationMiddleware = require('./middleware/correlation.middleware');
const loggerMiddleware = require('./middleware/logger.middleware');
const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const { formatSuccess } = require('./utils/apiResponse');
const apiV1Router = require('./routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Enable Trust Proxy for Cloudflare / Nginx reverse proxy headers (X-Forwarded-For, CF-Connecting-IP)
app.set('trust proxy', 1);

// Disable Express advertising header
app.disable('x-powered-by');

// 1. Security HTTP headers via Helmet
app.use(securityHeaders);

// 2. CORS middleware
app.use(cors(corsOptions));

// 3. Compression middleware (if available)
try {
  const compression = require('compression');
  app.use(
    compression({
      level: 6,
      threshold: 1024, // only compress responses above 1KB
    })
  );
} catch (e) {
  // Compression falls back cleanly to Nginx Gzip reverse proxy
}

// 4. Request Body Parsers (Limited to 1MB to prevent memory exhaustion DoS)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Recursive NoSQL Injection input sanitization
app.use(sanitizeInput);

// 6. Correlation ID & Structured Request Logging
app.use(correlationMiddleware);
app.use(loggerMiddleware);

// 7. Health Check Probes (Bypasses rate limiting for Docker/Nginx/K8s uptime monitors)
app.use('/api/v1/health', healthRoutes);

// 8. Global API Rate Limiting (Applied to all user-facing endpoints)
app.use(apiLimiter);

// 9. Root Landing Endpoint
app.get('/', (req, res) => {
  res.status(200).json(
    formatSuccess(
      {
        name: 'Sri Vidya E.M High School Production API',
        version: '1.0.0',
        apiVersion: '/api/v1',
        healthCheck: '/api/v1/health',
      },
      'Welcome to Sri Vidya E.M High School REST API'
    )
  );
});

// 10. Mount Version 1 Core APIs
app.use('/api/v1', apiV1Router);

// 11. Catch 404 for undefined routes
app.use(notFoundMiddleware);

// 12. Centralized Production Error Handler
app.use(errorHandler);

module.exports = app;
