// ── Site Data ────────────────────────────────────────────────────────────────

export const COMPANY = {
  name: 'Darajat Farms',
  tagline: 'Fresh Eggs & Quality Broilers You Can Trust',
  phone: '+233 552866857, +233 244652431',
  email: 'info@darajatfarms.com',
  address: 'Accra, Greater Accra Region, Ghana',
  founded: 2010,
}

export const STATS = [
  { value: '12,000', suffix: '+', label: 'Eggs Produced Daily' },
  { value: '8,500', suffix: '+', label: 'Birds on Farm' },
  { value: '14', suffix: '', label: 'Years of Excellence' },
  { value: '200', suffix: '+', label: 'Wholesale Clients' },
]

export const TESTIMONIALS = [
  {
    quote: 'Darajat Farms has been our trusted egg supplier for 3 years. Consistent quality and always on time.',
    author: 'Kofi Mensah',
    role: 'Restaurant Owner, Accra',
    initials: 'KM',
  },
  {
    quote: 'The broilers are top grade. Our customers always notice the difference in taste and freshness.',
    author: 'Abena Osei',
    role: 'Retail Distributor',
    initials: 'AO',
  },
  {
    quote: 'Transparent operations, great biosecurity. You can tell these guys actually care about quality.',
    author: 'Emmanuel Adu',
    role: 'Hotel Procurement Manager',
    initials: 'EA',
  },
]

// Dashboard mock data
export const DASHBOARD_STATS = [
  { label: 'Eggs Produced Today', value: 11_840, unit: 'eggs', trend: +3.2 },
  { label: 'Birds Available', value: 8_420, unit: 'birds', trend: -0.8 },
  { label: 'Orders Pending', value: 17, unit: 'orders', trend: +12 },
  { label: 'Feed Stock', value: 4.2, unit: 'tonnes', trend: -5.1 },
]

export const EGG_PRODUCTION_DATA = [
  { day: 'Mon', eggs: 11200 },
  { day: 'Tue', eggs: 11450 },
  { day: 'Wed', eggs: 11800 },
  { day: 'Thu', eggs: 11600 },
  { day: 'Fri', eggs: 12100 },
  { day: 'Sat', eggs: 11900 },
  { day: 'Sun', eggs: 11840 },
]

export const BROILER_GROWTH_DATA = [
  { week: 'W1', weight: 0.18 },
  { week: 'W2', weight: 0.42 },
  { week: 'W3', weight: 0.85 },
  { week: 'W4', weight: 1.40 },
  { week: 'W5', weight: 2.00 },
  { week: 'W6', weight: 2.55 },
]

export const BLOG_POSTS = [
  {
    id: 1,
    title: 'How to Identify Fresh Eggs: A Complete Guide',
    excerpt: 'Learn the simple tests that reveal whether an egg is truly fresh — float test, candling, and more.',
    category: 'Egg Tips',
    date: 'March 15, 2025',
    readTime: '4 min',
  },
  {
    id: 2,
    title: 'Broiler Feeding Guide: Week-by-Week Nutrition',
    excerpt: 'Optimal feed formulations and schedules to maximise growth rates and minimise FCR in your broiler flock.',
    category: 'Broiler Care',
    date: 'February 28, 2025',
    readTime: '6 min',
  },
  {
    id: 3,
    title: '5 Common Poultry Diseases and How to Prevent Them',
    excerpt: 'From Newcastle disease to coccidiosis — prevention strategies every poultry farmer must know.',
    category: 'Health',
    date: 'February 10, 2025',
    readTime: '7 min',
  },
  {
    id: 4,
    title: 'Setting Up an Automated Watering System for Layers',
    excerpt: 'Nipple drinkers vs. bell drinkers — cost-benefit analysis and installation tips for small farms.',
    category: 'Technology',
    date: 'January 22, 2025',
    readTime: '5 min',
  },
]
