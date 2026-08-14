/**
 * Property 9: Category/status filter correctness
 * Property 10: Required field validation
 * Feature: poultry-farm-backend
 *
 * Validates: Requirements 5.3, 7.5, 10.3, 7.2, 8.1, 8.3
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const fc = require('fast-check');

const app = require('../../src/server');
const BlogPost = require('../../src/models/BlogPost');
const Order = require('../../src/models/Order');
const BroilerGrowth = require('../../src/models/BroilerGrowth');
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
  await BlogPost.deleteMany({});
  await Order.deleteMany({});
  await BroilerGrowth.deleteMany({});
  await Contact.deleteMany({});
});

describe('Feature: poultry-farm-backend, Property 9: Category/status filter correctness', () => {
  /**
   * Validates: Requirements 7.5
   * Blog posts filtered by category only return posts matching that category.
   */
  it('blog posts filtered by category only return matching posts', async () => {
    const categories = ['farming', 'technology', 'health', 'business', 'nutrition'];

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          targetCategory: fc.constantFrom(...categories),
          posts: fc.array(
            fc.record({
              title: fc.string({ minLength: 1, maxLength: 50 }).map(s => s || 'Title'),
              content: fc.string({ minLength: 1, maxLength: 100 }).map(s => s || 'Content'),
              excerpt: fc.string({ minLength: 1, maxLength: 50 }).map(s => s || 'Excerpt'),
              category: fc.constantFrom(...categories),
            }),
            { minLength: 2, maxLength: 10 }
          ),
        }),
        async ({ targetCategory, posts }) => {
          await BlogPost.deleteMany({});

          // Insert posts with various categories, all published
          const docs = posts.map((p, i) => ({
            title: `${p.title} ${i}`,
            content: p.content,
            excerpt: p.excerpt,
            category: p.category,
            published: true,
          }));
          await BlogPost.insertMany(docs);

          const res = await request(app).get(`/api/blog?category=${targetCategory}`);

          expect(res.status).toBe(200);

          // All returned posts must match the target category
          for (const post of res.body) {
            expect(post.category).toBe(targetCategory);
          }

          // Count how many we inserted with that category
          const expectedCount = posts.filter(p => p.category === targetCategory).length;
          expect(res.body.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 10.3
   * Orders filtered by status only return orders matching that status.
   */
  it('orders filtered by status only return matching orders', async () => {
    const token = generateAuthToken();
    const statuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          targetStatus: fc.constantFrom(...statuses),
          orders: fc.array(
            fc.record({
              customerName: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Customer'),
              productType: fc.constantFrom('eggs', 'broilers'),
              quantity: fc.integer({ min: 1, max: 1000 }),
              status: fc.constantFrom(...statuses),
            }),
            { minLength: 2, maxLength: 10 }
          ),
        }),
        async ({ targetStatus, orders }) => {
          await Order.deleteMany({});

          // Insert orders with various statuses
          const docs = orders.map((o, i) => ({
            customerName: `${o.customerName} ${i}`,
            productType: o.productType,
            quantity: o.quantity,
            status: o.status,
            statusHistory: [{ status: o.status, timestamp: new Date() }],
          }));
          await Order.insertMany(docs);

          const res = await request(app)
            .get(`/api/orders?status=${targetStatus}`)
            .set('Authorization', `Bearer ${token}`);

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);

          // All returned orders must match the target status
          for (const order of res.body.data) {
            expect(order.status).toBe(targetStatus);
          }

          // Count how many we inserted with that status
          const expectedCount = orders.filter(o => o.status === targetStatus).length;
          expect(res.body.data.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 5.3
   * Broiler growth data filtered by batchId only returns records for that batch.
   */
  it('broiler growth filtered by batchId only returns matching records', async () => {
    const token = generateAuthToken();

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          targetBatch: fc.stringMatching(/^batch-[a-z]{3,8}$/),
          records: fc.array(
            fc.record({
              batchId: fc.constantFrom('batch-alpha', 'batch-beta', 'batch-gamma'),
              week: fc.integer({ min: 1, max: 12 }),
              weight: fc.integer({ min: 1, max: 100 }).map(w => w / 10),
            }),
            { minLength: 2, maxLength: 10 }
          ),
        }),
        async ({ targetBatch, records }) => {
          await BroilerGrowth.deleteMany({});

          // Deduplicate by batchId+week to avoid duplicate key errors
          const seen = new Set();
          const uniqueRecords = [];
          for (const r of records) {
            const key = `${r.batchId}-${r.week}`;
            if (!seen.has(key)) {
              seen.add(key);
              uniqueRecords.push(r);
            }
          }

          if (uniqueRecords.length < 1) return;

          await BroilerGrowth.insertMany(uniqueRecords);

          const res = await request(app)
            .get(`/api/broilers?batchId=${targetBatch}`)
            .set('Authorization', `Bearer ${token}`);

          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);

          // All returned records must match the target batchId
          for (const record of res.body.data) {
            expect(record.batchId).toBe(targetBatch);
          }

          // Count how many we inserted with that batchId
          const expectedCount = uniqueRecords.filter(r => r.batchId === targetBatch).length;
          expect(res.body.data.length).toBe(expectedCount);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: poultry-farm-backend, Property 10: Required field validation', () => {
  /**
   * Validates: Requirements 7.2
   * Blog post creation with missing required fields returns 400 with field errors.
   */
  it('blog post creation rejects when required fields are missing', async () => {
    const token = generateAuthToken();
    const requiredFields = ['title', 'content', 'excerpt', 'category'];

    await fc.assert(
      fc.asyncProperty(
        // Generate a subset of fields to omit (at least one must be omitted)
        fc.subarray(requiredFields, { minLength: 1, maxLength: 4 }),
        async (fieldsToOmit) => {
          // Build a body with all required fields present
          const fullBody = {
            title: 'Test Blog Post',
            content: 'This is test content for the blog post',
            excerpt: 'Test excerpt',
            category: 'farming',
          };

          // Remove the fields we want to test as missing
          const body = { ...fullBody };
          for (const field of fieldsToOmit) {
            delete body[field];
          }

          const res = await request(app)
            .post('/api/blog')
            .set('Authorization', `Bearer ${token}`)
            .send(body);

          expect(res.status).toBe(400);
          expect(res.body.errors).toBeDefined();
          expect(Array.isArray(res.body.errors)).toBe(true);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);

          // Each omitted field should appear in the errors
          const errorFields = res.body.errors.map(e => e.field);
          for (const field of fieldsToOmit) {
            expect(errorFields).toContain(field);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 8.1, 8.3
   * Contact form submission with missing required fields returns 400 with field errors.
   */
  it('contact form rejects when required fields are missing', async () => {
    const requiredFields = ['name', 'email', 'subject', 'message'];

    await fc.assert(
      fc.asyncProperty(
        // Generate a subset of fields to omit (at least one must be omitted)
        fc.subarray(requiredFields, { minLength: 1, maxLength: 4 }),
        async (fieldsToOmit) => {
          // Build a body with all required fields present
          const fullBody = {
            name: 'John Doe',
            email: 'john@example.com',
            subject: 'Test Subject',
            message: 'This is a test message',
          };

          // Remove the fields we want to test as missing
          const body = { ...fullBody };
          for (const field of fieldsToOmit) {
            delete body[field];
          }

          const res = await request(app)
            .post('/api/contact')
            .send(body);

          expect(res.status).toBe(400);
          expect(res.body.errors).toBeDefined();
          expect(Array.isArray(res.body.errors)).toBe(true);
          expect(res.body.errors.length).toBeGreaterThanOrEqual(1);

          // Each omitted field should appear in the errors
          const errorFields = res.body.errors.map(e => e.field);
          for (const field of fieldsToOmit) {
            expect(errorFields).toContain(field);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
