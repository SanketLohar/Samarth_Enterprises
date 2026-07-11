import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Shield, Award } from 'lucide-react'
import { companyInfo } from '../../data/categories'

const quickLinks = [
  { to: '/products', label: 'Products Catalog' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact & Support' },
  { to: '/admin', label: 'Partner Portal' },
]

const customerLinks = [
  { to: '/contact', label: 'Request a Quote' },
  { to: `/products?category=${encodeURIComponent('Ro purifiers')}`, label: 'Residential RO' },
  { to: `/products?category=${encodeURIComponent('UV purifiers')}`, label: 'UV Purifiers' },
  { to: `/products?category=${encodeURIComponent('autosoft')}`, label: 'Water Softeners' },
  { to: `/products?category=${encodeURIComponent('industrial water treatment')}`, label: 'Industrial Solutions' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto section-padding !py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, label: 'ISO Certified', sub: 'Quality Assured' },
            { icon: Award, label: '15+ Years', sub: 'Industry Experience' },
            { icon: Phone, label: 'Free Consultation', sub: 'Expert Guidance' },
            { icon: MapPin, label: 'Pan-Gujarat', sub: 'Service Network' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-cyan/15 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-cyan" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-white/50 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto section-padding grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        <div>
          <div className="bg-white p-4 rounded-xl inline-flex mb-6">
            <img
              src="/images/company_logo.png"
              alt={companyInfo.name}
              className="h-10 w-auto object-contain"
              onError={(e) => { e.target.onerror = null; e.target.src = '/images/company_logo.png' }}
            />
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Leading distributor and dealer of advanced water purification, softening, and industrial treatment systems across Gujarat since {companyInfo.established}.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-wider uppercase mb-5 text-brand-cyan">Quick Links</h4>
          <ul className="space-y-2.5">
            {quickLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-white/60 hover:text-white text-sm transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-wider uppercase mb-5 text-brand-cyan">Solutions</h4>
          <ul className="space-y-2.5">
            {customerLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-white/60 hover:text-white text-sm transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-wider uppercase mb-5 text-brand-cyan">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
              <span>{companyInfo.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-4 h-4 text-brand-cyan shrink-0" />
              <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`} className="hover:text-white transition">
                {companyInfo.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="w-4 h-4 text-brand-cyan shrink-0" />
              <a href={`mailto:${companyInfo.email}`} className="hover:text-white transition">
                {companyInfo.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>{companyInfo.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-xs">Secure Payments</span>
            <div className="flex gap-2">
              {['UPI', 'NEFT', 'COD'].map((m) => (
                <span
                  key={m}
                  className="px-2 py-1 rounded bg-white/5 text-white/50 text-[10px] font-semibold tracking-wide"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
