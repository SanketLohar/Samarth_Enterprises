import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets } from 'lucide-react'

export default function RouteTransitionOverlay() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevPath = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname
      setIsTransitioning(true)
      
      // Let the overlay animate in, then unmount it to reveal the new page
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 1500) // 1.5 seconds maximum timeout
      
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          className="fixed inset-0 z-[9000] flex flex-col items-center justify-center bg-brand-deep overflow-hidden pointer-events-none"
        >
          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo with clip-path reveal (CSS class from animations_codes.txt) */}
            <div className="animate-splash-reveal flex items-center justify-center bg-white/5 p-8 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
              <img
                src="/images/company_logo.png"
                alt="Loading..."
                className="h-20 w-auto animate-splash-pulse"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/images/company_logo.png' // Fallback handled globally if needed
                }}
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 flex gap-1.5 items-center justify-center text-brand-cyan"
            >
              <Droplets className="w-4 h-4 animate-bounce" />
              <span className="text-sm font-semibold tracking-widest uppercase">Loading</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
