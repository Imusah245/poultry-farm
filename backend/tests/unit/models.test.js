const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const BlogPost = require('../../src/models/BlogPost');
const Contact = require('../../src/models/Contact');
const CompanyInfo = require('../../src/models/CompanyInfo');
const Testimonial = require('../../src/models/Testimonial');
const Order = require('../../src/models/Order');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('BlogPost Model', () => {
  it('should create a blog post with valid fields', async () => {
    const post = await BlogPost.create({
      title: 'Test Post',
      content: 'Some content here',
      excerpt: 'Short excerpt',
      category: 'farming',
      readTime: '5 min',
    });

    expect(post.title).toBe('Test Post');
    expect(post.content).toBe('Some content here');
    expect(post.excerpt).toBe('Short excerpt');
    expect(post.category).toBe('farming');
    expect(post.readTime).toBe('5 min');
    expect(post.published).toBe(true);
    expect(post.createdAt).toBeInstanceOf(Date);
    expect(post.updatedAt).toBeInstanceOf(Date);
  });

  it('should default published to true', async () => {
    const post = await BlogPost.create({
      title: 'Test',
      content: 'Content',
      excerpt: 'Excerpt',
      category: 'news',
    });
    expect(post.published).toBe(true);
  });

  it('should fail without required fields', async () => {
    await expect(BlogPost.create({})).rejects.toThrow();
    await expect(BlogPost.create({ title: 'Only title' })).rejects.toThrow();
  });
});

describe('Contact Model', () => {
  it('should create a contact submission with valid fields', async () => {
    const contact = await Contact.create({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry',
      message: 'I would like to know more',
    });

    expect(contact.name).toBe('John Doe');
    expect(contact.email).toBe('john@example.com');
    expect(contact.subject).toBe('Inquiry');
    expect(contact.message).toBe('I would like to know more');
    expect(contact.read).toBe(false);
    expect(contact.createdAt).toBeInstanceOf(Date);
  });

  it('should default read to false', async () => {
    const contact = await Contact.create({
      name: 'Jane',
      email: 'jane@test.com',
      subject: 'Hello',
      message: 'Message body',
    });
    expect(contact.read).toBe(false);
  });

  it('should fail without required fields', async () => {
    await expect(Contact.create({})).rejects.toThrow();
    await expect(Contact.create({ name: 'Only name' })).rejects.toThrow();
  });
});

describe('CompanyInfo Model', () => {
  it('should create company info with valid fields', async () => {
    const info = await CompanyInfo.create({
      name: 'FreshFlock Farms',
      tagline: 'Premium poultry products',
      phone: '+233 123 456',
      email: 'info@freshflock.com',
      address: 'Accra, Ghana',
      founded: 2015,
    });

    expect(info.name).toBe('FreshFlock Farms');
    expect(info.tagline).toBe('Premium poultry products');
    expect(info.phone).toBe('+233 123 456');
    expect(info.email).toBe('info@freshflock.com');
    expect(info.address).toBe('Accra, Ghana');
    expect(info.founded).toBe(2015);
    expect(info.updatedAt).toBeInstanceOf(Date);
  });

  it('should implement singleton getOrCreate pattern', async () => {
    const defaults = { name: 'FreshFlock Farms', tagline: 'Farm fresh' };

    // First call creates
    const first = await CompanyInfo.getOrCreate(defaults);
    expect(first.name).toBe('FreshFlock Farms');

    // Second call returns the same document
    const second = await CompanyInfo.getOrCreate({ name: 'Other Name' });
    expect(second._id.toString()).toBe(first._id.toString());
    expect(second.name).toBe('FreshFlock Farms'); // Original name preserved
  });

  it('should fail without required name field', async () => {
    await expect(CompanyInfo.create({})).rejects.toThrow();
  });
});

describe('Testimonial Model', () => {
  it('should create a testimonial with valid fields', async () => {
    const testimonial = await Testimonial.create({
      quote: 'Great farm products!',
      author: 'Alice Smith',
      role: 'Customer',
      initials: 'AS',
    });

    expect(testimonial.quote).toBe('Great farm products!');
    expect(testimonial.author).toBe('Alice Smith');
    expect(testimonial.role).toBe('Customer');
    expect(testimonial.initials).toBe('AS');
    expect(testimonial.approved).toBe(true);
    expect(testimonial.createdAt).toBeInstanceOf(Date);
    expect(testimonial.updatedAt).toBeInstanceOf(Date);
  });

  it('should default approved to true', async () => {
    const testimonial = await Testimonial.create({
      quote: 'Nice!',
      author: 'Bob',
    });
    expect(testimonial.approved).toBe(true);
  });

  it('should fail without required fields', async () => {
    await expect(Testimonial.create({})).rejects.toThrow();
    await expect(Testimonial.create({ quote: 'Only quote' })).rejects.toThrow();
  });
});

describe('Order Model', () => {
  it('should create an order with valid fields', async () => {
    const order = await Order.create({
      customerName: 'John Doe',
      customerPhone: '+233 555 1234',
      customerEmail: 'john@example.com',
      productType: 'eggs',
      quantity: 100,
    });

    expect(order.customerName).toBe('John Doe');
    expect(order.customerPhone).toBe('+233 555 1234');
    expect(order.customerEmail).toBe('john@example.com');
    expect(order.productType).toBe('eggs');
    expect(order.quantity).toBe(100);
    expect(order.status).toBe('pending');
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
  });

  it('should initialize statusHistory with pending entry on creation', async () => {
    const order = await Order.create({
      customerName: 'Jane Doe',
      productType: 'broilers',
      quantity: 50,
    });

    expect(order.statusHistory).toHaveLength(1);
    expect(order.statusHistory[0].status).toBe('pending');
    expect(order.statusHistory[0].timestamp).toBeInstanceOf(Date);
  });

  it('should only accept valid productType values', async () => {
    await expect(
      Order.create({
        customerName: 'Test',
        productType: 'invalid',
        quantity: 10,
      })
    ).rejects.toThrow();
  });

  it('should only accept valid status values', async () => {
    const order = new Order({
      customerName: 'Test',
      productType: 'eggs',
      quantity: 10,
      status: 'invalid_status',
    });
    const error = order.validateSync();
    expect(error).toBeDefined();
  });

  it('should enforce minimum quantity of 1', async () => {
    await expect(
      Order.create({
        customerName: 'Test',
        productType: 'eggs',
        quantity: 0,
      })
    ).rejects.toThrow();
  });

  it('should fail without required fields', async () => {
    await expect(Order.create({})).rejects.toThrow();
    await expect(
      Order.create({ customerName: 'Only name' })
    ).rejects.toThrow();
  });
});
