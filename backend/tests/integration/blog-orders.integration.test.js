/**
 * Integration Tests: Blog Posts and Orders
 *
 * Validates: Requirements 7.1, 7.4, 10.1, 10.2, 10.3
 *
 * Tests full CRUD lifecycle for blog posts and order creation,
 * status updates, and filtering.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../../src/server');
const BlogPost = require('../../src/models/BlogPost');
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
  await BlogPost.deleteMany({});
  await Order.deleteMany({});
});

describe('Blog Posts Integration', () => {
  const token = generateAuthToken();

  const validPost = {
    title: 'Farm Updates',
    content: 'Our farm has expanded production this quarter.',
    excerpt: 'Farm expansion news',
    category: 'Health',
  };

  describe('GET /api/blog - Get all published blog posts (public)', () => {
    it('returns 200 with array of published posts', async () => {
      await BlogPost.create([
        { ...validPost, published: true },
        { ...validPost, title: 'Second Post', published: true },
        { ...validPost, title: 'Draft Post', published: false },
      ]);

      const res = await request(app).get('/api/blog');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      // Should not include unpublished posts
      const titles = res.body.map(p => p.title);
      expect(titles).not.toContain('Draft Post');
    });
  });

  describe('POST /api/blog - Create blog post (auth)', () => {
    it('returns 201 when creating with valid data', async () => {
      const res = await request(app)
        .post('/api/blog')
        .set('Authorization', `Bearer ${token}`)
        .send(validPost);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(validPost.title);
      expect(res.body.content).toBe(validPost.content);
      expect(res.body.excerpt).toBe(validPost.excerpt);
      expect(res.body.category).toBe(validPost.category);
      expect(res.body._id).toBeDefined();
    });
  });

  describe('PUT /api/blog/:id - Update blog post (auth)', () => {
    it('returns 200 with updated fields', async () => {
      const post = await BlogPost.create(validPost);

      const updates = {
        title: 'Updated Title',
        content: 'Updated content about our farm.',
        excerpt: 'Updated excerpt',
        category: 'Nutrition',
      };

      const res = await request(app)
        .put(`/api/blog/${post._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.category).toBe('Nutrition');
    });
  });

  describe('DELETE /api/blog/:id - Delete blog post (auth)', () => {
    it('returns 200 with deletion message', async () => {
      const post = await BlogPost.create(validPost);

      const res = await request(app)
        .delete(`/api/blog/${post._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Post deleted');

      // Confirm deletion
      const found = await BlogPost.findById(post._id);
      expect(found).toBeNull();
    });
  });

  describe('GET /api/blog?category= - Filter by category', () => {
    it('returns only posts matching the category', async () => {
      await BlogPost.create([
        { ...validPost, category: 'Health', published: true },
        { ...validPost, title: 'Nutrition Post', category: 'Nutrition', published: true },
        { ...validPost, title: 'Another Health', category: 'Health', published: true },
      ]);

      const res = await request(app).get('/api/blog?category=Health');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      res.body.forEach(post => {
        expect(post.category).toBe('Health');
      });
    });
  });

  describe('POST /api/blog - Create with missing fields', () => {
    it('returns 400 validation error when title is missing', async () => {
      const invalidPost = {
        content: 'Some content',
        excerpt: 'An excerpt',
        category: 'Health',
      };

      const res = await request(app)
        .post('/api/blog')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidPost);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.some(e => e.field === 'title')).toBe(true);
    });
  });

  describe('Blog CRUD lifecycle', () => {
    it('creates, reads, updates, then deletes a blog post', async () => {
      // Create
      const createRes = await request(app)
        .post('/api/blog')
        .set('Authorization', `Bearer ${token}`)
        .send(validPost);

      expect(createRes.status).toBe(201);
      const postId = createRes.body._id;

      // Read
      const readRes = await request(app).get('/api/blog');
      expect(readRes.status).toBe(200);
      expect(readRes.body.some(p => p._id === postId)).toBe(true);

      // Update
      const updateRes = await request(app)
        .put(`/api/blog/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Lifecycle Updated',
          content: 'Updated lifecycle content.',
          excerpt: 'Updated excerpt',
          category: 'Farming',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Lifecycle Updated');

      // Delete
      const deleteRes = await request(app)
        .delete(`/api/blog/${postId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe('Post deleted');

      // Verify deletion
      const verifyRes = await request(app).get('/api/blog');
      expect(verifyRes.body.some(p => p._id === postId)).toBe(false);
    });
  });
});

describe('Orders Integration', () => {
  const token = generateAuthToken();

  const validOrder = {
    customerName: 'John Farmer',
    productType: 'eggs',
    quantity: 50,
  };

  describe('POST /api/orders - Create order', () => {
    it('returns 201 with status pending and statusHistory initialized', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(validOrder);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.customerName).toBe('John Farmer');
      expect(res.body.data.productType).toBe('eggs');
      expect(res.body.data.quantity).toBe(50);
      expect(res.body.data.status).toBe('pending');
      expect(res.body.data.statusHistory).toBeDefined();
      expect(res.body.data.statusHistory.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.statusHistory[0].status).toBe('pending');
    });
  });

  describe('GET /api/orders - Get all orders', () => {
    it('returns 200 with all orders', async () => {
      await Order.create([
        { ...validOrder },
        { ...validOrder, customerName: 'Jane Farmer', productType: 'broilers', quantity: 100 },
      ]);

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe('GET /api/orders?status= - Filter by status', () => {
    it('returns only orders matching the status', async () => {
      const order1 = await Order.create({ ...validOrder });
      const order2 = await Order.create({ ...validOrder, customerName: 'Jane' });

      // Update one order to confirmed
      order2.status = 'confirmed';
      order2.statusHistory.push({ status: 'confirmed', timestamp: new Date() });
      await order2.save();

      const res = await request(app)
        .get('/api/orders?status=pending')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe('pending');
    });
  });

  describe('PATCH /api/orders/:id/status - Update order status', () => {
    it('returns 200 with updated status and statusHistory', async () => {
      const order = await Order.create(validOrder);

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'confirmed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('confirmed');
      expect(res.body.data.statusHistory.length).toBe(2);
      expect(res.body.data.statusHistory[1].status).toBe('confirmed');
    });
  });

  describe('PATCH /api/orders/:id/status - Invalid status update', () => {
    it('returns 400 for invalid status value', async () => {
      const order = await Order.create(validOrder);

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid_status' });

      expect(res.status).toBe(400);
    });
  });

  describe('Order lifecycle', () => {
    it('transitions through pending → confirmed → processing → completed', async () => {
      // Create order (pending)
      const createRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(validOrder);

      expect(createRes.status).toBe(201);
      const orderId = createRes.body.data._id;
      expect(createRes.body.data.status).toBe('pending');

      // Confirm
      const confirmRes = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'confirmed' });

      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.data.status).toBe('confirmed');

      // Process
      const processRes = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'processing' });

      expect(processRes.status).toBe(200);
      expect(processRes.body.data.status).toBe('processing');

      // Complete
      const completeRes = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'completed' });

      expect(completeRes.status).toBe(200);
      expect(completeRes.body.data.status).toBe('completed');
      // Should have 4 history entries: pending, confirmed, processing, completed
      expect(completeRes.body.data.statusHistory.length).toBe(4);
    });
  });
});
