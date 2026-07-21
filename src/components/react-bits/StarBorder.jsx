import React from 'react';

export default function StarBorder({ children, className = '', color = 'cyan', speed = '5s', ...props }) {
  // Using Tailwind to simulate the StarBorder effect.
  // The effect typically works by having a rotating gradient background behind a slightly smaller container.
  
  return (
    <div className={`relative inline-block overflow-hidden rounded-full p-[1px] group ${className}`} {...props}>
      <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite]" style={{
          background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${color} 50%, transparent 100%)`,
          animationDuration: speed
      }} />
      <div className="relative bg-brand-deep rounded-full h-full w-full flex items-center justify-center transition-colors">
        {children}
      </div>
    </div>
  );
}
