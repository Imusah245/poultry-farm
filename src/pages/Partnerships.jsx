import { useState } from 'react'
import { Utensils, ShoppingBag, Truck, Building2, Check, ArrowRight, Send } from 'lucide-react'
import { PageHero, SectionHeader, FeatureCard, CTABanner } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'

const BUYER_TYPES = [
  {
    icon: Utensils,
    title: 'Restaurants & Hotels',
    desc: 'Reliable daily or weekly egg and broiler supply tailored to your kitchen schedule. Invoiced monthly, delivered on time.',
    perks: ['Consistent grade-A eggs', 'Custom cut portions available', 'Priority delivery slots', 'Flexible order volumes'],
  },
  {
    icon: ShoppingBag,
    title: 'Supermarkets & Retailers',
    desc: 'Branded or white-label packaging. Consistent grading ensures shelf-ready products every time.',
    perks: ['Retail-ready packaging', 'Customisable labels', 'Consistent size grading', 'Returns policy'],
  },
  {
    icon: Truck,
    title: 'Distributors',
    desc: 'Competitive wholesale pricing with volume tiers. Regular batch availability for forward planning.',
    perks: ['Volume-based pricing', 'Advance batch bookings', 'Bulk live bird supply', 'Flexible pickup / delivery'],
  },
  {
    icon: Building2,
    title: 'Institutions & Caterers',
    desc: 'Schools, hospitals, canteens — stable large-volume supply with documentation for procurement compliance.',
    perks: ['Delivery documentation', 'Health certificates', 'Bulk invoice terms', 'Nutritional data sheets'],
  },
]

const TIERS = [
  {
    name: 'Standard',
    badge: '',
    min: '50–199 trays/week',
    eggPrice: 'Market rate',
    broilerPrice: 'Market rate',
    features: ['Weekly invoicing', 'Standard delivery', 'Email support'],
    highlight: false,
  },
  {
    name: 'Wholesale',
    badge: 'Most Popular',
    min: '200–499 trays/week',
    eggPrice: '5% discount',
    broilerPrice: '4% discount',
    features: ['Bi-weekly invoicing', 'Priority delivery', 'Dedicated account rep', 'Monthly report'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    badge: 'Best Value',
    min: '500+ trays/week',
    eggPrice: 'Negotiated',
    broilerPrice: 'Negotiated',
    features: ['Custom payment terms', 'Same-day restocking', 'Dedicated account rep', 'Co-branding options', 'Farm audit access'],
    highlight: false,
  },
]

export default function Partnerships() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', type: '', volume: '', message: '' })
  const [sent, setSent] = useState(false)
  const ref = useScrollReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div ref={ref}>
      <PageHero
        badge="Partnerships & Bulk Orders"
        title="Let's Grow Your Business Together"
        subtitle="Consistent supply, competitive pricing, and a dedicated account team — everything your business needs from a poultry partner."
        cta={<a href="#inquiry" className="btn-yellow">Send Inquiry <ArrowRight size={16} /></a>}
      />

      {/* Buyer types */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Who We Work With" title="Built for Every Type of Buyer" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal">
            {BUYER_TYPES.map((bt, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-11 h-11 rounded-xl bg-farm-green-pale text-farm-green flex items-center justify-center mb-4">
                  <bt.icon size={20} />
                </div>
                <h3 className="font-semibold text-farm-dark mb-2">{bt.title}</h3>
                <p className="text-farm-dark/60 text-sm leading-relaxed mb-4">{bt.desc}</p>
                <ul className="space-y-1.5">
                  {bt.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-xs text-farm-dark/70">
                      <Check size={12} className="text-farm-green flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section bg-white">
        <div className="container-max">
          <SectionHeader label="Pricing Tiers" title="Volume Discounts That Make Sense" subtitle="The more you order, the better your rate. All tiers include reliable weekly supply." center />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
            {TIERS.map((tier, i) => (
              <div key={i} className={`card p-8 relative
                ${tier.highlight ? 'border-2 border-farm-green shadow-hover' : ''}`}>
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge whitespace-nowrap">
                    {tier.badge}
                  </span>
                )}
                <h3 className="font-display font-bold text-2xl text-farm-dark mb-1">{tier.name}</h3>
                <p className="text-farm-dark/50 text-sm mb-5">{tier.min}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-farm-dark/60">Eggs</span>
                    <span className="font-semibold text-farm-green">{tier.eggPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-farm-dark/60">Broilers</span>
                    <span className="font-semibold text-farm-green">{tier.broilerPrice}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-farm-dark/70">
                      <Check size={14} className="text-farm-green flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <a href="#inquiry" className={tier.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                  Get Started
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-farm-dark/40 text-xs mt-6">
            * Prices in GHS and subject to market rates. Contact us for a custom quote.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container-max">
          <SectionHeader label="Why Partner With Us" title="What You Can Count On" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
            <FeatureCard icon={Truck} title="Reliable Weekly Supply" desc="Scheduled deliveries you can plan around. We notify you in advance of any batch delays." />
            <FeatureCard icon={Check} title="Consistent Quality" desc="Every delivery meets the same grade standard. We reject before we dispatch." />
            <FeatureCard icon={Building2} title="Flexible Payment Terms" desc="Standard 7-day invoicing for new partners, 30-day terms available for established accounts." />
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="section bg-white">
        <div className="container-max max-w-2xl">
          <SectionHeader label="Get in Touch" title="Send a Bulk Inquiry" subtitle="Fill in the form below and our partnerships team will respond within 24 hours." center />

          {sent ? (
            <div className="card p-10 text-center reveal">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-display text-2xl font-bold text-farm-dark mb-2">Inquiry Received!</h3>
              <p className="text-farm-dark/60">We'll be in touch within 24 hours. Thank you for your interest in partnering with Darajat Farms.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5 reveal">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Kofi Mensah' },
                  { id: 'company', label: 'Company / Business', type: 'text', placeholder: 'Acme Foods Ltd' },
                  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'kofi@company.com' },
                  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+233 20 000 0000' },
                ].map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-farm-dark mb-1.5">{field.label}</label>
                    <input
                      required
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.id]}
                      onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-farm-dark mb-1.5">Business Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition bg-white"
                  >
                    <option value="">Select type…</option>
                    {['Restaurant / Hotel', 'Supermarket / Retailer', 'Distributor', 'Institution / Caterer', 'Other'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-farm-dark mb-1.5">Estimated Weekly Volume</label>
                  <select
                    value={form.volume}
                    onChange={e => setForm(f => ({ ...f, volume: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition bg-white"
                  >
                    <option value="">Select range…</option>
                    {['< 50 trays', '50–199 trays', '200–499 trays', '500+ trays', '100–500 broilers', '500+ broilers'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-farm-dark mb-1.5">Additional Notes</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your supply needs, delivery location, etc."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                <Send size={15} /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
