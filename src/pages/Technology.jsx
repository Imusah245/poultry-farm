import { Cpu, Droplets, Thermometer, Wind, BarChart2, Zap, Wifi, Shield } from 'lucide-react'
import { PageHero, SectionHeader, FeatureCard, CTABanner } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'

const TECH_PILLARS = [
  {
    icon: Cpu,
    title: 'Automated Feeding',
    desc: 'Chain-and-pan feeding systems deliver precise rations across all houses on a programmed schedule, eliminating human error and reducing feed wastage by up to 18%.',
    stat: '18% less feed waste',
  },
  {
    icon: Droplets,
    title: 'Nipple Drinker Systems',
    desc: 'Closed nipple drinker lines with UV-filtered water supply. Automatic pressure regulation ensures every bird gets consistent water access 24/7.',
    stat: '100% water availability',
  },
  {
    icon: Thermometer,
    title: 'Climate Control',
    desc: 'Thermostatically controlled tunnel ventilation and evaporative cooling pads maintain optimal house temperature (18–24°C) year-round regardless of outside weather.',
    stat: '±1°C precision',
  },
  {
    icon: Wind,
    title: 'Ventilation Automation',
    desc: 'Variable-speed fans adjust airflow based on CO₂, ammonia, and humidity sensors. Prevents respiratory disease and maintains litter quality.',
    stat: '24/7 air monitoring',
  },
  {
    icon: BarChart2,
    title: 'Production Tracking',
    desc: 'Daily egg counts, feed consumption, water intake, and mortality are logged digitally. Trends are visualised on our live dashboard for instant decision-making.',
    stat: 'Real-time data',
  },
  {
    icon: Zap,
    title: 'Backup Power',
    desc: 'A 45KVA generator automatically kicks in within 8 seconds of grid failure. Critical systems — fans, drinkers, brooders — never go offline.',
    stat: '< 8s failover',
  },
]

const DASHBOARD_METRICS = [
  { label: 'Egg Count Today', value: '11,840', unit: 'eggs', up: true },
  { label: 'Mortality Rate', value: '0.08', unit: '%', up: false },
  { label: 'Feed Consumed', value: '1.24', unit: 'tonnes', up: false },
  { label: 'Avg House Temp', value: '22.4', unit: '°C', up: false },
  { label: 'Water Usage', value: '3,200', unit: 'litres', up: false },
  { label: 'Live Birds', value: '8,420', unit: 'birds', up: true },
]

export default function Technology() {
  const ref = useScrollReveal()

  return (
    <div ref={ref}>
      <PageHero
        badge="Technology & Innovation"
        title="Smart Farming, Better Results"
        subtitle="Most farms rely on guesswork. We rely on data — automated systems and real-time monitoring that keep every bird healthy and every order consistent."
        cta={<a href="/dashboard" className="btn-yellow">View Live Dashboard</a>}
      />

      {/* Intro text */}
      <section className="section">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <SectionHeader
                label="Our Edge"
                title="Technology That Separates Us from the Competition"
              />
              <p className="text-farm-dark/65 leading-relaxed mb-4">
                While most poultry farms in Ghana still operate on manual observation and paper records, Darajat has invested in automation, sensor networks, and digital record-keeping that give us a measurable edge in bird performance, product consistency, and operational efficiency.
              </p>
              <p className="text-farm-dark/65 leading-relaxed mb-6">
                Our tech stack isn't just for show — it directly translates to lower mortality, better feed conversion ratios, and consistent supply for our customers.
              </p>
              <div className="flex flex-wrap gap-3">
                {['FCR < 1.85', 'Mortality < 3%', '98% order fulfilment', 'ISO-aligned records'].map(tag => (
                  <span key={tag} className="badge text-xs">{tag}</span>
                ))}
              </div>
            </div>
            {/* Mini dashboard preview */}
            <div className="card p-6 reveal">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="section-label !mb-0">Live Snapshot</p>
                  <p className="text-farm-dark/50 text-xs mt-0.5">Updated every 15 minutes</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DASHBOARD_METRICS.map((m, i) => (
                  <div key={i} className="bg-farm-cream rounded-xl p-3">
                    <p className="text-farm-dark/50 text-xs mb-1">{m.label}</p>
                    <p className="font-display font-bold text-lg text-farm-dark">
                      {m.value}
                      <span className="text-farm-green text-sm ml-1">{m.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
              <a href="/dashboard" className="btn-primary w-full justify-center mt-4 text-sm">
                Open Full Dashboard
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Tech Pillars */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="Our Systems" title="Six Technologies Driving Our Farm" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            {TECH_PILLARS.map((t, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-11 h-11 rounded-xl bg-farm-green-pale flex items-center justify-center text-farm-green mb-4">
                  <t.icon size={20} />
                </div>
                <h3 className="font-semibold text-farm-dark mb-2">{t.title}</h3>
                <p className="text-farm-dark/60 text-sm leading-relaxed mb-4">{t.desc}</p>
                <span className="badge">{t.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's next */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Coming Soon" title="What We're Building Next" subtitle="Our R&D pipeline for the next 12 months." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 reveal">
            <FeatureCard icon={Wifi} title="IoT Sensor Network" desc="Per-house temperature, humidity, and ammonia sensors feeding into a central control panel." />
            <FeatureCard icon={Shield} title="AI Mortality Alerts" desc="Computer vision cameras detecting signs of illness or distress before they become costly outbreaks." />
            <FeatureCard icon={Cpu} title="Automated Egg Grading" desc="Machine-vision grading system replacing manual candling for 100% throughput accuracy." />
          </div>
        </div>
      </section>

      <CTABanner
        title="Want to See the Technology in Action?"
        subtitle="Book a Farm Tour"
        primaryLabel="Schedule a Visit"
        primaryTo="/contact"
        secondaryLabel="View Live Dashboard"
        secondaryTo="/dashboard"
      />
    </div>
  )
}
