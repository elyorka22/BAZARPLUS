module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run start:next',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    },
    {
      name: 'bot',
      script: 'npm',
      args: 'run bot',
      env: {
        NODE_ENV: 'production'
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/bot-error.log',
      out_file: './logs/bot-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}
