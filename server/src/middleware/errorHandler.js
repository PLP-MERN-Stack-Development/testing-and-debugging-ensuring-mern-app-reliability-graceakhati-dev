// errorHandler.js - Enhanced error handling middleware

const errorLogger = require('../utils/errorLogger');

/**
 * Enhanced error handler middleware
 * Catches all errors and formats consistent responses
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to error reporting service
  errorLogger.logApplicationError(err, req);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // MongoDB connection error
  if (err.name === 'MongoServerError' || err.name === 'MongoError') {
    errorLogger.logDatabaseError(err, 'database_operation');
    const message = 'Database operation failed';
    error = { message, statusCode: 500 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Determine status code
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  // Format consistent error response
  const errorResponse = {
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: {
        name: err.name,
        code: err.code,
      },
    }),
  };

  // Log error details in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ [ERROR HANDLER]', {
      statusCode,
      message,
      path: req.originalUrl,
      method: req.method,
      error: err.toString(),
    });
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

