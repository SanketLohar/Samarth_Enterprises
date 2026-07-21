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
    eyebrow: 'RO + UV + UF',
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

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">
      {/* Mobile Video Container Wrapper */}
      <div className="relative w-full h-[320px] sm:h-[400px] md:h-screen md:min-h-[500px] flex flex-col md:flex-row items-center justify-center overflow-hidden">
        
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

        {/* ── Gradient Dark Overlay for Text Readability ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-[1]" />
        {/* Desktop Brand Overlay (Left fade) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent hidden md:block" />

        {/* ── Content Overlay ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end md:justify-center h-full pb-6 md:pb-0">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 32 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Mobile Tag Pills */}
                <div className="flex flex-wrap gap-2 mb-2 md:mb-4">
                  <span className="text-[10px] sm:text-xs md:text-sm bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                    <Droplets className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    {slides[current].eyebrow}
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm bg-slate-900/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 hidden sm:flex">
                    <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    100% Pure & Safe
                  </span>
                </div>

                {/* Responsive Headline */}
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-snug max-w-2xl drop-shadow-lg">
                  <SplitText>{slides[current].title}</SplitText>
                </h1>

                {/* Description - Brief on Mobile */}
                <div className="mt-1 sm:mt-3 text-xs sm:text-sm md:text-lg text-slate-200 max-w-xl line-clamp-2 md:line-clamp-none drop-shadow">
                  <p>{slides[current].subtitle}</p>
                  <div className="text-cyan-50 font-semibold mt-1 md:mt-2 md:text-xl items-center justify-start gap-2 flex-wrap hidden md:flex">
                    Serving <RotatingText texts={['Domestic', 'Commercial', 'Industrial', 'Institutional']} className="text-cyan-400" /> needs.
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-4 flex items-center gap-3">
                  <Link to={slides[current].link}>
                    <button className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5">
                      {slides[current].cta}
                      <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </Link>
                  <Link to="/contact">
                    <button className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-medium text-xs sm:text-sm border border-white/20 transition-all">
                      Enquire Now
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide dots */}
            <div className="flex justify-start gap-2 mt-4 md:mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-cyan-400' : 'w-4 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
