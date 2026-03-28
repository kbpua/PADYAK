import { Star } from 'lucide-react'

export function RatingStarsInput({ value, onChange, size = 22 }) {
  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="rounded-md p-0.5 text-accent transition hover:bg-accent/10 active:scale-95"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={on ? 'fill-accent text-accent' : 'text-charcoal/25'}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}

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
