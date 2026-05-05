import { Egg, Wheat, Home, Package, ShieldCheck, Truck } from 'lucide-react'
import { PageHero, SectionHeader, ProcessFlow, FeatureCard, CTABanner } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom';
const GROWTH_CYCLE = [
  { day: 'Day 1', weight: '~42g', note: 'Day-old chicks arrive. Warm brooders, fresh water, starter crumbles.' },
  { day: 'Week 1', weight: '~180g', note: 'High-protein starter feed. Brooder temperature gradually reduced.' },
  { day: 'Week 2', weight: '~420g', note: 'Transition to grower feed. Full feather coverage.' },
  { day: 'Week 3', weight: '~850g', note: 'Rapid growth phase. Feed and water access maximised.' },
  { day: 'Week 4', weight: '~1.4kg', note: 'Litter management intensified. Ventilation adjusted.' },
  { day: 'Week 5', weight: '~2.0kg', note: 'Pre-finisher phase. FCR monitored daily.' },
  { day: 'Week 6', weight: '~2.5kg', note: 'Ready-for-market weight. Live birds or processing.' },
]

const PROCESS = [
  { icon: Egg, title: 'Day-Old Chicks', desc: 'Sourced from certified hatcheries with Marek\'s vaccination.' },
  { icon: Wheat, title: 'Feeding Program', desc: 'Starter → Grower → Finisher. Balanced for optimal FCR.' },
  { icon: Home, title: 'Housing', desc: 'Deep-litter houses with automated ventilation and heating.' },
  { icon: Package, title: 'Processing', desc: 'On-farm or certified abattoir. Hygienic packaging.' },
]

const PRODUCT_OPTIONS = [
  { emoji: '🐔', title: 'Live Birds', desc: 'Available every 6–8 weeks. Minimum order: 50 birds. Ideal for local markets, individuals, and small processors.' },
  { emoji: '🥩', title: 'Dressed Chicken', desc: 'Whole birds cleaned and packaged. Available fresh or chilled. Suitable for hotels, restaurants, and supermarkets.' },
  { emoji: '🍗', title: 'Cut Portions', desc: 'Breast, thigh, drumstick, wings. Custom cuts available for bulk orders. Coming soon.' },
]

export default function BroilerProduction() {
  const ref = useScrollReveal()

  return (
    <div ref={ref}>
      <PageHero
        badge="Broiler Production"
        title="Premium Broilers, Ready Every 6 Weeks"
        subtitle="High-performance Ross 308 and Cobb 500 birds raised on balanced feed for superior meat yield and taste."
        cta={
          <>
            <Link to="/contact" className="btn-yellow">
              Order Broilers
            </Link>
            <Link to="/partnerships" className="btn-secondary !border-white !text-white hover:!bg-white/10">
              Bulk Pricing
            </Link>
          </>
        }
      />

      {/* Growth Cycle */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Growth Cycle" title="Day 1 to Market in 6 Weeks" subtitle="Our controlled production cycle ensures uniform weight, low mortality, and excellent feed conversion." />
          <div className="overflow-x-auto reveal">
            <table className="data-table w-full rounded-xl overflow-hidden shadow-card">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Avg. Weight</th>
                  <th>Management Focus</th>
                </tr>
              </thead>
              <tbody>
                {GROWTH_CYCLE.map((row, i) => (
                  <tr key={i}>
                    <td className="font-semibold text-farm-green">{row.day}</td>
                    <td className="font-mono text-farm-dark">{row.weight}</td>
                    <td className="text-farm-dark/70">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="Our Process" title="How We Raise Our Broilers" center />
          <div className="reveal">
            <ProcessFlow steps={PROCESS} />
          </div>
        </div>
      </section>

      {/* Product Options */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Product Options" title="Choose How You Buy" center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
            {PRODUCT_OPTIONS.map((p, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-transform duration-300 text-center">
                <span className="text-5xl mb-4 block">{p.emoji}</span>
                <h3 className="font-display font-bold text-xl text-farm-dark mb-2">{p.title}</h3>
                <p className="text-farm-dark/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Housing & Biosecurity */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="Our Standards" title="Housing & Biosecurity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            <FeatureCard icon={Home} title="Deep-Litter Housing" desc="Properly ventilated houses with controlled humidity and temperature. Wood shavings litter changed between batches." />
            <FeatureCard icon={ShieldCheck} title="All-In All-Out" desc="Only one age group per house at any time, preventing cross-contamination between production cycles." />
            <FeatureCard icon={Wheat} title="Antibiotic Policy" desc="No prophylactic antibiotics. Growth promoters strictly prohibited. Withdrawal periods observed." />
            <FeatureCard icon={Truck} title="Controlled Access" desc="Visitor logbook, protective clothing, and disinfectant footbaths at all house entrances." />
            <FeatureCard icon={Package} title="Feed Quality" desc="Feed sourced from accredited mills with full ingredient traceability and mycotoxin testing." />
            <FeatureCard icon={Egg} title="Vaccination Program" desc="Marek's disease, Newcastle, IBD, and IB vaccines administered per schedule by licensed vet." />
          </div>
        </div>
      </section>

      <CTABanner
        title="Order Quality Broilers Today"
        subtitle="Live Birds & Dressed Chicken Available"
        primaryLabel="Place an Order"
        primaryTo="/contact"
        secondaryLabel="Bulk / Wholesale Inquiry"
        secondaryTo="/partnerships"
      />
    </div>
  )
}
