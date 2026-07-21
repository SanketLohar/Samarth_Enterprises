import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'

const features = ['R.O. Systems', 'W.T.P.', 'E.T.P.', 'S.T.P.']

const QUOTE = "Our commitment goes beyond standard filtration. We design, engineer, and maintain robust treatment frameworks to secure water quality, optimize industrial processing lifecycle demands, and ensure absolute consumer health."

// Typewriter hook — starts typing only when `start` becomes true
function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) return
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timer)
  }, [displayed, started, text, speed])

  return { displayed, start: () => setStarted(true) }
}

export default function CorporateAbout() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: false, amount: 0.15 })
  const { displayed: typedQuote, start: startTyping } = useTypewriter(QUOTE, 16)

  // Kick off typewriter once the section enters view
  useEffect(() => {
    if (inView) startTyping()
  }, [inView])

  return (
    <section
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f0f9ff 0%, #e8f4fb 40%, #f8fafc 100%)' }}
    >
      {/* Radial ambient glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,116,144,0.10) 0%, transparent 70%)',
      }} />
      {/* Dot-grid mesh */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(to right,#80808010 1px,transparent 1px),linear-gradient(to bottom,#80808010 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Elevated glassmorphic logo focus card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Tilted accent slab */}
            <div aria-hidden className="absolute inset-0 rounded-3xl transform -rotate-2 scale-105"
              style={{ background: 'linear-gradient(135deg,rgba(14,116,144,0.12),rgba(186,230,253,0.30))', zIndex: 0 }} />

            {/* Outer focus card — pure glassmorphism, NO inner white box */}
            <div
              className="relative z-10 rounded-3xl p-10 flex justify-center items-center transition-all duration-300 hover:shadow-2xl"
              style={{
                background: 'rgba(255,255,255,0.70)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(148,163,184,0.50)',
                boxShadow: '0 20px 50px rgba(8,112,184,0.08)',
                minHeight: '360px',
              }}
            >
              <img
                src="/images/company_logo.png"
                alt="Samarth Enterprises"
                className="max-h-52 w-auto object-contain mix-blend-multiply border-none shadow-none bg-transparent"
                style={{ mixBlendMode: 'multiply', backgroundColor: 'transparent' }}
                onError={(e) => { e.target.onerror = null }}
              />
            </div>
          </motion.div>

          {/* ── Right: Text content ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          >
            {/* SectionHeader uses useInView internally — heading blur reveal fires on scroll */}
            <SectionHeader
              eyebrow="Corporate Overview"
              title="Pioneering Pure Water Solutions"
              subtitle="Samarth Enterprises is a premier Water Treatment Consultant and service provider specializing in end-to-end water management architectures across Domestic, Commercial, and Industrial sectors."
              align="left"
            />

            <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  <span className="text-brand-dark font-medium leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            {/* Glassmorphic dark quote card with typewriter effect */}
            <div
              className="relative z-10 mt-8 rounded-2xl p-8 shadow-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
                border: '1px solid rgba(51,65,85,0.8)',
              }}
            >
              {/* Subtle inner glow */}
              <div aria-hidden style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg,transparent,rgba(34,211,238,0.4),transparent)',
              }} />

              <p className="text-lg md:text-xl font-serif italic text-cyan-50 leading-relaxed tracking-wide min-h-[6rem]">
                "{typedQuote}
                {typedQuote.length < QUOTE.length && (
                  <span className="animate-pulse text-cyan-400">|</span>
                )}"
              </p>
              <span className="mt-4 block text-xs font-semibold tracking-widest uppercase text-cyan-300 font-sans">
                — Mr. Satish Panhalkar, Water Treatment Consultant
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
