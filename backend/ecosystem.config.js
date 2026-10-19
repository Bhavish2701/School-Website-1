/**
 * Production PM2 Process Manager Configuration
 * Architecture: Multi-instance Cluster Mode with Auto-Restart & Log Management
 */
module.exports = {
  apps: [
    {
      name: 'srividya-api',
      script: 'src/server.js',
      instances: 'max', // Scale to all available CPU cores in cluster mode
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '800M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Process resilience
      autorestart: true,
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      listen_timeout: 8000,
      kill_timeout: 5000,
      // Structured log files
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
