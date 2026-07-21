import { motion } from 'framer-motion'

function BlurWords({ children, delay = 0 }) {
  if (typeof children !== 'string') {
    // If already wrapped (e.g. BlurText passed as JSX), just render it
    return <>{children}</>
  }
  const words = children.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.7,
            ease: 'easeOut',
            delay: delay + i * 0.06,
          }}
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

  return (
    <div className={`mb-12 lg:mb-16 ${alignClass}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`inline-block text-xs font-bold tracking-[0.25em] uppercase mb-3 text-brand-cyan`}
        >
          {eyebrow}
        </motion.span>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight ${light ? 'text-white' : 'text-brand-dark'}`}
      >
        <BlurWords delay={0.1}>{title}</BlurWords>
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className={`mt-4 text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-brand-muted'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
