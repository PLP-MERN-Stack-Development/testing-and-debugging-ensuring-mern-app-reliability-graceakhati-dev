// notFound.test.js - Unit tests for notFound middleware

const notFound = require('../../src/middleware/notFound');

describe('Not Found Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/nonexistent',
      method: 'GET',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('Positive Test Cases', () => {
    it('should call next with error containing correct message', () => {
      notFound(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - /api/nonexistent');
    });

    it('should handle different URL paths', () => {
      req.originalUrl = '/api/bugs/123';
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - /api/bugs/123');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should handle root path', () => {
      req.originalUrl = '/';
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - /');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should handle query parameters in URL', () => {
      req.originalUrl = '/api/bugs?status=open&priority=high';
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - /api/bugs?status=open&priority=high');
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty URL', () => {
      req.originalUrl = '';
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - ');
      expect(error.statusCode).toBe(404);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined originalUrl', () => {
      req.originalUrl = undefined;
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - undefined');
      expect(error.statusCode).toBe(404);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should handle null originalUrl', () => {
      req.originalUrl = null;
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - null');
      expect(error.statusCode).toBe(404);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should handle very long URLs', () => {
      const longUrl = '/api/' + 'a'.repeat(1000);
      req.originalUrl = longUrl;
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(`Not Found - ${longUrl}`);
      expect(error.statusCode).toBe(404);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should handle special characters in URL', () => {
      req.originalUrl = '/api/bugs/123?filter=test&sort=name';
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - /api/bugs/123?filter=test&sort=name');
      expect(error.statusCode).toBe(404);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should handle URL with hash', () => {
      req.originalUrl = '/api/bugs#section';
      notFound(req, res, next);

      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Not Found - /api/bugs#section');
      expect(error.statusCode).toBe(404);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('Middleware Chain Integration', () => {
    it('should work correctly when chained with error handler', () => {
      const errorHandler = require('../../src/middleware/errorHandler');
      const mockNext = jest.fn();
      
      // Call notFound which will call the callback with error
      notFound(req, res, (err) => {
        // Now call errorHandler with the error
        errorHandler(err, req, res, mockNext);
      });

      // Verify error handler processed the error correctly
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
    });

    it('should create error that can be handled by error handler', () => {
      notFound(req, res, (err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain('Not Found');
        expect(err.statusCode).toBe(404);
      });
    });
  });
});

