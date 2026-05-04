import { Link } from 'react-router-dom'
import {
  ArrowRight, ShieldCheck, Wheat, Users, Truck,
  Egg, ChevronRight, Star,
} from 'lucide-react'
import {
  SectionHeader, StatCard, ProcessFlow, TestimonialCard, CTABanner, ProductCard, FeatureCard,
} from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { STATS, TESTIMONIALS } from '../data'

const PROCESS = [
  { icon: Egg, title: 'Hatchery', desc: 'Quality day-old chicks from certified breeders.' },
  { icon: Wheat, title: 'Rearing', desc: 'Optimal nutrition and climate-controlled housing.' },
  { icon: ShieldCheck, title: 'Production', desc: 'Biosecure layer and broiler production at scale.' },
  { icon: Truck, title: 'Distribution', desc: 'Cold-chain delivery direct to your door.' },
]

const WHY_US = [
  { icon: ShieldCheck, title: 'Strict Biosecurity', desc: 'All-in all-out systems, footbaths, and regular vet inspections keep disease risk minimal.' },
  { icon: Wheat, title: 'Premium Quality Feed', desc: 'Balanced rations formulated by nutritionists ensure healthy birds and superior produce.' },
  { icon: Users, title: 'Experienced Team', desc: '14+ years of hands-on expertise in commercial layer and broiler management.' },
  { icon: Star, title: 'Certified Quality', desc: 'HACCP-compliant handling and packaging from farm to delivery.' },
]

export default function Home() {
  const ref = useScrollReveal()

  return (
    <div ref={ref}>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background: rich green gradient stands in for a real farm photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-farm-dark via-farm-green to-farm-green-light" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #FFD166 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, #FFD166 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 container-max section pt-32">
          <div className="max-w-2xl">
            <span className="badge !bg-farm-yellow/20 !text-farm-yellow-light mb-5 inline-flex animate-fade-in">
              🌿 Farm Fresh Since 2010
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance mb-6 animate-fade-up">
              Fresh Eggs &amp; Quality Broilers You Can Trust
            </h1>
            <p className="text-white/75 text-lg md:text-xl leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Ghana's premier poultry farm delivering 12,000+ eggs daily and premium broilers — straight from our biosecure farm to your table.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/contact" className="btn-yellow text-base px-8 py-4">
                Order Now <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn-secondary border border-white text-white bg-transparent hover:bg-white/10 text-base px-8 py-4">
                Our Story
              </Link>
            </div>
          </div>

          {/* Floating stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            {STATS.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-white text-center">
                <p className="font-display text-2xl font-bold">{s.value}<span className="text-farm-yellow">{s.suffix}</span></p>
                <p className="text-white/70 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 30C1200 80 720 70 0 30Z" fill="#FAFAF5" />
          </svg>
        </div>
      </section>

      {/* ── Products ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-max">
          <SectionHeader
            label="What We Produce"
            title="Farm-Fresh Products"
            subtitle="From our biosecure farm directly to your kitchen or business. Every product backed by rigorous quality standards."
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            <ProductCard emoji="🥚" title="Table Eggs" badge="Daily Harvest" desc="Fresh-laid eggs from healthy, well-fed layers — collected and graded daily." to="/eggs" />
            <ProductCard emoji="🍳" title="Omega-3 Eggs" badge="Premium" desc="Enriched eggs from specially-fed hens for superior nutritional profile." to="/eggs" />
            <ProductCard emoji="🍗" title="Live Broilers" badge="Weekly Batch" desc="Fast-growing birds raised on balanced feed for superior meat yield." to="/broilers" />
            <ProductCard emoji="🥩" title="Dressed Chicken" badge="Ready to Cook" desc="Hygienically processed and packaged whole birds and portions." to="/broilers" />
          </div>
        </div>
      </section>

      {/* ── How We Work ─────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader
            label="Our Process"
            title="From Hatchery to Your Doorstep"
            subtitle="A fully integrated supply chain with quality checks at every stage."
            center
          />
          <div className="reveal">
            <ProcessFlow steps={PROCESS} />
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <SectionHeader
                label="Why Darajat Farms"
                title="Quality You Can See, Taste & Trust"
                subtitle="We don't just raise birds — we build systems that guarantee consistency, safety, and freshness batch after batch."
              />
              <Link to="/farm" className="btn-primary mt-2">
                Tour Our Farm <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal">
              {WHY_US.map((item, i) => (
                <FeatureCard key={i} icon={item.icon} title={item.title} desc={item.desc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="What Clients Say" title="Trusted by Restaurants, Hotels & Retailers" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <CTABanner
        title="Ready to Partner with Us?"
        subtitle="Wholesale & Bulk Orders Welcome"
        primaryLabel="Buy from Us"
        primaryTo="/contact"
        secondaryLabel="Learn About Partnerships"
        secondaryTo="/partnerships"
      />
    </div>
  )
}
