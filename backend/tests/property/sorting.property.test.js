/**
 * Property 8: Sort order invariant
 * Feature: poultry-farm-backend, Property 8: Sort order invariant
 *
 * Validates: Requirements 4.4, 7.6, 8.4
 *
 * For any collection of records returned by the egg production endpoint,
 * consecutive dates should be in non-decreasing order. For blog posts and
 * contact submissions, consecutive dates should be in non-increasing order.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const fc = require('fast-check');

const app = require('../../src/server');
const EggProduction = require('../../src/models/EggProduction');
const BlogPost = require('../../src/models/BlogPost');
const Contact = require('../../src/models/Contact');

let mongoServer;
const JWT_SECRET = 'test-secret-key';

// Generate a valid auth token for protected endpoints
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
  await EggProduction.deleteMany({});
  await BlogPost.deleteMany({});
  await Contact.deleteMany({});
});

describe('Feature: poultry-farm-backend, Property 8: Sort order invariant', () => {
  /**
   * Validates: Requirements 4.4
   * Egg production records are returned sorted by date ascending (non-decreasing).
   */
  it('egg production records are sorted by date in ascending order', async () => {
    const token = generateAuthToken();

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.date({
            min: new Date('2020-01-01'),
            max: new Date('2025-12-31'),
          }),
          { minLength: 2, maxLength: 15 }
        ),
        async (dates) => {
          await EggProduction.deleteMany({});

          // Ensure unique dates by normalizing to day-level and deduplicating
          const uniqueDays = new Map();
          for (const d of dates) {
            const dayKey = d.toISOString().slice(0, 10);
            if (!uniqueDays.has(dayKey)) {
              uniqueDays.set(dayKey, new Date(dayKey + 'T00:00:00.000Z'));
            }
          }

          const uniqueDates = [...uniqueDays.values()];
          if (uniqueDates.length < 2) return; // Need at least 2 records to verify order

          // Insert records with random dates and a valid count
          const records = uniqueDates.map((date, i) => ({
            date,
            count: i + 1,
          }));
          await EggProduction.insertMany(records);

          const res = await request(app)
            .get('/api/eggs')
            .set('Authorization', `Bearer ${token}`);

          expect(res.status).toBe(200);
          const data = res.body;
          expect(data.length).toBe(uniqueDates.length);

          // Verify ascending order: each consecutive date >= previous
          for (let i = 1; i < data.length; i++) {
            const prev = new Date(data[i - 1].date).getTime();
            const curr = new Date(data[i].date).getTime();
            expect(curr).toBeGreaterThanOrEqual(prev);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 7.6
   * Blog posts are returned sorted by createdAt in descending order (non-increasing).
   */
  it('blog posts are sorted by createdAt in descending order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.date({
            min: new Date('2020-01-01'),
            max: new Date('2025-12-31'),
          }),
          { minLength: 2, maxLength: 15 }
        ),
        async (dates) => {
          await BlogPost.deleteMany({});

          if (dates.length < 2) return;

          // Insert blog posts with different createdAt timestamps, all published
          const posts = dates.map((date, i) => ({
            title: `Post ${i}`,
            content: `Content for post ${i}`,
            excerpt: `Excerpt ${i}`,
            category: 'farming',
            published: true,
            createdAt: date,
          }));
          await BlogPost.insertMany(posts);

          const res = await request(app).get('/api/blog');

          expect(res.status).toBe(200);
          const data = res.body;
          expect(data.length).toBe(dates.length);

          // Verify descending order: each consecutive createdAt <= previous
          for (let i = 1; i < data.length; i++) {
            const prev = new Date(data[i - 1].createdAt).getTime();
            const curr = new Date(data[i].createdAt).getTime();
            expect(curr).toBeLessThanOrEqual(prev);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 8.4
   * Contact submissions are returned sorted by createdAt in descending order (non-increasing).
   */
  it('contact submissions are sorted by createdAt in descending order', async () => {
    const token = generateAuthToken();

    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.date({
            min: new Date('2020-01-01'),
            max: new Date('2025-12-31'),
          }),
          { minLength: 2, maxLength: 15 }
        ),
        async (dates) => {
          await Contact.deleteMany({});

          if (dates.length < 2) return;

          // Insert contact submissions with different createdAt timestamps
          const contacts = dates.map((date, i) => ({
            name: `User ${i}`,
            email: `user${i}@example.com`,
            subject: `Subject ${i}`,
            message: `Message content ${i}`,
            createdAt: date,
          }));
          await Contact.insertMany(contacts);

          const res = await request(app)
            .get('/api/contact')
            .set('Authorization', `Bearer ${token}`);

          expect(res.status).toBe(200);
          const data = res.body.data;
          expect(data.length).toBe(dates.length);

          // Verify descending order: each consecutive createdAt <= previous
          for (let i = 1; i < data.length; i++) {
            const prev = new Date(data[i - 1].createdAt).getTime();
            const curr = new Date(data[i].createdAt).getTime();
            expect(curr).toBeLessThanOrEqual(prev);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
