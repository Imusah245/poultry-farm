import { Clock, Tag, ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import { PageHero, SectionHeader, CTABanner } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BLOG_POSTS } from '../data'

const CATEGORIES = ['All', 'Egg Tips', 'Broiler Care', 'Health', 'Technology', 'Business']

const EXTRA_POSTS = [
  {
    id: 5,
    title:    'Understanding Feed Conversion Ratio (FCR) in Broilers',
    excerpt:  'What FCR means, how to measure it on your farm, and practical steps to push it below 1.85.',
    category: 'Broiler Care',
    date:     'January 5, 2025',
    readTime: '8 min',
  },
  {
    id: 6,
    title:    'How to Price Your Eggs for Profit in Ghana',
    excerpt:  'A practical guide to cost-plus pricing, market benchmarking, and setting wholesale vs retail rates.',
    category: 'Business',
    date:     'December 14, 2024',
    readTime: '6 min',
  },
]

const ALL_POSTS = [...BLOG_POSTS, ...EXTRA_POSTS]

const CATEGORY_COLORS = {
  'Egg Tips':    'bg-farm-yellow-pale text-amber-700',
  'Broiler Care':'bg-farm-green-pale text-farm-green',
  'Health':      'bg-red-50 text-red-600',
  'Technology':  'bg-blue-50 text-blue-600',
  'Business':    'bg-purple-50 text-purple-600',
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [query, setQuery] = useState('')
  const ref = useScrollReveal()

  const filtered = ALL_POSTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchQ   = query === '' || p.title.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div ref={ref}>
      <PageHero
        badge="Knowledge Hub"
        title="Poultry Insights from the Farm"
        subtitle="Expert articles on egg production, broiler management, health, and running a profitable poultry business."
      />

      <section className="section">
        <div className="container-max">

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 reveal">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-farm-dark/40" />
              <input
                type="text"
                placeholder="Search articles…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-farm-green-pale bg-white text-sm text-farm-dark placeholder-farm-dark/35 focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all
                    ${activeCategory === cat
                      ? 'bg-farm-green text-white border-farm-green'
                      : 'bg-white text-farm-dark/60 border-farm-green-pale hover:border-farm-green hover:text-farm-green'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured post */}
          {filtered.length > 0 && activeCategory === 'All' && query === '' && (
            <div className="card p-0 overflow-hidden mb-8 reveal group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <div className="grid md:grid-cols-2">
                <div className="h-56 md:h-auto bg-gradient-to-br from-farm-green to-farm-green-light flex items-center justify-center text-8xl">
                  🥚
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[filtered[0].category]}`}>
                      {filtered[0].category}
                    </span>
                    <span className="badge">Featured</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-farm-dark mb-3 group-hover:text-farm-green transition-colors">
                    {filtered[0].title}
                  </h2>
                  <p className="text-farm-dark/60 text-sm leading-relaxed mb-4">{filtered[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-farm-dark/40 text-xs">
                      <span>{filtered[0].date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {filtered[0].readTime} read</span>
                    </div>
                    <span className="text-farm-green font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Post grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
            {(activeCategory === 'All' && query === '' ? filtered.slice(1) : filtered).map(post => (
              <article key={post.id} className="card p-0 overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                <div className="h-36 bg-gradient-to-br from-farm-green-pale to-farm-yellow-pale flex items-center justify-center text-5xl">
                  {post.category === 'Egg Tips' ? '🥚' : post.category === 'Broiler Care' ? '🍗' : post.category === 'Health' ? '💊' : post.category === 'Technology' ? '⚙️' : '📊'}
                </div>
                <div className="p-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                  <h3 className="font-display font-bold text-base text-farm-dark mt-3 mb-2 group-hover:text-farm-green transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-farm-dark/55 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-farm-dark/40 text-xs pt-3 border-t border-farm-green-pale/50">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-farm-dark/40">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold">No articles found for your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="section bg-white">
        <div className="container-max max-w-2xl text-center reveal">
          <p className="section-label">Newsletter</p>
          <h2 className="font-display text-3xl font-bold text-farm-dark mb-3">Get Poultry Tips in Your Inbox</h2>
          <p className="text-farm-dark/60 mb-6">Monthly insights on egg production, broiler management, and farm business.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-full border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition"
            />
            <button className="btn-primary whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>

      <CTABanner
        title="Questions? Our Experts Are Ready"
        subtitle="Poultry Consultancy Available"
        primaryLabel="Get in Touch"
        primaryTo="/contact"
      />
    </div>
  )
}
