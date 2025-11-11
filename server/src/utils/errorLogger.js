// errorLogger.js - Centralized error logging utility

/**
 * Mock error reporting service
 * In production, this would integrate with services like:
 * - Sentry
 * - LogRocket
 * - DataDog
 * - CloudWatch
 * - Custom logging service
 */
const errorReportingService = {
  logError: (error, context = {}) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context: {
        ...context,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
      },
    };

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Mock API call to error reporting service
      // fetch('https://api.error-reporting-service.com/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorLog),
      // }).catch(console.error);
      
      console.error('🚨 [ERROR REPORTING SERVICE]', JSON.stringify(errorLog, null, 2));
    } else {
      // In development, log to console with formatting
      console.error('🚨 [ERROR LOG]', errorLog);
    }
  },
};

/**
 * Log unhandled promise rejection
 */
const logUnhandledRejection = (err, promise) => {
  errorReportingService.logError(err, {
    type: 'unhandledRejection',
    promise: promise?.toString(),
    warning: 'Unhandled promise rejection detected',
  });
};

/**
 * Log uncaught exception
 */
const logUncaughtException = (err) => {
  errorReportingService.logError(err, {
    type: 'uncaughtException',
    warning: 'Uncaught exception detected - server will shut down',
  });
};

/**
 * Log application error (from error handler middleware)
 */
const logApplicationError = (err, req = {}) => {
  errorReportingService.logError(err, {
    type: 'applicationError',
    request: {
      method: req.method,
      url: req.originalUrl || req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip || req.connection?.remoteAddress,
    },
  });
};

/**
 * Log database error
 */
const logDatabaseError = (err, operation = 'unknown') => {
  errorReportingService.logError(err, {
    type: 'databaseError',
    operation,
    database: 'MongoDB',
  });
};

module.exports = {
  logUnhandledRejection,
  logUncaughtException,
  logApplicationError,
  logDatabaseError,
  errorReportingService,
};






