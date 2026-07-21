import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function BlurText({ children, className = '', delay = 0, duration = 0.65 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  if (typeof children !== 'string') return <span className={className}>{children}</span>

  const words = children.split(' ')

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(12px)', opacity: 0, y: 14 }}
          animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : { filter: 'blur(12px)', opacity: 0, y: 14 }}
          transition={{ duration, ease: 'easeOut', delay: delay + i * 0.07 }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
