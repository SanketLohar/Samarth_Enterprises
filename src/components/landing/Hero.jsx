import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Droplets, ShieldCheck, Award, Briefcase } from 'lucide-react'
import Button from '../ui/Button'
import SplitText from '../react-bits/SplitText'
import RotatingText from '../react-bits/RotatingText'
import StarBorder from '../react-bits/StarBorder'

const slides = [
  {
    eyebrow: 'No. 1 Choice in RO Purifiers',
    title: 'Smart RO Water Purifiers',
    subtitle: "Multi-stage RO + UV + UF + IoT monitoring for India's toughest water conditions. Pure water, every time.",
    cta: 'Explore Purifiers',
    link: '/products?category=' + encodeURIComponent('Ro purifiers'),
  },
  {
    eyebrow: 'Wellness Innovation',
    title: 'Alkaline Water Solutions',
    subtitle: 'Transform ordinary water into antioxidant-rich alkaline water with IonPot ionizers and portable alkaline pens.',
    cta: 'View Alkaline Range',
    link: '/products?category=' + encodeURIComponent('alkaline water solutions'),
  },
  {
    eyebrow: 'Whole-Home Hard Water Care',
    title: 'Automatic Water Softeners',
    subtitle: 'Eliminate hard water scale to protect appliances, improve skin & hair health with advanced automatic softeners.',
    cta: 'Browse Softeners',
    link: '/products?category=' + encodeURIComponent('autosoft'),
  },
]

const trustItems = [
  { icon: ShieldCheck, label: 'ISO 9001:2015 Certified'  },
  { icon: Award,       label: 'Authorized Distributor'   },
  { icon: Briefcase,   label: 'Proud BNI Member'         },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden flex items-center min-h-[90vh] lg:min-h-screen bg-[#002a4a]">

      {/* ── Full-bleed background video ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/banner.png"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/images/animated_video.mp4" type="video/mp4" />
      </video>

      {/* ── Brand dark overlay (~55% opacity on left, fades right) ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#002a4a]/85 via-[#002a4a]/60 to-[#002a4a]/25" />
      {/* Extra bottom-fade for mobile text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#002a4a]/75 via-transparent to-transparent lg:hidden" />

      {/* ── Content layer ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 lg:py-36">
        <div className="max-w-2xl">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow tag */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-sm border border-brand-cyan/30">
                <Droplets className="w-3.5 h-3.5" />
                {slides[current].eyebrow}
              </span>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                <SplitText>{slides[current].title}</SplitText>
              </h1>

              {/* Subheading */}
              <div className="mt-6 text-lg text-white/80 leading-relaxed max-w-lg drop-shadow">
                <p>{slides[current].subtitle}</p>
                <div className="text-brand-light font-semibold mt-2 text-xl flex items-center gap-2">
                  Serving <RotatingText texts={['Domestic', 'Commercial', 'Industrial', 'Institutional']} className="text-brand-cyan" /> needs.
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={slides[current].link}>
                  <StarBorder color="#00e5ff" speed="4s" className="rounded-xl overflow-hidden">
                    <Button size="lg" className="bg-brand-cyan hover:bg-brand-light text-brand-deep border-none shadow-lg shadow-brand-cyan/30 rounded-xl relative z-10 w-full h-full">
                      {slides[current].cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </StarBorder>
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
