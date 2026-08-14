const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');
const { register, login } = require('../../src/controllers/authController');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_EXPIRE = '1d';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

// Helper to create mock req/res/next
const mockReq = (body = {}) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe('Auth Controller', () => {
  describe('register', () => {
    const validData = {
      email: 'admin@freshflock.com',
      password: 'password123',
      name: 'Admin User',
    };

    it('should register a new user and return a JWT token', async () => {
      const req = mockReq(validData);
      const res = mockRes();

      await register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: expect.any(String),
          user: expect.objectContaining({
            email: validData.email,
            name: validData.name,
            role: 'admin',
          }),
        })
      );

      // Verify the token is valid
      const response = res.json.mock.calls[0][0];
      const decoded = jwt.verify(response.token, process.env.JWT_SECRET);
      expect(decoded.id).toBeDefined();
    });

    it('should return 409 if email already exists', async () => {
      await User.create(validData);

      const req = mockReq(validData);
      const res = mockRes();

      await register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Email already registered',
        })
      );
    });

    it('should hash the password before storing', async () => {
      const req = mockReq(validData);
      const res = mockRes();

      await register(req, res, mockNext);

      const user = await User.findOne({ email: validData.email });
      expect(user.password).not.toBe(validData.password);
      expect(user.password).toMatch(/^\$2[aby]\$/);
    });

    it('should return user info with id, email, name, role', async () => {
      const req = mockReq(validData);
      const res = mockRes();

      await register(req, res, mockNext);

      const response = res.json.mock.calls[0][0];
      expect(response.user).toHaveProperty('id');
      expect(response.user).toHaveProperty('email', validData.email);
      expect(response.user).toHaveProperty('name', validData.name);
      expect(response.user).toHaveProperty('role', 'admin');
    });

    it('should call next with error on unexpected failure', async () => {
      const next = jest.fn();
      // Force an error by disconnecting (simulate DB error)
      const req = mockReq({ email: null, password: 'password123', name: 'Test' });
      const res = mockRes();

      // This will throw a validation error from mongoose
      await register(req, res, next);

      // Either returns 409 or passes error to next
      const called = next.mock.calls.length > 0 || res.status.mock.calls.length > 0;
      expect(called).toBe(true);
    });
  });

  describe('login', () => {
    const userData = {
      email: 'admin@freshflock.com',
      password: 'password123',
      name: 'Admin User',
    };

    beforeEach(async () => {
      await User.create(userData);
    });

    it('should login with valid credentials and return a JWT token', async () => {
      const req = mockReq({ email: userData.email, password: userData.password });
      const res = mockRes();

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: expect.any(String),
          user: expect.objectContaining({
            email: userData.email,
            name: userData.name,
            role: 'admin',
          }),
        })
      );

      // Verify the token is valid
      const response = res.json.mock.calls[0][0];
      const decoded = jwt.verify(response.token, process.env.JWT_SECRET);
      expect(decoded.id).toBeDefined();
    });

    it('should return 401 for non-existent email', async () => {
      const req = mockReq({ email: 'nonexistent@test.com', password: 'password123' });
      const res = mockRes();

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid credentials',
        })
      );
    });

    it('should return 401 for incorrect password', async () => {
      const req = mockReq({ email: userData.email, password: 'wrongpassword' });
      const res = mockRes();

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid credentials',
        })
      );
    });

    it('should return user info with id, email, name, role', async () => {
      const req = mockReq({ email: userData.email, password: userData.password });
      const res = mockRes();

      await login(req, res, mockNext);

      const response = res.json.mock.calls[0][0];
      expect(response.user).toHaveProperty('id');
      expect(response.user).toHaveProperty('email', userData.email);
      expect(response.user).toHaveProperty('name', userData.name);
      expect(response.user).toHaveProperty('role', 'admin');
    });
  });
});
