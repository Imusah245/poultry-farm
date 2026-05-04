import { Heart, Eye, Target, Award, Leaf, Users } from 'lucide-react'
import { PageHero, SectionHeader, FeatureCard, CTABanner, TestimonialCard } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { COMPANY } from '../data'

const MILESTONES = [
  { year: '2010', event: 'Founded with 500 layers in a backyard shed.' },
  { year: '2012', event: 'Expanded to first commercial layer house — 2,000 birds.' },
  { year: '2014', event: 'Launched broiler production line. First wholesale clients.' },
  { year: '2017', event: 'Reached 5,000-bird capacity. On-site feed mixing unit installed.' },
  { year: '2019', event: 'Egg grading machine and cold room added. Certified by Ghana FDA.' },
  { year: '2021', event: 'Automated feeding and ventilation systems deployed.' },
  { year: '2023', event: 'Launched digital farm dashboard. 200+ wholesale clients served.' },
  { year: '2024', event: '8,500+ birds at peak. Expanding to third broiler house.' },
]

const VALUES = [
  { icon: Heart, title: 'Animal Welfare', desc: 'Healthy birds produce better food. We invest in housing, nutrition, and veterinary care above industry minimum standards.' },
  { icon: Leaf, title: 'Sustainability', desc: 'Litter composted to organic fertiliser, solar supplementing grid power, and water recycling in our wash-down systems.' },
  { icon: Award, title: 'Uncompromising Quality', desc: 'We reject before we dispatch. Every product meets the same grade standard that built our reputation since 2010.' },
  { icon: Users, title: 'Community First', desc: 'We employ locally, buy feed locally, and support smallholder farmers through our chick and feed referral programme.' },
  { icon: Target, title: 'Transparency', desc: 'Our live dashboard is public. We welcome farm visits because we have nothing to hide — and a lot to show.' },
  { icon: Eye, title: 'Continuous Improvement', desc: 'Every batch teaches us something. Quarterly performance reviews drive incremental gains in FCR, mortality, and quality.' },
]

const TEAM = [
  { initials: 'RA', name: 'Abdul Rauf Abubakar', role: 'Founder & Managing Director', bio: 'Agricultural science graduate with 14 years hands-on poultry experience.' },
  { initials: 'DM', name: 'Darajat Musah', role: 'Farm Manager', bio: '10 years in commercial layer and broiler management. BSc Animal Science.' },
  { initials: 'EK', name: 'Emmanuel Kumi', role: 'Veterinary Consultant (Retainer)', bio: 'Licensed vet with poultry specialty. Weekly farm health audits.' },
  { initials: 'AB', name: 'Abena Boateng', role: 'Sales & Partnerships Manager', bio: 'Manages wholesale accounts and new business development.' },
]

export default function About() {
  const ref = useScrollReveal()

  return (
    <div ref={ref}>
      <PageHero
        badge="About Us"
        title="A Farm Built on Integrity"
        subtitle="From 500 backyard layers to 8,500+ birds and 200 wholesale clients — the Darajat Farms story is one of slow, deliberate, quality-first growth."
      />

      {/* Origin Story */}
      <section className="section">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <SectionHeader label="Our Story" title="How Darajat Farms Began" />
              <div className="space-y-4 text-farm-dark/70 leading-relaxed">
                <p>
                  Darajat Farms was founded in 2009 by Abdul Rauf Abubakar, an agricultural science graduate who believed that Ghana's urban food chain deserved a better class of egg. Starting with 500 Lohmann Brown pullets in a self-built wooden shed on his family's land, Abdul Rauf sold to neighbours and a handful of local restaurants.
                </p>
                <p>
                  The philosophy was simple: never cut corners on feed, biosecurity, or bird welfare. That philosophy — stubbornly maintained through difficult commodity price cycles and disease pressures — built a reputation that marketing money couldn't buy.
                </p>
                <p>
                  Today Darajat Farms operates 7 production houses, employs 12 full-time staff, and delivers to over 200 wholesale clients across Accra and beyond. The feed-first, quality-first ethos hasn't changed since day one.
                </p>
              </div>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 reveal">
              {[
                { v: '2009', l: 'Year Founded' },
                { v: '8,500+', l: 'Birds at Peak' },
                { v: '12', l: 'Full-Time Staff' },
                { v: '200+', l: 'Wholesale Clients' },
              ].map((s, i) => (
                <div key={i} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                  <p className="font-display text-3xl font-bold text-farm-green mb-1">{s.v}</p>
                  <p className="text-farm-dark/60 text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-6 reveal">
            <div className="card p-8 bg-gradient-to-br from-farm-green to-farm-green-light text-white">
              <Target size={32} className="mb-4 text-farm-yellow" />
              <h3 className="font-display text-2xl font-bold mb-3">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">
                To be the most trusted poultry producer in Ghana by consistently delivering safe, nutritious, and affordable eggs and broilers — while setting the standard for biosecurity, animal welfare, and operational transparency in West African commercial farming.
              </p>
            </div>
            <div className="card p-8 border-2 border-farm-yellow/30">
              <Eye size={32} className="mb-4 text-farm-yellow" />
              <h3 className="font-display text-2xl font-bold text-farm-dark mb-3">Our Vision</h3>
              <p className="text-farm-dark/70 leading-relaxed">
                A future where every family in Ghana has consistent access to affordable, high-quality protein from a local farm they can trust — and where Darajat Farms is synonymous with that trust across West Africa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container-max max-w-3xl">
          <SectionHeader label="Our Journey" title="14 Years of Growth" center />
          <div className="relative reveal">
            {/* Vertical line */}
            <div className="absolute left-[88px] top-0 bottom-0 w-0.5 bg-farm-green-pale" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="font-mono font-bold text-farm-green text-sm">{m.year}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-farm-green border-2 border-white shadow" />
                  </div>
                  <p className="text-farm-dark/70 text-sm leading-relaxed pt-0.5">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="What We Stand For" title="Our Core Values" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            {VALUES.map((v, i) => <FeatureCard key={i} {...v} />)}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Our People" title="The Team Behind the Farm" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal">
            {TEAM.map((member, i) => (
              <div key={i} className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 rounded-2xl bg-farm-green text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {member.initials}
                </div>
                <h4 className="font-semibold text-farm-dark mb-0.5">{member.name}</h4>
                <p className="text-farm-green text-xs font-semibold mb-3">{member.role}</p>
                <p className="text-farm-dark/55 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to Work with a Farm You Can Trust?"
        subtitle="Wholesale & Retail Supply Available"
        primaryLabel="Get in Touch"
        primaryTo="/contact"
        secondaryLabel="View Our Products"
        secondaryTo="/eggs"
      />
    </div>
  )
}
