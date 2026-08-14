/**
 * Integration tests for dashboard and production endpoints
 * Validates: Requirements 3.1, 3.3, 3.4
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../../src/server');
const ProductionRecord = require('../../src/models/ProductionRecord');
const Order = require('../../src/models/Order');

let mongoServer;
const JWT_SECRET = 'test-secret-key';

function generateAuthToken() {
  return jwt.sign(
    { id: 'testuser123', email: 'test@example.com', role: 'admin' },
    JWT_SECRET
  );
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.JWT_SECRET = JWT_SECRET;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await ProductionRecord.deleteMany({});
  await Order.deleteMany({});
});

describe('Dashboard and Production Integration Tests', () => {
  describe('POST /api/dashboard/production', () => {
    it('should create a production record with valid data and return 201', async () => {
      const token = generateAuthToken();
      const payload = {
        date: '2024-06-15T00:00:00.000Z',
        eggsProduced: 1200,
        birdsAvailable: 5000,
        feedStockTonnes: 3.5,
      };

      const res = await request(app)
        .post('/api/dashboard/production')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        eggsProduced: 1200,
        birdsAvailable: 5000,
        feedStockTonnes: 3.5,
      });
      expect(res.body.data._id).toBeDefined();

      // Verify record is persisted
      const records = await ProductionRecord.find({});
      expect(records).toHaveLength(1);
      expect(records[0].eggsProduced).toBe(1200);
    });

    it('should reject invalid production data with 400', async () => {
      const token = generateAuthToken();
      const payload = {
        date: 'not-a-date',
        eggsProduced: -5,
        birdsAvailable: 'abc',
        feedStockTonnes: -1,
      };

      const res = await request(app)
        .post('/api/dashboard/production')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return KPI stats with trends when production records exist', async () => {
      const token = generateAuthToken();

      // Create two production records for trend calculation
      await ProductionRecord.create([
        {
          date: new Date('2024-06-14'),
          eggsProduced: 1000,
          birdsAvailable: 4800,
          feedStockTonnes: 3.0,
        },
        {
          date: new Date('2024-06-15'),
          eggsProduced: 1200,
          birdsAvailable: 5000,
          feedStockTonnes: 3.5,
        },
      ]);

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('eggsProduced');
      expect(res.body.data).toHaveProperty('birdsAvailable');
      expect(res.body.data).toHaveProperty('feedStockTonnes');
      expect(res.body.data).toHaveProperty('pendingOrders');
      expect(res.body.data).toHaveProperty('trends');
      expect(res.body.data.trends).toHaveProperty('eggs');
      expect(res.body.data.trends).toHaveProperty('birds');
      expect(res.body.data.trends).toHaveProperty('feed');

      // Most recent record values
      expect(res.body.data.eggsProduced).toBe(1200);
      expect(res.body.data.birdsAvailable).toBe(5000);
      expect(res.body.data.feedStockTonnes).toBe(3.5);
    });

    it('should return zeroes when no production records exist', async () => {
      const token = generateAuthToken();

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.eggsProduced).toBe(0);
      expect(res.body.data.birdsAvailable).toBe(0);
      expect(res.body.data.feedStockTonnes).toBe(0);
      expect(res.body.data.pendingOrders).toBe(0);
    });
  });

  describe('GET /api/dashboard/production', () => {
    it('should return all production records', async () => {
      const token = generateAuthToken();

      await ProductionRecord.create([
        { date: new Date('2024-06-13'), eggsProduced: 900, birdsAvailable: 4700, feedStockTonnes: 2.8 },
        { date: new Date('2024-06-14'), eggsProduced: 1000, birdsAvailable: 4800, feedStockTonnes: 3.0 },
        { date: new Date('2024-06-15'), eggsProduced: 1200, birdsAvailable: 5000, feedStockTonnes: 3.5 },
      ]);

      const res = await request(app)
        .get('/api/dashboard/production')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
    });

    it('should filter production records by date range', async () => {
      const token = generateAuthToken();

      await ProductionRecord.create([
        { date: new Date('2024-06-10'), eggsProduced: 800, birdsAvailable: 4600, feedStockTonnes: 2.5 },
        { date: new Date('2024-06-12'), eggsProduced: 900, birdsAvailable: 4700, feedStockTonnes: 2.8 },
        { date: new Date('2024-06-14'), eggsProduced: 1000, birdsAvailable: 4800, feedStockTonnes: 3.0 },
        { date: new Date('2024-06-16'), eggsProduced: 1200, birdsAvailable: 5000, feedStockTonnes: 3.5 },
      ]);

      const res = await request(app)
        .get('/api/dashboard/production')
        .query({ startDate: '2024-06-12', endDate: '2024-06-14' })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);

      // Verify all returned records are within the date range
      for (const record of res.body.data) {
        const recordDate = new Date(record.date);
        expect(recordDate.getTime()).toBeGreaterThanOrEqual(new Date('2024-06-12').getTime());
        expect(recordDate.getTime()).toBeLessThanOrEqual(new Date('2024-06-14').getTime());
      }
    });

    it('should return empty array when no records match date range', async () => {
      const token = generateAuthToken();

      await ProductionRecord.create({
        date: new Date('2024-06-15'),
        eggsProduced: 1200,
        birdsAvailable: 5000,
        feedStockTonnes: 3.5,
      });

      const res = await request(app)
        .get('/api/dashboard/production')
        .query({ startDate: '2024-01-01', endDate: '2024-01-31' })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('Unauthenticated access', () => {
    it('should reject GET /api/dashboard/stats without token', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(401);
    });

    it('should reject POST /api/dashboard/production without token', async () => {
      const res = await request(app)
        .post('/api/dashboard/production')
        .send({
          date: '2024-06-15T00:00:00.000Z',
          eggsProduced: 1200,
          birdsAvailable: 5000,
          feedStockTonnes: 3.5,
        });
      expect(res.status).toBe(401);
    });

    it('should reject GET /api/dashboard/production without token', async () => {
      const res = await request(app).get('/api/dashboard/production');
      expect(res.status).toBe(401);
    });

    it('should reject requests with an invalid token', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', 'Bearer invalid-token-here');
      expect(res.status).toBe(401);
    });
  });

  describe('Stats include pending orders count', () => {
    it('should reflect the correct number of pending orders in stats', async () => {
      const token = generateAuthToken();

      // Create production record so stats have something to return
      await ProductionRecord.create({
        date: new Date('2024-06-15'),
        eggsProduced: 1200,
        birdsAvailable: 5000,
        feedStockTonnes: 3.5,
      });

      // Create orders with various statuses
      await Order.create([
        { customerName: 'Customer A', productType: 'eggs', quantity: 10, status: 'pending' },
        { customerName: 'Customer B', productType: 'broilers', quantity: 5, status: 'pending' },
        { customerName: 'Customer C', productType: 'eggs', quantity: 20, status: 'confirmed' },
        { customerName: 'Customer D', productType: 'broilers', quantity: 8, status: 'completed' },
        { customerName: 'Customer E', productType: 'eggs', quantity: 15, status: 'pending' },
      ]);

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.pendingOrders).toBe(3);
    });

    it('should return 0 pending orders when none exist', async () => {
      const token = generateAuthToken();

      await Order.create([
        { customerName: 'Customer A', productType: 'eggs', quantity: 10, status: 'completed' },
        { customerName: 'Customer B', productType: 'broilers', quantity: 5, status: 'cancelled' },
      ]);

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.pendingOrders).toBe(0);
    });
  });
});
