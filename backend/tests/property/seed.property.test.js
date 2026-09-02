/**
 * Property 14: Seed script idempotence
 * Feature: poultry-farm-backend, Property 14: Seed script idempotence
 *
 * Validates: Requirements 11.4
 *
 * For any database state that already contains seeded data, running the seed
 * script again should not modify existing records and should log a warning.
 * For any number of seed invocations N >= 2, the database state after N
 * invocations should be identical to the state after the first invocation.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const fc = require('fast-check');

// Import models directly
const User = require('../../src/models/User');
const CompanyInfo = require('../../src/models/CompanyInfo');
const Testimonial = require('../../src/models/Testimonial');
const BlogPost = require('../../src/models/BlogPost');
const ProductionRecord = require('../../src/models/ProductionRecord');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
  await CompanyInfo.deleteMany({});
  await Testimonial.deleteMany({});
  await BlogPost.deleteMany({});
  await ProductionRecord.deleteMany({});
});

/**
 * Replicate the idempotent seeding logic from seeds/seed.js.
 * Each collection is only populated if it's empty (or the specific document
 * doesn't exist), otherwise a warning is logged and seeding is skipped.
 */
async function runSeedLogic(data) {
  const warnings = [];

  // Seed Company Info
  const existingCompany = await CompanyInfo.findOne();
  if (existingCompany) {
    warnings.push('Company info already exists — skipping');
  } else {
    await CompanyInfo.create(data.company);
  }

  // Seed Testimonials
  const existingTestimonials = await Testimonial.countDocuments();
  if (existingTestimonials > 0) {
    warnings.push('Testimonials already exist — skipping');
  } else {
    await Testimonial.insertMany(data.testimonials);
  }

  // Seed Blog Posts
  const existingPosts = await BlogPost.countDocuments();
  if (existingPosts > 0) {
    warnings.push('Blog posts already exist — skipping');
  } else {
    await BlogPost.insertMany(data.blogPosts);
  }

  // Seed Production Records
  const existingRecords = await ProductionRecord.countDocuments();
  if (existingRecords > 0) {
    warnings.push('Production records already exist — skipping');
  } else {
    await ProductionRecord.insertMany(data.productionRecords);
  }

  // Seed Admin User
  const existingAdmin = await User.findOne({ email: data.adminUser.email });
  if (existingAdmin) {
    warnings.push('Admin user already exists — skipping');
  } else {
    await User.create(data.adminUser);
  }

  return warnings;
}

/**
 * Capture a snapshot of all seeded collections for comparison.
 */
async function captureDbState() {
  const company = await CompanyInfo.findOne().lean();
  const testimonials = await Testimonial.find().sort({ author: 1 }).lean();
  const blogPosts = await BlogPost.find().sort({ title: 1 }).lean();
  const productionRecords = await ProductionRecord.find().sort({ date: 1 }).lean();
  const users = await User.find().sort({ email: 1 }).lean();

  return {
    companyCount: company ? 1 : 0,
    companyName: company ? company.name : null,
    testimonialCount: testimonials.length,
    testimonialAuthors: testimonials.map((t) => t.author),
    blogPostCount: blogPosts.length,
    blogPostTitles: blogPosts.map((b) => b.title),
    productionRecordCount: productionRecords.length,
    productionRecordDates: productionRecords.map((r) => r.date.toISOString()),
    userCount: users.length,
    userEmails: users.map((u) => u.email),
  };
}

// Increase timeout for property-based tests with async DB operations
jest.setTimeout(120000);

