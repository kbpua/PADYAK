import { Clock } from 'lucide-react'

/**
 * Short note: hourly rate applies as late-return charge.
 * @param {{ pricePerHour: number; variant?: 'card' | 'inline' | 'compact' | 'host'; className?: string }} props
 */
export function LateReturnRateNotice({ pricePerHour, variant = 'card', className = '' }) {
  const rate = Number(pricePerHour)
  if (!Number.isFinite(rate) || rate <= 0) return null

  if (variant === 'host') {
    return (
      <div
        className={`rounded-xl border border-teal-200/70 bg-teal-50/60 px-3.5 py-2.5 text-sm text-teal-950/80 ring-1 ring-teal-100/50 lg:px-4 lg:py-3 ${className}`}
      >
        <span className="font-heading font-bold text-teal-950">Late fee: </span>
        Renters pay <span className="font-mono-data font-bold text-primary">₱{rate}/hr</span> for each
        hour past the agreed return—price it for your hassle.
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <p
        className={`rounded-lg bg-charcoal/[0.04] px-2.5 py-1.5 text-center text-[10px] leading-snug text-charcoal/60 ring-1 ring-charcoal/[0.06] sm:text-[11px] ${className}`}
      >
        Late past your slot:{' '}
        <span className="font-mono-data font-bold text-orange-600">+₱{rate}/hr</span> per hour
      </p>
    )
  }

  if (variant === 'inline') {
    return (
      <div
        className={`flex items-center gap-2.5 rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2.5 ring-1 ring-amber-100/70 ${className}`}
      >
        <Clock className="h-4 w-4 shrink-0 text-amber-700" strokeWidth={2} />
        <p className="text-xs leading-snug text-amber-950/85">
          <span className="font-semibold text-amber-950">Late return: </span>
          <span className="font-mono-data font-bold text-orange-700">₱{rate}/hr</span> per hour after your
          booked return time.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-xl bg-white px-3.5 py-3 shadow-sm ring-1 ring-charcoal/[0.08] lg:px-4 lg:py-3.5 ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
        <Clock className="h-4 w-4" strokeWidth={2} />
      </span>
      <p className="min-w-0 pt-0.5 text-sm leading-snug text-charcoal/75">
        <span className="font-heading font-bold text-charcoal">Late return · </span>
        After your booked return time,{' '}
        <span className="font-mono-data font-bold text-orange-600">₱{rate}/hr</span> applies per extra hour
        (not your day rate).
      </p>
    </div>
  )
}
