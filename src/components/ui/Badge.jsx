export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-brand-light text-brand-deep',
    gold: 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30',
    cyan: 'bg-brand-cyan/10 text-brand-cyan',
    new: 'bg-emerald-100 text-emerald-700',
    contacted: 'bg-amber-100 text-amber-700',
    resolved: 'bg-slate-100 text-slate-600',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles[variant] || styles.default} ${className}`}
    >
      {children}
    </span>
  )
}
