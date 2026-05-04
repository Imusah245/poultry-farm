// ─── PageHero ────────────────────────────────────────────────────────────────
export function PageHero({ badge, title, subtitle, cta, image, children }) {
  return (
    <section className="relative min-h-[55vh] flex items-end overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: image ? `url(${image})` : undefined, backgroundColor: image ? undefined : '#2D6A4F' }}
      />
      <div className="hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 container-max section pt-36 pb-16 text-white">
        {badge && <p className="section-label !text-farm-yellow-light mb-3">{badge}</p>}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight mb-4 max-w-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/80 text-lg max-w-xl leading-relaxed mb-6">{subtitle}</p>
        )}
        {cta && <div className="flex flex-wrap gap-3">{cta}</div>}
        {children}
      </div>

      {/* Decorative bottom curve */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 720 60 0 20Z" fill="#FAFAF5" />
        </svg>
      </div>
    </section>
  )
}

// ─── SectionHeader ───────────────────────────────────────────────────────────
export function SectionHeader({ label, title, subtitle, center = false }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {label && <p className="section-label">{label}</p>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-farm-dark mb-3">{title}</h2>
      {subtitle && (
        <p className={`text-farm-dark/60 leading-relaxed ${center ? 'max-w-xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

// ─── StatCard ────────────────────────────────────────────────────────────────
export function StatCard({ icon, value, label, suffix = '', color = 'green' }) {
  const Icon = icon
  const colors = {
    green: 'bg-farm-green-pale text-farm-green',
    yellow: 'bg-farm-yellow-pale text-farm-yellow',
    earth: 'bg-amber-50 text-amber-700',
  }
  return (
    <div className="stat-card group hover:-translate-y-1 transition-transform duration-300">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mx-auto mb-3`}>
        <Icon size={22} />
      </div>
      <p className="font-display text-3xl font-bold text-farm-dark mb-1">
        {value}<span className="text-farm-green text-xl">{suffix}</span>
      </p>
      <p className="text-farm-dark/60 text-sm font-medium">{label}</p>
    </div>
  )
}

// ─── ProcessFlow ─────────────────────────────────────────────────────────────
export function ProcessFlow({ steps }) {
  return (
    <div className="relative">
      {/* Connector line (desktop) */}
      <div className="hidden md:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-gradient-to-r from-farm-green-pale via-farm-green to-farm-green-pale" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={i} className="process-step relative z-10">
              <div className="process-icon mb-2">
                <Icon size={26} />
              </div>
              <div className="w-6 h-6 rounded-full bg-farm-green text-white text-xs font-bold flex items-center justify-center mb-2">
                {i + 1}
              </div>
              <h4 className="font-semibold text-farm-dark text-sm">{step.title}</h4>
              <p className="text-farm-dark/55 text-xs leading-relaxed mt-1">{step.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── FeatureCard ─────────────────────────────────────────────────────────────
export function FeatureCard({ icon, title, desc, accent = false }) {
  const Icon = icon
  return (
    <div className={`card p-6 hover:-translate-y-1 transition-transform duration-300
      ${accent ? 'border-farm-yellow/30 bg-gradient-to-br from-white to-farm-yellow-pale/30' : ''}`}>
      <div className="w-11 h-11 rounded-xl bg-farm-green-pale flex items-center justify-center text-farm-green mb-4">
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-farm-dark mb-2">{title}</h3>
      <p className="text-farm-dark/60 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

// ─── TestimonialCard ─────────────────────────────────────────────────────────
export function TestimonialCard({ quote, author, role, initials }) {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="w-4 h-4 text-farm-yellow fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-farm-dark/70 text-sm leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-9 h-9 rounded-full bg-farm-green text-white font-bold text-sm flex items-center justify-center">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-farm-dark text-sm">{author}</p>
          <p className="text-farm-dark/50 text-xs">{role}</p>
        </div>
      </div>
    </div>
  )
}

// ─── CTABanner ───────────────────────────────────────────────────────────────
export function CTABanner({ title, subtitle, primaryLabel, primaryTo, secondaryLabel, secondaryTo }) {
  return (
    <section className="section">
      <div className="container-max">
        <div className="rounded-3xl bg-gradient-to-br from-farm-green to-farm-green-light p-10 md:p-14 text-center text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5" />

          <p className="section-label !text-farm-yellow-light mb-3">{subtitle}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 relative z-10">{title}</h2>
          <div className="flex flex-wrap gap-4 justify-center relative z-10">
            <a href={primaryTo} className="btn-yellow">{primaryLabel}</a>
            {secondaryLabel && (
              <a href={secondaryTo} className="btn-secondary-light">{secondaryLabel}</a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ProductCard ─────────────────────────────────────────────────────────────
export function ProductCard({ emoji, title, desc, badge, to }) {
  return (
    <a href={to} className="card p-6 flex flex-col gap-3 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer">
      <span className="text-4xl">{emoji}</span>
      {badge && <span className="badge w-fit">{badge}</span>}
      <h3 className="font-display font-bold text-xl text-farm-dark group-hover:text-farm-green transition-colors">{title}</h3>
      <p className="text-farm-dark/60 text-sm leading-relaxed">{desc}</p>
      <span className="text-farm-green font-semibold text-sm group-hover:underline">Learn more →</span>
    </a>
  )
}
