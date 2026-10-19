/**
 * Sri Vidya E.M High School Backend - HTTP Server Entry Point
 */
const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');
const seedUsers = require('./config/seed');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Seed default users if collection is empty
  await seedUsers();

  // Start HTTP Server
  const server = app.listen(config.port, () => {
    console.log('====================================================');
    console.log('  SRI VIDYA E.M HIGH SCHOOL - BACKEND API (v1)     ');
    console.log('====================================================');
    console.log(`  Environment  : ${config.nodeEnv}`);
    console.log(`  Listening on : http://localhost:${config.port}`);
    console.log(`  Health Check : http://localhost:${config.port}/api/v1/health`);
    console.log(`  Database URI : ${config.mongodbUri}`);
    console.log('====================================================');
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    console.error('[Process Error] Unhandled Rejection:', err.message);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    console.error('[Process Error] Uncaught Exception:', err.message);
    process.exit(1);
  });

  // Graceful Shutdown Signals
  const shutdown = (signal) => {
    console.log(`\n[Process] Received ${signal}. Shutting down gracefully...`);
    if (server) {
      server.close(() => {
        console.log('[Process] HTTP server closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer();
