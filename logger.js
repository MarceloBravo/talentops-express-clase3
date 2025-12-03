const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'operations.log');

function write(level, message, meta) {
  try {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta: meta || null
    };
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  } catch (err) {
    // Si falla el logger, no interrumpir la app
    // eslint-disable-next-line no-console
    console.error('Logger error:', err);
  }
}

module.exports = {
  info: (message, meta) => write('info', message, meta),
  error: (message, meta) => write('error', message, meta),

  // Middleware para registrar cada petición y su resultado
  requestLogger: (req, res, next) => {
    const start = Date.now();

    // Esperar al evento finish para obtener el status code y tiempo
    res.on('finish', () => {
      const duration = Date.now() - start;
      // No registrar body completo en GET por tamaño, pero se incluye para POST/PUT/PATCH
      const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined;

      write('info', `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: duration,
        ip: req.ip,
        params: req.params,
        query: req.query,
        body
      });
    });

    next();
  }
};
