// PM2 ecosystem file for production deployment
module.exports = {
  apps: [
    {
      name: "humbas-server",
      script: "./server.js",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      watch: false,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};

