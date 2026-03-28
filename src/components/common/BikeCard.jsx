import { Link } from 'react-router-dom'
import { Bike } from 'lucide-react'
import { RatingStars } from './RatingStars'

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function BikeCard({ bike }) {
  return (
    <Link
      to={`/bike/${bike.id}`}
      className="group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-charcoal/10 transition hover:shadow-md active:scale-[0.99] sm:w-[220px] md:w-[240px] lg:w-full lg:max-w-none lg:rounded-2xl"
    >
      <div
        className="relative flex h-[104px] items-center justify-center sm:h-[112px] lg:h-[100px] xl:h-[108px]"
        style={{ backgroundColor: bike.color }}
      >
        <Bike className="h-11 w-11 text-white drop-shadow-sm sm:h-12 sm:w-12 lg:h-10 lg:w-10" strokeWidth={1.5} />
        <span className="absolute bottom-2 left-2 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-charcoal shadow-sm ring-1 ring-black/5">
          {bike.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2.5 lg:gap-1.5 lg:p-2.5">
        <div>
          <h3 className="font-heading text-[13px] font-bold leading-snug text-charcoal lg:text-sm">{bike.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-charcoal/5 text-[9px] font-bold text-charcoal lg:h-7 lg:w-7 lg:text-[10px]">
              {initials(bike.owner.name)}
            </span>
            <span className="truncate text-[11px] text-charcoal/65 lg:text-xs">{bike.owner.name}</span>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between text-[11px] lg:text-xs">
          <span className="text-charcoal/55">{bike.location.distance}</span>
          <span className="font-heading font-bold text-primary">₱{bike.pricePerHour}/hr</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RatingStars value={bike.rating} size={11} />
          <span className="text-[11px] font-semibold text-charcoal/75 lg:text-xs">{bike.rating}</span>
        </div>
      </div>
    </Link>
  )
}
