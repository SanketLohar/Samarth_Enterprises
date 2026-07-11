import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'

/**
 * SplashLoader — Full-screen branded overlay shown on every page load & refresh.
 * Uses the clip-path circle reveal animation defined in animations_codes.txt:
 *   @keyframes splash-reveal { 0% clip-path:circle(0%) → 100% clip-path:circle(150%) }
 * Then fades out via the splash-fade-out keyframe when appReady = true.
 */
export default function SplashLoader() {
  const { showSplash, appReady } = useApp()
  const [logoLoaded, setLogoLoaded] = useState(false)

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: appReady ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-deep overflow-hidden"
          aria-label="Loading Samarth Enterprises"
          role="status"
        >
          {/* Background water ripple rings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-brand-cyan/10 animate-ripple" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-brand-cyan/15 animate-ripple delay-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-brand-cyan/20 animate-ripple delay-200" />
            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(50,140,193,0.12)_0%,transparent_70%)]" />
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo with clip-path reveal (CSS class from animations_codes.txt) */}
            <div className="animate-splash-reveal flex items-center justify-center">
              <img
                src="/images/company_logo.png"
                alt="Samarth Enterprises"
                className="h-24 sm:h-28 lg:h-32 w-auto animate-splash-pulse drop-shadow-[0_0_24px_rgba(50,140,193,0.4)]"
                onLoad={() => setLogoLoaded(true)}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/images/company_logo.png'
                }}
              />
            </div>

            {/* Brand name & tagline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-col items-center gap-2"
            >
              <h1 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
                Samarth Enterprises
              </h1>
              <p className="text-brand-cyan/80 text-xs sm:text-sm tracking-[0.3em] uppercase font-medium">
                Pure Water · Trusted Solutions
              </p>
            </motion.div>

            {/* Animated loading dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-brand-cyan"
                  animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22 }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom certification strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-8 flex items-center gap-6"
          >
            {['ISO 9001:2015', 'NSF Certified', 'BIS Compliant'].map((cert) => (
              <span key={cert} className="text-white/25 text-[10px] tracking-widest uppercase font-medium">
                {cert}
              </span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
