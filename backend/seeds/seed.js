// Database seeding script
// Run with: npm run seed

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

// Import models
const User = require('../src/models/User');
const CompanyInfo = require('../src/models/CompanyInfo');
const Testimonial = require('../src/models/Testimonial');
const BlogPost = require('../src/models/BlogPost');
const ProductionRecord = require('../src/models/ProductionRecord');

// ── Seed Data ────────────────────────────────────────────────────────────────

const companyData = {
  name: 'FreshFlock Farms',
  tagline: 'Fresh Eggs & Quality Broilers You Can Trust',
  phone: '+233 20 000 0000',
  email: 'info@freshflockfarms.com',
  address: 'Accra, Greater Accra Region, Ghana',
  founded: 2010,
};

const testimonialsData = [
  {
    quote: 'FreshFlock has been our trusted egg supplier for 3 years. Consistent quality and always on time.',
    author: 'Kofi Mensah',
    role: 'Restaurant Owner, Accra',
    initials: 'KM',
    approved: true,
  },
  {
    quote: 'The broilers are top grade. Our customers always notice the difference in taste and freshness.',
    author: 'Abena Osei',
    role: 'Retail Distributor',
    initials: 'AO',
    approved: true,
  },
  {
    quote: 'Transparent operations, great biosecurity. You can tell these guys actually care about quality.',
    author: 'Emmanuel Adu',
    role: 'Hotel Procurement Manager',
    initials: 'EA',
    approved: true,
  },
];

const blogPostsData = [
  {
    title: 'How to Identify Fresh Eggs: A Complete Guide',
    excerpt: 'Learn the simple tests that reveal whether an egg is truly fresh — float test, candling, and more.',
    content: `Identifying fresh eggs is an essential skill for consumers, chefs, and poultry farmers alike. Here are the most reliable methods to determine egg freshness.

The Float Test: Fill a bowl with cold water and gently place the egg in it. Fresh eggs sink and lay flat on the bottom. Eggs that are a week old will tilt slightly. If the egg floats to the surface, it is old and should be discarded.

Candling: Hold the egg up to a bright light source. Fresh eggs will appear mostly clear with a small air cell at the wide end. As eggs age, the air cell grows larger and the yolk becomes more visible and mobile.

The Shake Test: Hold the egg close to your ear and shake it gently. A fresh egg will feel solid with no movement inside. If you can hear sloshing, the egg is old as the white has thinned and the air cell has expanded.

Visual Inspection: Check the shell for cracks, unusual textures, or discoloration. Fresh eggs have a slightly rough, matte shell. A shiny or slimy shell can indicate age or bacterial contamination.

The Plate Test: Crack the egg onto a flat plate. A fresh egg will have a thick, viscous white that stays close to the yolk, and the yolk will be round and domed. Older eggs have watery whites that spread thin and flat yolks.`,
    category: 'Egg Tips',
    readTime: '4 min',
    published: true,
  },
  {
    title: 'Broiler Feeding Guide: Week-by-Week Nutrition',
    excerpt: 'Optimal feed formulations and schedules to maximise growth rates and minimise FCR in your broiler flock.',
    content: `Proper nutrition is the cornerstone of successful broiler production. This guide outlines the feeding program from day one through market weight.

Week 1 (Starter Phase): Use a high-protein starter feed (22-24% crude protein) in crumble form. Chicks should have feed available 24 hours a day. Ensure waterers are clean and accessible. Target intake is approximately 150g per bird for the first week.

Weeks 2-3 (Grower Phase): Transition to grower feed (20-22% protein) in pellet form. Feed conversion ratio (FCR) becomes critical during this phase. Monitor daily intake which should average 50-70g per bird per day. Ensure adequate feeder space — at least 2.5cm per bird.

Weeks 4-5 (Finisher Phase): Switch to finisher feed (18-20% protein) to optimize weight gain while controlling feed costs. Birds should be consuming 120-150g per day. Maintain water-to-feed ratio of 1.6:1 to 2:1.

Week 6 (Pre-Market): Continue finisher feed but consider withdrawal of any medications as per guidelines. Target live weight of 2.2-2.8kg depending on market requirements.

General Tips: Always provide clean water, maintain proper ventilation, and monitor litter conditions. Poor litter quality increases ammonia levels which depress feed intake and growth rates.`,
    category: 'Broiler Care',
    readTime: '6 min',
    published: true,
  },
  {
    title: '5 Common Poultry Diseases and How to Prevent Them',
    excerpt: 'From Newcastle disease to coccidiosis — prevention strategies every poultry farmer must know.',
    content: `Disease prevention is far more cost-effective than treatment in poultry farming. Here are five common diseases and how to protect your flock.

1. Newcastle Disease (ND): A highly contagious viral disease affecting the respiratory, nervous, and digestive systems. Prevention includes strict vaccination schedules (live vaccine at day 7, killed vaccine at week 3), biosecurity measures, and quarantine of new birds for at least 14 days.

2. Coccidiosis: Caused by Eimeria parasites that damage the intestinal lining. Prevention involves anticoccidial drugs in feed, proper litter management to control moisture levels below 30%, and vaccination with live oocysts in hatcheries for long-term immunity.

3. Infectious Bursal Disease (Gumboro): Targets the immune system of young birds. Vaccinate at days 14 and 21 with intermediate-plus strains. Ensure maternal antibody levels are considered when scheduling vaccinations.

4. Avian Influenza: Maintain strict biosecurity protocols including foot baths, restricted visitor access, and separation from wild birds. Report any sudden increase in mortality to veterinary authorities immediately.

5. Chronic Respiratory Disease (CRD): Caused by Mycoplasma gallisepticum. Prevent through clean housing, proper ventilation (minimum 4 air changes per hour), and avoiding overcrowding. Treat with appropriate antibiotics under veterinary guidance.

General Prevention: Maintain vaccination records, practice all-in-all-out flock management, disinfect houses between batches, and monitor flock daily for early signs of illness.`,
    category: 'Health',
    readTime: '7 min',
    published: true,
  },
  {
    title: 'Setting Up an Automated Watering System for Layers',
    excerpt: 'Nipple drinkers vs. bell drinkers — cost-benefit analysis and installation tips for small farms.',
    content: `Reliable water supply is critical for layer production — a hen drinks approximately 250ml of water per day, and even short periods of water deprivation reduce egg production significantly.

Nipple Drinkers: These are the modern standard for commercial operations. Each nipple serves 8-10 birds. Advantages include reduced water wastage (up to 30% less than bell drinkers), cleaner water supply, lower disease transmission, and less wet litter. Installation requires a pressurized header tank mounted 2-3 meters above the drinker line.

Bell Drinkers: Traditional and reliable but require more maintenance. Each bell serves 80-100 birds. They are cheaper upfront but waste more water and need daily cleaning. Suitable for smaller operations or as backup systems.

Cost Comparison: For a 1000-bird layer house, nipple systems cost approximately GHS 3,000-5,000 installed versus GHS 800-1,200 for bell drinkers. However, nipple systems typically pay back within 6-8 months through reduced water bills and lower disease costs.

Installation Tips: Ensure water pressure is consistent (20-30 PSI for nipples). Install filters before the header tank to prevent clogging. Use food-grade PVC pipes and check for leaks weekly. Position drinker lines at bird back height and raise as birds grow.

Maintenance: Flush lines weekly with clean water. Sanitize monthly with approved disinfectant. Check nipple flow rates quarterly — replace any delivering less than 60ml per minute. Monitor water consumption daily as sudden drops indicate system problems or health issues.`,
    category: 'Technology',
    readTime: '5 min',
    published: true,
  },
];

