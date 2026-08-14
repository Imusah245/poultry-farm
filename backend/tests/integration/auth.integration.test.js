/**
 * Integration tests for authentication flow
 * Tests: register → login → access protected route → reject with invalid token
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../src/server');
const User = require('../../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.JWT_SECRET = 'test-secret-key';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Integration: Registration', () => {
  it('registers a new user and returns JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.name).toBe('Test User');
  });

  it('rejects registration with duplicate email', async () => {
    // Register first user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'First User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    // Try to register with same email
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'password456',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already registered/i);
  });
});

describe('Auth Integration: Login', () => {
  beforeEach(async () => {
    // Register a user for login tests
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });
  });

  it('logs in with valid credentials and returns JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.email).toBe('login@example.com');
  });

  it('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it('rejects login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});

describe('Auth Integration: Protected Routes', () => {
  let validToken;

  beforeEach(async () => {
    // Register and get a valid token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Auth User',
        email: 'auth@example.com',
        password: 'password123',
      });
    validToken = res.body.token;
  });

  it('allows access to protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/eggs')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
  });

  it('rejects access without Authorization header', async () => {
    const res = await request(app).get('/api/eggs');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  it('rejects access with invalid/malformed token', async () => {
    const res = await request(app)
      .get('/api/eggs')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token invalid or expired/i);
  });
});

describe('Auth Integration: Full End-to-End Flow', () => {
  it('register → login → access protected → reject invalid token', async () => {
    // Step 1: Register a new user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'E2E User',
        email: 'e2e@example.com',
        password: 'securepass1',
      });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.token).toBeDefined();

    // Step 2: Login with the registered credentials
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'e2e@example.com',
        password: 'securepass1',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    const token = loginRes.body.token;

    // Step 3: Access a protected route with the login token
    const protectedRes = await request(app)
      .get('/api/eggs')
      .set('Authorization', `Bearer ${token}`);

    expect(protectedRes.status).toBe(200);

    // Step 4: Reject access with an invalid token
    const rejectedRes = await request(app)
      .get('/api/eggs')
      .set('Authorization', 'Bearer totally.invalid.token');

    expect(rejectedRes.status).toBe(401);
    expect(rejectedRes.body.message).toMatch(/token invalid or expired/i);
  });
});
