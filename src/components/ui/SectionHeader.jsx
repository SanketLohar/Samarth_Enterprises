import { motion } from 'framer-motion'

export default function SectionHeader({ eyebrow, title, subtitle, align = 'center', light = false }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-12 lg:mb-16 ${alignClass}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-xs font-bold tracking-[0.25em] uppercase mb-3 ${light ? 'text-brand-cyan' : 'text-brand-cyan'}`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight ${light ? 'text-white' : 'text-brand-dark'}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-brand-muted'}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
