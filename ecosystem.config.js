module.exports = {
  apps: [
    {
      name: 'webhook',
      script: './server.js',
      error_file: './logs/error.log', // Archivo para errores
      out_file: './logs/output.log', // Archivo para logs estándar
      log_date_format: 'YYYY-MM-DD HH:mm', // Formato de fecha para los logs
    },
  ],
};
