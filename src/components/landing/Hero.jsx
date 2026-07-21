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
    <section className="relative w-full min-h-[90vh] md:min-h-screen overflow-hidden flex items-center justify-center bg-slate-950 bg-[url('/images/banner.png')] bg-cover bg-center">

      {/* ── Full-bleed background video ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
      >
        <source src="/images/animated_video.mp4" type="video/mp4" />
      </video>

      {/* ── Mobile Darkness Overlay (For Contrast & Readability) ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-900/40 z-[1]" />
      
      {/* ── Desktop Brand Overlay (Left fade) ── */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent hidden md:block" />

      {/* ── Content layer ── */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center md:text-left max-w-5xl mx-auto w-full">
        <div className="max-w-2xl mx-auto md:mx-0">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow tag */}
              <span className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs md:text-sm font-bold tracking-wider uppercase mb-6 backdrop-blur-sm border border-cyan-500/30">
                <Droplets className="w-3.5 h-3.5" />
                {slides[current].eyebrow}
              </span>

              {/* Main heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
                <SplitText>{slides[current].title}</SplitText>
              </h1>

              {/* Subheading */}
              <div className="text-sm sm:text-base md:text-lg text-slate-200 mt-4 max-w-xl mx-auto md:mx-0 drop-shadow">
                <p>{slides[current].subtitle}</p>
                <div className="text-cyan-50 font-semibold mt-2 md:text-xl flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  Serving <RotatingText texts={['Domestic', 'Commercial', 'Industrial', 'Institutional']} className="text-cyan-400" /> needs.
                </div>
              </div>

              {/* CTA buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start w-full sm:w-auto">
                <Link to={slides[current].link} className="w-full sm:w-auto">
                  <StarBorder color="#00e5ff" speed="4s" className="rounded-xl overflow-hidden w-full">
                    <button className="w-full px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center">
                      {slides[current].cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </StarBorder>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <button className="w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-sm border border-white/20 transition-all flex items-center justify-center">
                    Enquire Now
                  </button>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 border-t border-white/10 pt-8">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs md:text-sm text-slate-300 font-medium">
                    <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          <div className="flex justify-center md:justify-start gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-10 bg-cyan-400' : 'w-6 bg-white/20 hover:bg-white/40'
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
