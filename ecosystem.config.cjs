module.exports = {
  apps: [
    {
      name: 'rmsa-academy',
      script: './server.js',
      instances: 1, // SQLite khuyến nghị 1 tiến trình duy nhất (Single-Writer) để đạt hiệu năng tối đa và tránh tranh chấp ghi
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true
    }
  ]
};
