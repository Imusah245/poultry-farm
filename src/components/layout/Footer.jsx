import { Link } from 'react-router-dom'
import { Egg, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const LINKS = {
  Products: [
    { label: 'Egg Production', to: '/eggs' },
    { label: 'Broiler Production', to: '/broilers' },
    { label: 'Partnerships', to: '/partnerships' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Farm', to: '/farm' },
    { label: 'Technology', to: '/technology' },
    { label: 'Blog', to: '/blog' },
  ],
  Support: [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-farm-dark text-white">
      <div className="container-max section pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-farm-green flex items-center justify-center">
                <Egg size={18} className="text-white" />
              </span>
              <div>
                <span className="font-display font-bold text-lg leading-none block">Darajat</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-farm-yellow leading-none">Farms</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-5 max-w-xs">
              Delivering farm-fresh eggs and premium broilers with uncompromising quality and biosecurity standards since 2009.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/60">
              <a href="tel:+233552866857" className="flex items-center gap-2 hover:text-farm-yellow transition-colors">
                <Phone size={14} /> +233 552866857, +233 244652431
              </a>
              <a href="mailto:info@Darajatfarms.com" className="flex items-center gap-2 hover:text-farm-yellow transition-colors">
                <Mail size={14} /> info@Darajatfarms.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> Accra, Ghana
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-semibold text-sm tracking-widest uppercase text-farm-yellow mb-4">{heading}</h4>
              <ul className="flex flex-col gap-2">
                {items.map(item => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} Darajat Farms. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-farm-green flex items-center justify-center transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
