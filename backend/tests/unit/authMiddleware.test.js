const jwt = require('jsonwebtoken');
const { protect } = require('../../src/middleware/auth');

describe('Auth Middleware - protect', () => {
  let req, res, next;
  const JWT_SECRET = 'test-secret-key';

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should return 401 when no Authorization header is present', () => {
    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when Authorization header has no Bearer token', () => {
    req.headers.authorization = 'Basic some-credentials';

    protect(req, res, next);

    // 'Basic some-credentials'.split(' ')[1] is 'some-credentials' which is not a valid JWT
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalid or expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token';

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalid or expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is expired', () => {
    const expiredToken = jwt.sign(
      { id: 'user123', email: 'test@example.com' },
      JWT_SECRET,
      { expiresIn: '-1s' }
    );
    req.headers.authorization = `Bearer ${expiredToken}`;

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalid or expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is signed with a different secret', () => {
    const wrongSecretToken = jwt.sign(
      { id: 'user123', email: 'test@example.com' },
      'wrong-secret'
    );
    req.headers.authorization = `Bearer ${wrongSecretToken}`;

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalid or expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() and attach decoded user when token is valid', () => {
    const payload = { id: 'user123', email: 'admin@freshflock.com', role: 'admin' };
    const validToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    req.headers.authorization = `Bearer ${validToken}`;

    protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user123');
    expect(req.user.email).toBe('admin@freshflock.com');
    expect(req.user.role).toBe('admin');
  });

  it('should return 401 when Authorization header is "Bearer " with empty token', () => {
    req.headers.authorization = 'Bearer ';

    protect(req, res, next);

    // 'Bearer '.split(' ')[1] is '' which is falsy
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
    expect(next).not.toHaveBeenCalled();
  });
});
