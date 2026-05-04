import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Egg, ChevronDown } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  {
    label: 'Products',
    children: [
      { label: '🥚 Egg Production', to: '/eggs' },
      { label: '🍗 Broiler Production', to: '/broilers' },
    ],
  },
  { label: 'Our Farm', to: '/farm' },
  { label: 'Technology', to: '/technology' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Blog', to: '/blog' },
  { label: 'Partnerships', to: '/partnerships' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
        }`}
    >
      <div className="container-max flex items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <span className="w-9 h-9 rounded-xl bg-farm-green flex items-center justify-center shadow-card group-hover:bg-farm-green-light transition-colors">
            <Egg size={18} className="text-white" />
          </span>
          <div>
            <span className={`font-display font-bold text-lg leading-none block transition-colors
              ${scrolled ? 'text-farm-dark' : 'text-white'}`}>
              Darajat
            </span>
            <span className={`text-[10px] font-semibold tracking-widest uppercase leading-none transition-colors
              ${scrolled ? 'text-farm-yellow' : 'text-farm-yellow-light'}`}>
              Farms
            </span>
          </div>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  className={`nav-link flex items-center gap-1
                    ${scrolled ? '' : '!text-white/90 hover:!text-white'}`}
                  onClick={() => setDropdown(d => !d)}
                  onBlur={() => setTimeout(() => setDropdown(false), 150)}
                >
                  {link.label}
                  <ChevronDown size={14} className={`transition-transform ${dropdown ? 'rotate-180' : ''}`} />
                </button>
                {dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-hover border border-farm-green-pale/50 overflow-hidden animate-fade-in">
                    {link.children.map(child => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className="block px-4 py-3 text-sm font-medium text-farm-dark/70 hover:bg-farm-green-pale hover:text-farm-green transition-colors"
                        onClick={() => setDropdown(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''} ${scrolled ? '' : '!text-white/90 hover:!text-white'}`
                }
              >
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/contact" className="btn-yellow text-xs py-2 px-4">
            Order Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors
            ${scrolled ? 'text-farm-dark hover:bg-farm-green-pale' : 'text-white hover:bg-white/10'}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-farm-green-pale shadow-lg animate-fade-in">
          <nav className="container-max px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-farm-dark/40">
                    {link.label}
                  </p>
                  {link.children.map(child => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${isActive
                          ? 'bg-farm-green-pale text-farm-green'
                          : 'text-farm-dark/70 hover:bg-farm-green-pale/50 hover:text-farm-green'
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-farm-green-pale text-farm-green'
                      : 'text-farm-dark/70 hover:bg-farm-green-pale/50 hover:text-farm-green'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              )
            )}
            <div className="pt-3 border-t border-farm-green-pale mt-2">
              <Link to="/contact" className="btn-yellow w-full justify-center" onClick={() => setOpen(false)}>
                Order Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
