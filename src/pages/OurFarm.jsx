import { Home, Droplets, Thermometer, ShieldCheck, Users, MapPin } from 'lucide-react'
import { PageHero, SectionHeader, FeatureCard, CTABanner } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'

const HOUSING = [
  { icon: Home, title: 'Layer Houses', desc: '4 dedicated layer houses, 3,000 birds per house. Enriched colony cages with individual feed and water access.' },
  { icon: Home, title: 'Broiler Houses', desc: '3 broiler houses on deep litter. Capacity: 5,000 birds per batch. Curtain-sided with natural and forced ventilation.' },
  { icon: Droplets, title: 'Water Systems', desc: 'Nipple drinker lines connected to overhead tanks with UV filtration. Automatic water pressure regulation.' },
  { icon: Thermometer, title: 'Climate Control', desc: 'Thermostatically controlled tunnel ventilation and evaporative cooling pads for year-round comfort.' },
  { icon: ShieldCheck, title: 'Waste Management', desc: 'Litter composted on-site and sold as organic fertiliser. Minimal environmental footprint.' },
  { icon: MapPin, title: 'Location', desc: 'Situated on 5 acres in a peri-urban zone with good road access. Surrounded by wind-break trees.' },
]

const BIOSECURITY = [
  'All-in, all-out production system',
  'Visitor register and protective clothing requirement',
  'Disinfectant footbaths at all entry points',
  'Vehicle wheel dip at farm gate',
  'Wild bird netting on all ventilation openings',
  'Rodent and pest control programme',
  'Carcass disposal via composting',
  'Quarterly veterinary farm audits',
]

const EQUIPMENT = [
  { name: 'Feed Milling Unit', desc: 'On-site hammer mill for fresh feed mixing.' },
  { name: 'Egg Grading Machine', desc: 'Automated grading by weight and candling.' },
  { name: 'Cold Room (2°C)', desc: 'Short-term egg and dressed chicken storage.' },
  { name: 'Water Filtration System', desc: 'UV + sediment filtration for all bird drinking water.' },
  { name: 'Generator Backup (45KVA)', desc: '24/7 power assurance for critical systems.' },
  { name: 'Weighing & Record Station', desc: 'Daily bird weighing and performance tracking.' },
]

export default function OurFarm() {
  const ref = useScrollReveal()

  return (
    <div ref={ref}>
      <PageHero
        badge="Our Farm"
        title="Transparency Is Our Foundation"
        subtitle="Take a virtual tour of our 5-acre facility. Every system is designed for welfare, efficiency, and food safety."
        cta={<a href="/contact" className="btn-yellow">Book a Farm Visit</a>}
      />

      {/* Overview */}
      <section className="section">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <SectionHeader label="Farm Overview" title="Built for Scale, Managed with Care" />
              <div className="space-y-4 text-farm-dark/70 leading-relaxed">
                <p>
                  Darajat Farms sits on 5 acres of land on the outskirts of Accra. Established in 2009, the farm has grown from a 500-bird backyard operation to a commercial facility housing over 8,500 birds at peak capacity.
                </p>
                <p>
                  We operate two production lines: a layer unit for daily egg production and a broiler unit running multiple overlapping 6-week cycles. Both units follow strict all-in all-out management to maintain biosecurity.
                </p>
                <p>
                  Every aspect of the farm — from feed formulation to waste management — is documented and reviewed quarterly by our veterinary consultant and farm manager.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 reveal">
              {[
                { v: '5 acres', l: 'Farm Size' },
                { v: '8,500+', l: 'Bird Capacity' },
                { v: '7 houses', l: 'Production Houses' },
                { v: '14 yrs', l: 'In Operation' },
              ].map((s, i) => (
                <div key={i} className="card p-6 text-center">
                  <p className="font-display text-3xl font-bold text-farm-green mb-1">{s.v}</p>
                  <p className="text-farm-dark/60 text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Housing */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="Housing & Infrastructure" title="Modern Facilities for Healthy Birds" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            {HOUSING.map((h, i) => <FeatureCard key={i} {...h} />)}
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Equipment" title="Technology That Works" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            {EQUIPMENT.map((eq, i) => (
              <div key={i} className="card p-5 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-farm-yellow mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-farm-dark mb-1">{eq.name}</h4>
                  <p className="text-farm-dark/60 text-sm">{eq.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Biosecurity */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <SectionHeader label="Biosecurity" title="Our 8-Point Biosecurity Protocol" subtitle="Disease prevention is non-negotiable. Our protocols meet international commercial poultry standards." />
              <ul className="space-y-3">
                {BIOSECURITY.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-farm-dark/70">
                    <ShieldCheck size={16} className="text-farm-green flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal">
              <div className="card p-8 bg-gradient-to-br from-farm-green to-farm-green-light text-white">
                <Users size={32} className="mb-4 text-farm-yellow" />
                <h3 className="font-display text-2xl font-bold mb-3">Our Team</h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  Darajat Farms employs 12 full-time staff including a resident farm manager with 10+ years experience, two trained stockmen, a qualified vet on retainer, and a dedicated delivery team.
                </p>
                <p className="text-white/80 leading-relaxed">
                  All staff undergo annual food safety and biosecurity training. We believe a well-trained team is the most important piece of equipment on any farm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Come See It for Yourself"
        subtitle="Farm Visits Welcome"
        primaryLabel="Book a Visit"
        primaryTo="/contact"
        secondaryLabel="View Technology"
        secondaryTo="/technology"
      />
    </div>
  )
}
