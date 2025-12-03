// errores.js

// Error base personalizado para la aplicación
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error para validaciones de datos
class ValidationError extends AppError {
  constructor(message = 'Error de validación', details) {
    super(message, 400);
    this.details = details;
  }
}

// Error para recursos no encontrados
class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(`${resource} no encontrado`, 404);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
};
