import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react'
import { PageHero, SectionHeader } from '../components/ui'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { COMPANY } from '../data'

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'Call Us',
    value: COMPANY.phone,
    href: `tel:${COMPANY.phone.replace(/\s/g, '')}`,
    note: 'Mon–Sun, 7am – 6pm',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: COMPANY.phone,
    href: `https://wa.me/233552866857`,
    note: 'Fastest response',
  },
  {
    icon: Mail,
    label: 'Email',
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    note: 'Reply within 24 hours',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: COMPANY.address,
    href: 'https://maps.google.com/?q=Accra,Ghana',
    note: 'Farm visits by appointment',
  },
]

const HOURS = [
  { day: 'Monday – Friday', hours: '7:00 AM – 6:00 PM' },
  { day: 'Saturday', hours: '7:00 AM – 6:00 PM' },
  { day: 'Sunday', hours: '7:00 AM – 6:00 PM' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const ref = useScrollReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div ref={ref}>
      <PageHero
        badge="Contact Us"
        title="We're Here to Help"
        subtitle="Place an order, ask about our products, or book a farm visit. Our team responds quickly."
      />

      <section className="section">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left: contact info */}
            <div className="space-y-8">
              <div className="reveal">
                <SectionHeader label="Get in Touch" title="Reach Us Directly" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONTACT_ITEMS.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="card p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-farm-green-pale text-farm-green flex items-center justify-center flex-shrink-0 group-hover:bg-farm-green group-hover:text-white transition-colors">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-farm-dark/40 uppercase tracking-wider mb-0.5">{item.label}</p>
                        <p className="font-semibold text-farm-dark text-sm group-hover:text-farm-green transition-colors">{item.value}</p>
                        <p className="text-farm-dark/40 text-xs mt-0.5">{item.note}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="card p-6 reveal">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-farm-green" />
                  <h3 className="font-semibold text-farm-dark">Business Hours</h3>
                </div>
                <ul className="space-y-2">
                  {HOURS.map((h, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-farm-dark/60">{h.day}</span>
                      <span className="font-medium text-farm-dark">{h.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map embed */}
              <div className="card overflow-hidden h-56 reveal">
                <iframe
                  title="Darajat Farms Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254682.35084014027!2d-0.3536258!3d5.5912702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2ad7a4d%3A0xbed14f2d4c9c9955!2sAccra%2C%20Ghana!5e0!3m2!1sen!2s!4v1713000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: form */}
            <div className="reveal">
              {sent ? (
                <div className="card p-12 text-center flex flex-col items-center justify-center h-full">
                  <CheckCircle size={48} className="text-farm-green mb-4" />
                  <h3 className="font-display text-2xl font-bold text-farm-dark mb-2">Message Sent!</h3>
                  <p className="text-farm-dark/60 leading-relaxed max-w-sm">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                    className="btn-secondary mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card p-8">
                  <h2 className="font-display text-2xl font-bold text-farm-dark mb-1">Send a Message</h2>
                  <p className="text-farm-dark/50 text-sm mb-6">Fill in the form below and we'll be in touch shortly.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-farm-dark mb-1.5">Full Name *</label>
                        <input required type="text" placeholder="Abena Osei" value={form.name} onChange={update('name')}
                          className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-farm-dark mb-1.5">Phone Number</label>
                        <input type="tel" placeholder="+233240000000" value={form.phone} onChange={update('phone')}
                          className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-farm-dark mb-1.5">Email Address *</label>
                      <input required type="email" placeholder="abena@example.com" value={form.email} onChange={update('email')}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-farm-dark mb-1.5">Subject *</label>
                      <select required value={form.subject} onChange={update('subject')}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition bg-white">
                        <option value="">Select a subject…</option>
                        {['Order Eggs', 'Order Broilers', 'Wholesale Inquiry', 'Book a Farm Visit', 'Partnership Proposal', 'General Question'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-farm-dark mb-1.5">Message *</label>
                      <textarea required rows={5} placeholder="Tell us what you need…" value={form.message} onChange={update('message')}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-green-pale text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green transition resize-none" />
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center">
                      <Send size={15} /> Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
