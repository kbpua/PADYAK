export function PillBadge({ children, className = '', variant = 'neutral' }) {
  const variants = {
    neutral: 'bg-charcoal/10 text-charcoal',
    primary: 'bg-primary/15 text-primary',
    accent: 'bg-accent/15 text-accent',
    teal: 'bg-teal/15 text-teal',
    dark: 'bg-white/10 text-white',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant] ?? variants.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
