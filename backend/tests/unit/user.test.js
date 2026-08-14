const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('User Model', () => {
  const validUserData = {
    email: 'admin@freshflock.com',
    password: 'password123',
    name: 'Admin User',
  };

  describe('Schema validation', () => {
    it('should create a user with valid data', async () => {
      const user = await User.create(validUserData);
      expect(user.email).toBe(validUserData.email);
      expect(user.name).toBe(validUserData.name);
      expect(user.role).toBe('admin');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should require email', async () => {
      const user = new User({ password: 'password123', name: 'Test' });
      const err = user.validateSync();
      expect(err.errors.email).toBeDefined();
    });

    it('should require password', async () => {
      const user = new User({ email: 'test@test.com', name: 'Test' });
      const err = user.validateSync();
      expect(err.errors.password).toBeDefined();
    });

    it('should require name', async () => {
      const user = new User({ email: 'test@test.com', password: 'password123' });
      const err = user.validateSync();
      expect(err.errors.name).toBeDefined();
    });

    it('should enforce unique email', async () => {
      await User.create(validUserData);
      await expect(User.create(validUserData)).rejects.toThrow();
    });

    it('should enforce minimum password length of 8', async () => {
      const user = new User({ email: 'test@test.com', password: 'short', name: 'Test' });
      const err = user.validateSync();
      expect(err.errors.password).toBeDefined();
    });

    it('should default role to admin', async () => {
      const user = await User.create(validUserData);
      expect(user.role).toBe('admin');
    });

    it('should only allow admin role', async () => {
      const user = new User({ ...validUserData, role: 'user' });
      const err = user.validateSync();
      expect(err.errors.role).toBeDefined();
    });
  });

  describe('Password hashing (pre-save hook)', () => {
    it('should hash the password before saving', async () => {
      const user = await User.create(validUserData);
      expect(user.password).not.toBe(validUserData.password);
      expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });

    it('should not re-hash password if not modified', async () => {
      const user = await User.create(validUserData);
      const hashedPassword = user.password;

      user.name = 'Updated Name';
      await user.save();

      expect(user.password).toBe(hashedPassword);
    });

    it('should re-hash password if modified', async () => {
      const user = await User.create(validUserData);
      const originalHash = user.password;

      user.password = 'newpassword456';
      await user.save();

      expect(user.password).not.toBe(originalHash);
      expect(user.password).not.toBe('newpassword456');
      expect(user.password).toMatch(/^\$2[aby]\$/);
    });
  });

  describe('matchPassword method', () => {
    it('should return true for correct password', async () => {
      const user = await User.create(validUserData);
      const isMatch = await user.matchPassword('password123');
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = await User.create(validUserData);
      const isMatch = await user.matchPassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });
});
