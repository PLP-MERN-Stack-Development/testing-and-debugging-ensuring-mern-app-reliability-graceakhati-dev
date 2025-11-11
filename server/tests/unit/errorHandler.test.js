// errorHandler.test.js - Tests for enhanced error handler

const errorHandler = require('../../src/middleware/errorHandler');
const errorLogger = require('../../src/utils/errorLogger');

// Mock error logger
jest.mock('../../src/utils/errorLogger');

describe('Enhanced Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/api/bugs',
      headers: {},
      body: {},
      query: {},
      params: {},
      ip: '127.0.0.1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Error Logging', () => {
    it('should log errors to error reporting service', () => {
      const error = new Error('Test error');
      errorHandler(error, req, res, next);

      expect(errorLogger.logApplicationError).toHaveBeenCalledWith(error, req);
    });
  });

  describe('Consistent Error Response Format', () => {
    it('should return consistent error response structure', () => {
      const error = new Error('Test error');
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
        })
      );
    });

    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');
      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(String),
          stack: expect.any(String),
          details: expect.any(Object),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Test error');
      errorHandler(error, req, res, next);

      const response = res.json.mock.calls[0][0];
      expect(response.stack).toBeUndefined();
      expect(response.details).toBeUndefined();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Database Error Handling', () => {
    it('should handle MongoDB connection errors', () => {
      const error = new Error('MongoDB connection failed');
      error.name = 'MongoServerError';

      errorHandler(error, req, res, next);

      expect(errorLogger.logDatabaseError).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