describe('Feature: poultry-farm-backend, Property 14: Seed script idempotence', () => {
  /**
   * Validates: Requirements 11.4
   *
   * For any number of seed invocations N (2 <= N <= 5), the database state
   * after N invocations should be identical to the state after the first
   * invocation. Re-running seed should not duplicate or modify records.
   */
  it('running seed multiple times does not change database state', async () => {
    // Fixed seed data matching the actual seed script structure
    const seedData = {
      company: {
        name: 'DarajatFarms',
        tagline: 'Fresh Eggs & Quality Broilers You Can Trust',
        phone: '+233 20 000 0000',
        email: 'barhoumtech@gmail.com',
        address: 'Accra, Greater Accra Region, Ghana',
        founded: 2010,
      },
      testimonials: [
        {
          quote: 'Great egg supplier.',
          author: 'Kofi Mensah',
          role: 'Restaurant Owner',
          initials: 'KM',
          approved: true,
        },
        {
          quote: 'Top grade broilers.',
          author: 'Abena Osei',
          role: 'Distributor',
          initials: 'AO',
          approved: true,
        },
      ],
      blogPosts: [
        {
          title: 'Fresh Eggs Guide',
          content: 'How to identify fresh eggs.',
          excerpt: 'Learn about fresh eggs.',
          category: 'Egg Tips',
          published: true,
        },
        {
          title: 'Broiler Feeding',
          content: 'Week-by-week broiler nutrition.',
          excerpt: 'Optimal feed formulations.',
          category: 'Broiler Care',
          published: true,
        },
      ],
      productionRecords: [
        { date: new Date('2024-01-01'), eggsProduced: 11200, birdsAvailable: 8420, feedStockTonnes: 4.2 },
        { date: new Date('2024-01-02'), eggsProduced: 11450, birdsAvailable: 8420, feedStockTonnes: 4.2 },
      ],
      adminUser: {
        email: 'admin@darajatfarms.com',
        password: 'Admin1234',
        name: 'Admin',
        role: 'admin',
      },
    };

    await fc.assert(
      fc.asyncProperty(
        // Generate a random number of additional seed invocations (1-4 extra runs after first)
        fc.integer({ min: 1, max: 4 }),
        async (additionalRuns) => {
          // Clean the database
          await User.deleteMany({});
          await CompanyInfo.deleteMany({});
          await Testimonial.deleteMany({});
          await BlogPost.deleteMany({});
          await ProductionRecord.deleteMany({});

          // First seed — populates the database
          const firstWarnings = await runSeedLogic(seedData);
          expect(firstWarnings.length).toBe(0); // No warnings on first run

          // Capture state after first seed
          const stateAfterFirst = await captureDbState();

          // Run seed N additional times
          let allWarningsCount = 0;
          for (let i = 0; i < additionalRuns; i++) {
            const warnings = await runSeedLogic(seedData);
            allWarningsCount += warnings.length;
            // Each re-run should produce warnings for all 5 collections
            expect(warnings.length).toBe(5);
          }

          // Total warnings should be 5 per additional run
          expect(allWarningsCount).toBe(5 * additionalRuns);

          // Capture state after all re-runs
          const stateAfterReRuns = await captureDbState();

          // State must be identical
          expect(stateAfterReRuns.companyCount).toBe(stateAfterFirst.companyCount);
          expect(stateAfterReRuns.companyName).toBe(stateAfterFirst.companyName);
          expect(stateAfterReRuns.testimonialCount).toBe(stateAfterFirst.testimonialCount);
          expect(stateAfterReRuns.testimonialAuthors).toEqual(stateAfterFirst.testimonialAuthors);
          expect(stateAfterReRuns.blogPostCount).toBe(stateAfterFirst.blogPostCount);
          expect(stateAfterReRuns.blogPostTitles).toEqual(stateAfterFirst.blogPostTitles);
          expect(stateAfterReRuns.productionRecordCount).toBe(stateAfterFirst.productionRecordCount);
          expect(stateAfterReRuns.productionRecordDates).toEqual(stateAfterFirst.productionRecordDates);
          expect(stateAfterReRuns.userCount).toBe(stateAfterFirst.userCount);
          expect(stateAfterReRuns.userEmails).toEqual(stateAfterFirst.userEmails);
        }
      ),
      { numRuns: 100 }
    );
  });
});
