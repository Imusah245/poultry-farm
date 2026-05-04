import { ShieldCheck, Egg, Package, Thermometer, Droplets, Award } from 'lucide-react'
import { PageHero, SectionHeader, ProcessFlow, FeatureCard, CTABanner } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'

const PROCESS = [
  { icon: Egg, title: 'Feeding', desc: 'Balanced layer mash with calcium for strong shells and rich yolks.' },
  { icon: Egg, title: 'Laying', desc: 'Hens lay in clean, comfortable nest boxes twice daily.' },
  { icon: Package, title: 'Collection', desc: 'Eggs collected 2× daily, inspected and candled for quality.' },
  { icon: ShieldCheck, title: 'Packaging', desc: 'Graded by size and weight, packed in food-safe trays or cartons.' },
]

const EGG_TYPES = [
  {
    emoji: '🥚',
    title: 'Regular Table Eggs',
    desc: 'Classic white or brown eggs from our Lohmann Brown and ISA Brown layers. Grade A quality with rich, flavourful yolks.',
    badge: 'Bestseller',
    sizes: ['Small (< 53g)', 'Medium (53–63g)', 'Large (63–73g)', 'Jumbo (> 73g)'],
  },
  {
    emoji: '💛',
    title: 'Omega-3 Enriched Eggs',
    desc: 'From hens fed linseed-supplemented diet. Higher DHA and EPA content — ideal for health-conscious consumers.',
    badge: 'Premium',
    sizes: ['Medium', 'Large'],
  },
  {
    emoji: '🌿',
    title: 'Organic Eggs',
    desc: 'Hens raised on certified organic feed with outdoor access. No antibiotics or synthetic hormones. Coming soon.',
    badge: 'Coming Soon',
    sizes: ['Medium', 'Large'],
  },
]

const QA_FEATURES = [
  { icon: ShieldCheck, title: 'Clean Environment', desc: 'Houses cleaned and disinfected between each batch. Daily litter management prevents ammonia build-up.' },
  { icon: Egg, title: 'Optimal Nutrition', desc: 'Layer feed formulated by certified nutritionist. Fresh water available 24/7 via automated nipple drinkers.' },
  { icon: Thermometer, title: 'Controlled Storage', desc: 'Eggs stored at 18°C and 75% RH to maintain freshness. Never refrigerated during transit — unless requested.' },
  { icon: Droplets, title: 'Candling & Grading', desc: 'Every egg individually candled to detect cracks or abnormalities before packing.' },
  { icon: Award, title: 'Graded by Size', desc: 'Consistent size grading ensures your customers always get what they expect.' },
  { icon: Package, title: 'Safe Packaging', desc: 'Food-safe pulp trays and cartons clearly labelled with production and best-before dates.' },
]

export default function EggProduction() {
  const ref = useScrollReveal()

  return (
    <div ref={ref}>
      <PageHero
        badge="Egg Production"
        title="Farm-Fresh Eggs, Every Single Day"
        subtitle="12,000+ eggs harvested daily from our biosecure layer farm. Grade A quality, consistent supply."
        cta={
          <>
            <a href="/contact" className="btn-yellow">Order Eggs</a>
            <a href="/contact" className="btn-secondary !border-white !text-white hover:!bg-white/10">Wholesale Inquiry</a>
          </>
        }
      />

      {/* Egg Types */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Our Eggs" title="Choose the Right Egg for Your Needs" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
            {EGG_TYPES.map((egg, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{egg.emoji}</span>
                  <span className="badge">{egg.badge}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-farm-dark mb-2">{egg.title}</h3>
                <p className="text-farm-dark/60 text-sm leading-relaxed mb-4">{egg.desc}</p>
                <div>
                  <p className="text-xs font-semibold text-farm-dark/40 uppercase tracking-wider mb-2">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {egg.sizes.map(s => (
                      <span key={s} className="text-xs px-2.5 py-1 bg-farm-green-pale text-farm-green rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="Our Process" title="From Nest Box to Your Door" center />
          <div className="reveal">
            <ProcessFlow steps={PROCESS} />
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Quality Assurance" title="Why Our Eggs Are Different" subtitle="Six pillars of quality that make every Darajat egg exceptional." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            {QA_FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Stock Up on Premium Eggs?"
        subtitle="Daily & Weekly Supply Available"
        primaryLabel="Order Eggs Now"
        primaryTo="/contact"
        secondaryLabel="Wholesale Inquiry"
        secondaryTo="/partnerships"
      />
    </div>
  )
}
