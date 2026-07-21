import React from 'react';
import { motion } from 'framer-motion';

export default function BlurText({ children, className = '', delay = 0, duration = 0.8 }) {
  if (typeof children !== 'string') return <span className={className}>{children}</span>;

  const words = children.split(' ');

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
          whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: duration,
            ease: 'easeOut',
            delay: delay + i * 0.05,
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
