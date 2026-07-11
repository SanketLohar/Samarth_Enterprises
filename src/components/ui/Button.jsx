const variants = {
  primary:
    'bg-brand-deep text-white hover:bg-brand-cyan shadow-lg shadow-brand-deep/20 hover:shadow-brand-cyan/25',
  gold: 'bg-brand-gold text-brand-deep hover:bg-brand-gold/90 shadow-lg shadow-brand-gold/20',
  outline:
    'border-2 border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white',
  ghost: 'text-brand-deep hover:bg-brand-light',
  cyan: 'bg-brand-cyan text-white hover:bg-brand-deep',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
