/**
 * Centralized Environment Configuration
 */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/srividya_school_db',
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:8080,http://127.0.0.1:8080')
    .split(',')
    .map(origin => origin.trim()),
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_fallback_secret_key_2026',
    expire: process.env.JWT_EXPIRE || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_fallback_secret_2026',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  paymentSecret: process.env.PAYMENT_SECRET || 'srividya_payment_gateway_hmac_secret_2026',
};

module.exports = config;
