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
    <section className="relative w-full bg-slate-950 text-white pt-20 sm:pt-24 md:pt-0">
      {/* Mobile Video Container Wrapper */}
      <div className="relative w-full min-h-[480px] h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        
        {/* ── Full-bleed background video ── */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none z-0"
        >
          <source src="/images/animated_video.mp4" type="video/mp4" />
        </video>

        {/* ── Gradient Dark Overlay for Text Readability ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30 z-[1]" />
        {/* Desktop Brand Overlay (Left fade) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent hidden md:block pointer-events-none" />

        {/* ── Content Overlay ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col justify-center h-full pt-4 pb-8">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 32 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 sm:p-6 md:p-0 rounded-2xl bg-slate-900/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none w-full"
              >
                {/* Mobile Tag Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium bg-cyan-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    {slides[current].eyebrow}
                  </span>
                </div>

                {/* Responsive Headline */}
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight max-w-2xl drop-shadow-lg">
                  <SplitText>{slides[current].title}</SplitText>
                </h1>

                {/* Description - Brief on Mobile */}
                <div className="mt-2 text-xs sm:text-base text-slate-300 max-w-lg leading-relaxed line-clamp-3 md:line-clamp-none drop-shadow">
                  <p>{slides[current].subtitle}</p>
                </div>

                {/* CTA Buttons */}
                <div className="mt-5 flex items-center gap-3">
                  <Link to={slides[current].link}>
                    <button className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20">
                      {slides[current].cta} &rarr;
                    </button>
                  </Link>
                  <Link to="/contact">
                    <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-medium text-xs sm:text-sm border border-white/20 transition-all">
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
