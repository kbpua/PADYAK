import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const statusLabel = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  active: 'Active',
  completed: 'Completed',
}

export function BookingContextBanner({ conversation }) {
  const { bike, booking } = conversation
  const st = statusLabel[booking.status] || booking.status

  return (
    <Link
      to={`/bike/${bike.id}`}
      className="mx-3 mt-2 flex items-center gap-3 rounded-xl border border-charcoal/10 bg-surface px-3 py-2.5 shadow-sm ring-0 transition hover:bg-charcoal/[0.03] md:mx-4 md:py-3 lg:mx-6"
      style={{ borderLeftWidth: 4, borderLeftColor: '#22c55e' }}
    >
      <span className="text-xl" aria-hidden>
        🚲
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-sm font-bold text-charcoal">
          {bike.name} · {booking.date}
        </p>
        <p className="truncate text-xs text-charcoal/55">
          {booking.time} ·{' '}
          <span className="font-semibold text-primary">{st}</span> ✅
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-charcoal/30" />
    </Link>
  )
}
