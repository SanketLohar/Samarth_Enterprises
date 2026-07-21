import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function BlurWords({ children, inView, delay = 0 }) {
  if (typeof children !== 'string') return <>{children}</>
  const words = children.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(12px)', opacity: 0, y: 14 }}
          animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : { filter: 'blur(12px)', opacity: 0, y: 14 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: delay + i * 0.07 }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </>
  )
}

export default function SectionHeader({ eyebrow, title, subtitle, align = 'center', light = false }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'
  const ref = useRef(null)
  // amount: 0.3 means 30% of the heading must be visible before firing
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className={`mb-12 lg:mb-16 ${alignClass}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="inline-block text-xs font-bold tracking-[0.25em] uppercase mb-3 text-brand-cyan"
        >
          {eyebrow}
        </motion.span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight ${light ? 'text-white' : 'text-brand-dark'}`}
      >
        <BlurWords inView={inView} delay={0.05}>{title}</BlurWords>
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.35 }}
          className={`mt-4 text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-brand-muted'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
