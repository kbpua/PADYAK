import { Star } from 'lucide-react'

export function RatingStars({ value, size = 14 }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="inline-flex items-center gap-0.5 text-accent" aria-label={`${value} stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half)
        return (
          <Star
            key={i}
            size={size}
            className={filled ? 'fill-accent text-accent' : 'text-charcoal/20'}
            strokeWidth={1.5}
          />
        )
      })}
    </span>
  )
}
