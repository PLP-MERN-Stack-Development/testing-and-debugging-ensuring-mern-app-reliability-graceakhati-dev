// asyncHandler.js - Async error handler wrapper

/**
 * Wraps async route handlers to catch errors
 * Prevents unhandled promise rejections in async routes
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;






