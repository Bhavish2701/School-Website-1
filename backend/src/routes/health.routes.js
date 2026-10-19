/**
 * Production Health & Diagnostics Routes
 * Implements:
 * - GET /api/v1/health (Full system metrics & DB latency)
 * - GET /api/v1/health/live (Liveness probe for Docker / Kubernetes)
 * - GET /api/v1/health/ready (Readiness probe verifying DB connectivity)
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const MONGO_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * @route   GET /api/v1/health/live
 * @desc    Kubernetes / Docker liveness probe
 * @access  Public
 */
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /api/v1/health/ready
 * @desc    Kubernetes / Docker / Nginx readiness probe
 * @access  Public
 */
router.get('/ready', async (req, res) => {
  const isDbReady = mongoose.connection.readyState === 1;

  if (!isDbReady) {
    return res.status(503).json({
      status: 'DOWN',
      message: 'Database connection is not ready',
      databaseState: MONGO_STATES[mongoose.connection.readyState] || 'unknown',
      timestamp: new Date().toISOString(),
    });
  }

  res.status(200).json({
    status: 'READY',
    message: 'API and Database ready to receive traffic',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /api/v1/health
 * @desc    Detailed system health diagnostics & resource consumption
 * @access  Public
 */
router.get('/', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  let dbLatencyMs = null;

  if (dbState === 1 && mongoose.connection.db) {
    try {
      const pingStart = Date.now();
      await mongoose.connection.db.admin().ping();
      dbLatencyMs = Date.now() - pingStart;
    } catch (e) {
      dbLatencyMs = -1;
    }
  }

  const memoryUsage = process.memoryUsage();
  const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const isHealthy = dbState === 1;
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    status: isHealthy ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'production',
    service: 'Sri Vidya E.M High School Backend REST API',
    version: '1.0.0',
    database: {
      status: MONGO_STATES[dbState] || 'unknown',
      name: mongoose.connection.name || 'srividya_school_db',
      latencyMs: dbLatencyMs,
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      pid: process.pid,
      memory: {
        rss: formatMb(memoryUsage.rss),
        heapTotal: formatMb(memoryUsage.heapTotal),
        heapUsed: formatMb(memoryUsage.heapUsed),
      },
    },
  });
});

module.exports = router;
