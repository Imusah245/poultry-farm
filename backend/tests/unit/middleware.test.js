const errorHandler = require('../../src/middleware/errorHandler');
const validate = require('../../src/middleware/validate');
const { validationResult } = require('express-validator');

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn()
}));

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should return 500 status when no statusCode is set on error', () => {
    const err = new Error('Something went wrong');

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong'
    });
  });

  it('should use the error statusCode when provided', () => {
    const err = new Error('Not found');
    err.statusCode = 404;

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not found'
    });
  });

  it('should return default message when error has no message', () => {
    const err = {};

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error'
    });
  });

  it('should include stack trace in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const err = new Error('Dev error');
    err.statusCode = 400;

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Dev error',
        stack: expect.any(String)
      })
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should NOT include stack trace in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new Error('Prod error');
    err.statusCode = 400;

    errorHandler(err, req, res, next);

    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });
});

describe('validate middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should call next() when there are no validation errors', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });

    validate(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 with formatted errors when validation fails', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { path: 'email', msg: 'Valid email is required' },
        { path: 'password', msg: 'Password must be at least 8 characters' }
      ]
    });

    validate(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: [
        { field: 'email', message: 'Valid email is required' },
        { field: 'password', message: 'Password must be at least 8 characters' }
      ]
    });
  });
});
