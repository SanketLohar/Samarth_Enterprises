import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Droplets, ShieldCheck, Award, Briefcase } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../ui/Button'

// Hero slides mapped to REAL categories from info.txt
const slides = [
  {
    eyebrow: 'No. 1 Choice in RO Purifiers',
    title: 'Smart RO Water Purifiers',
    subtitle: 'Multi-stage RO + UV + UF + IoT monitoring for India\'s toughest water conditions. Pure water, every time.',
    cta: 'Explore Purifiers',
    link: '/products?category=' + encodeURIComponent('Ro purifiers'),
    category: 'Ro purifiers',
    accent: 'from-brand-deep to-brand-cyan',
  },
  {
    eyebrow: 'Wellness Innovation',
    title: 'Alkaline Water Solutions',
    subtitle: 'Transform ordinary water into antioxidant-rich alkaline water with IonPot ionizers and portable alkaline pens.',
    cta: 'View Alkaline Range',
    link: '/products?category=' + encodeURIComponent('alkaline water solutions'),
    category: 'alkaline water solutions',
    accent: 'from-emerald-700 to-brand-cyan',
  },
  {
    eyebrow: 'Whole-Home Hard Water Care',
    title: 'Automatic Water Softeners',
    subtitle: 'Eliminate hard water scale to protect appliances, improve skin & hair health with advanced automatic softeners.',
    cta: 'Browse Softeners',
    link: '/products?category=' + encodeURIComponent('autosoft'),
    category: 'autosoft',
    accent: 'from-brand-cyan to-brand-deep',
  },
]

const trustItems = [
  { icon: ShieldCheck, label: 'ISO 9001:2015 Certified' },
  { icon: Award, label: 'Authorized Distributor' },
  { icon: Briefcase, label: 'Expert Consultant' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const { visibleProducts } = useApp()

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5500)
    return () => clearInterval(timer)
  }, [])

  // Pick a featured product from the active slide's category
  const categoryProducts = visibleProducts.filter(
    (p) => p.category === slides[current].category && p.featured
  )
  const activeProduct = categoryProducts[0] || visibleProducts.find((p) => p.featured)

  return (
    <section className="relative overflow-hidden bg-brand-deep flex items-center min-h-[85vh] lg:min-h-[80vh] pt-12 pb-24">
      {/* Absolute Background Layer */}
      <AnimatePresence mode="wait">
        {activeProduct && (
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 top-20 lg:top-24 w-full h-full flex justify-end">
              <div className="w-full lg:w-1/2 h-full p-8 lg:p-16">
                <img
                  src={activeProduct.imageFallbacks?.[0] || `/images/${activeProduct.category}/${activeProduct.image}`}
                  alt={activeProduct.name}
                  className="w-full h-full object-contain object-center drop-shadow-2xl"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/images/company_logo.png'
                  }}
                />
              </div>
            </div>
            {/* High-contrast gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent lg:hidden" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-sm border border-brand-cyan/30">
                <Droplets className="w-3.5 h-3.5" />
                {slides[current].eyebrow}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
                {slides[current].title}
              </h1>

              <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-lg">
                {slides[current].subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={slides[current].link}>
                  <Button size="lg" className="bg-brand-cyan hover:bg-brand-light text-brand-deep border-none">
                    {slides[current].cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                    Enquire Now
                  </Button>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-12 flex flex-wrap gap-6 border-t border-white/10 pt-8">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-white/70 font-medium">
                    <Icon className="w-4 h-4 text-brand-cyan shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-10 bg-brand-cyan' : 'w-6 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
