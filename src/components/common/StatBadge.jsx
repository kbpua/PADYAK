export function StatBadge({ icon: Icon, label, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-2xl bg-charcoal/80 px-3 py-2 text-center shadow-inner ${className}`}
    >
      {Icon && <Icon className="h-5 w-5 text-accent" strokeWidth={2} />}
      <span className="text-[11px] font-medium leading-tight text-white/90">{label}</span>
    </div>
  )
}
