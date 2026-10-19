/**
 * Production MongoDB Connection Handler via Mongoose
 * Architecture: Optimized Connection Pooling, Auto-Reconnect & Graceful Teardown
 */
const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: config.isProd ? 50 : 20, // 50 concurrent sockets in production cluster
      minPoolSize: config.isProd ? 10 : 2,  // Maintain warm pool
      serverSelectionTimeoutMS: 5000,       // Fail fast if Mongo is unreachable
      socketTimeoutMS: 45000,               // Close sockets after 45 seconds of inactivity
      family: 4,                            // Force IPv4 to prevent IPv6 DNS lookup delays
      heartbeatFrequencyMS: 10000,          // Check replica set status every 10s
    };

    mongoose.connection.on('connected', () => {
      console.log(`[Database] MongoDB successfully connected to: ${mongoose.connection.name}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[Database Error] MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB connection lost. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[Database] MongoDB connection re-established');
    });

    const conn = await mongoose.connect(config.mongodbUri, options);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
    if (config.isProd) {
      console.error('[Database Fatal] Production requires a working MongoDB instance. Halting process.');
      process.exit(1);
    } else {
      console.warn('[Database] Running in development mode without MongoDB. Ensure MongoDB is running for persistence.');
    }
    return null;
  }
};

module.exports = connectDB;
