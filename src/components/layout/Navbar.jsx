import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Phone, ChevronDown, ArrowRight, Droplets, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'

import { companyInfo } from '../../data/categories'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About us' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { categories, visibleProducts, isAuthenticated, isTechnician } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isTechnician) {
      navigate('/helper/dashboard');
    } else {
      navigate('/admin');
    }
  };

  const primaryPhone = companyInfo.phone.split(',')[0].trim()

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      {/* Top utility bar */}
      <div className="bg-brand-deep text-white/90 text-xs hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <span>Authorized Distributor — Advanced Water Purification Systems</span>
          <a href={`tel:${primaryPhone.replace(/\s/g, '').replace('+', '')}`} className="flex items-center gap-1.5 hover:text-brand-cyan transition">
            <Phone className="w-3 h-3" />
            {primaryPhone}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`transition-all duration-300 border-b ${scrolled ? 'bg-white shadow-md border-gray-200' : 'glass border-gray-100/80 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 lg:h-20">
            {/* Logo — scales slightly on scroll */}
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/images/company_logo.png"
                alt="Samarth Enterprises"
                className={`w-auto transition-all duration-300 ${scrolled ? 'h-9' : 'h-11 lg:h-13'}`}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/images/company_logo.png'
                }}
              />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label }) =>
                label === 'Products' ? (
                  <div
                    key={to}
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                    className="h-full flex items-center"
                  >
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive || productsOpen ? 'text-brand-cyan bg-brand-light' : 'text-brand-dark hover:text-brand-cyan'
                        }`
                      }
                    >
                      Products
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} />
                    </NavLink>
                  </div>
                ) : (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'text-brand-cyan bg-brand-light' : 'text-brand-dark hover:text-brand-cyan'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                )
              )}
              <button
                onClick={handleProfileClick}
                className="ml-2 p-2 rounded-full text-brand-dark bg-gray-50 border border-gray-200 hover:text-brand-cyan hover:bg-brand-light transition"
                title="Secure Portal"
              >
                <User className="w-4 h-4" />
              </button>
            </div>

            {/* CTA buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to="/contact">
                <Button variant="gold" size="sm">
                  Request a Quote
                </Button>
              </Link>
            </div>

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 text-brand-dark"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mega Dropdown Menu for Products */}
          <AnimatePresence>
            {productsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
                className="absolute top-full left-0 w-full glass border-b border-gray-100 shadow-xl hidden lg:block"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark">Our Product Range</h3>
                      <p className="text-sm text-brand-muted mt-1">Explore our industry-leading purification systems.</p>
                    </div>
                    <Link
                      to="/products"
                      className="text-sm font-semibold text-brand-cyan hover:text-brand-deep transition flex items-center gap-1"
                      onClick={() => setProductsOpen(false)}
                    >
                      View All Products <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categories.slice(0, 10).map((cat) => {
                      const sampleProduct = visibleProducts.find((p) => p.category === cat.id)
                      return (
                        <Link
                          key={cat.id}
                          to={`/products?category=${encodeURIComponent(cat.id)}`}
                          onClick={() => setProductsOpen(false)}
                          className="group block bg-white rounded-xl p-4 border border-gray-100 hover:border-brand-cyan/30 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="aspect-video bg-brand-light rounded-lg overflow-hidden mb-4 flex items-center justify-center p-2">
                            {sampleProduct ? (
                              <img
                                src={sampleProduct.imageFallbacks[0]}
                                alt={cat.shortLabel}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/images/company_logo.png'
                                }}
                              />
                            ) : (
                              <Droplets className="w-8 h-8 text-brand-cyan/30" />
                            )}
                          </div>
                          <h4 className="font-semibold text-brand-dark group-hover:text-brand-cyan transition-colors line-clamp-1">
                            {cat.shortLabel}
                          </h4>
                          <p className="text-xs text-brand-muted mt-1">
                            {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                          </p>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium ${
                      location.pathname === to ? 'bg-brand-light text-brand-cyan' : 'text-brand-dark'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {/* Mobile categories */}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <p className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Categories</p>
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.id)}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 text-sm text-brand-muted hover:text-brand-cyan"
                    >
                      {cat.shortLabel}
                    </Link>
                  ))}
                </div>
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="block pt-2">
                  <Button variant="gold" size="md" className="w-full">
                    Request a Quote
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    handleProfileClick()
                  }}
                  className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 rounded-lg border border-brand-cyan/40 bg-brand-light text-brand-cyan font-bold transition"
                >
                  <User className="w-5 h-5" />
                  {isAuthenticated ? 'My Account' : 'Staff Login'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
