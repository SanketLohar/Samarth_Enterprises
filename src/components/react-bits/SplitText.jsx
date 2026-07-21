import React from 'react';
import { motion } from 'framer-motion';

export default function SplitText({ children, className = '', delay = 0, duration = 0.5 }) {
  if (typeof children !== 'string') return <span className={className}>{children}</span>;

  const words = children.split(' ');

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: duration,
              ease: [0.2, 0.65, 0.3, 0.9],
              delay: delay + i * 0.05,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