/**
 * Generate production records for the past 7 days (Mon-Sun).
 * Uses the dashboard mock data values.
 */
function getProductionRecords() {
  const eggsValues = [11200, 11450, 11800, 11600, 12100, 11900, 11840];
  const records = [];

  // Calculate the most recent Monday (start of the week)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    records.push({
      date,
      eggsProduced: eggsValues[i],
      birdsAvailable: 8420,
      feedStockTonnes: 4.2,
    });
  }

  return records;
}

const adminUserData = {
  email: 'admin@freshflockfarms.com',
  password: 'Admin1234',
  name: 'Admin',
  role: 'admin',
};

// ── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('ERROR: MONGO_URI environment variable is not set.');
    console.error('Please create a .env file with MONGO_URI or set it in your environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Seed Company Info
    const existingCompany = await CompanyInfo.findOne();
    if (existingCompany) {
      console.warn('⚠ Company info already exists — skipping');
    } else {
      await CompanyInfo.create(companyData);
      console.log('✓ Company info seeded');
    }

    // Seed Testimonials
    const existingTestimonials = await Testimonial.countDocuments();
    if (existingTestimonials > 0) {
      console.warn('⚠ Testimonials already exist — skipping');
    } else {
      await Testimonial.insertMany(testimonialsData);
      console.log('✓ Testimonials seeded (3 records)');
    }

    // Seed Blog Posts
    const existingPosts = await BlogPost.countDocuments();
    if (existingPosts > 0) {
      console.warn('⚠ Blog posts already exist — skipping');
    } else {
      await BlogPost.insertMany(blogPostsData);
      console.log('✓ Blog posts seeded (4 records)');
    }

    // Seed Production Records
    const existingRecords = await ProductionRecord.countDocuments();
    if (existingRecords > 0) {
      console.warn('⚠ Production records already exist — skipping');
    } else {
      const records = getProductionRecords();
      await ProductionRecord.insertMany(records);
      console.log('✓ Production records seeded (7 records)');
    }

    // Seed Default Admin User
    const existingAdmin = await User.findOne({ email: adminUserData.email });
    if (existingAdmin) {
      console.warn('⚠ Admin user already exists — skipping');
    } else {
      await User.create(adminUserData);
      console.log('✓ Admin user seeded (admin@freshflockfarms.com)');
    }

    console.log('\nSeeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Export for testing
module.exports = { seed };

// Run the seed function only when executed directly
if (require.main === module) {
  seed();
}
