import { Link } from 'react-router-dom'
import { ChevronRight, Bike, Clock, Plus } from 'lucide-react'

const cards = [
  {
    to: '/explore',
    title: 'Rent a Bike',
    subtitle: 'Browse nearby',
    icon: Bike,
    className: 'bg-primary text-white shadow-sm hover:bg-[#1ea34a]',
    iconWrap: 'bg-white/20',
  },
  {
    to: '/list-bike',
    title: 'List Your Bike',
    subtitle: 'Earn on idle wheels',
    icon: Plus,
    className: 'bg-charcoal text-white shadow-sm ring-1 ring-charcoal hover:bg-[#0f172a]',
    iconWrap: 'bg-white/15',
  },
  {
    to: '/activity',
    title: 'My Rides',
    subtitle: 'History & receipts',
    icon: Clock,
    className: 'bg-teal text-white shadow-sm hover:bg-[#0d9488]',
    iconWrap: 'bg-white/20',
  },
]

export function QuickActions() {
  return (
    <section className="px-4 lg:px-0">
      <h2 className="mb-3 font-heading text-sm font-bold text-charcoal lg:mb-4 lg:text-base">Quick actions</h2>
      <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible lg:pb-0 xl:gap-4 [&::-webkit-scrollbar]:hidden">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className={`flex min-w-[120px] shrink-0 flex-col items-start gap-3 rounded-xl p-3.5 transition active:scale-[0.98] lg:min-w-0 lg:rounded-2xl lg:p-4 xl:p-5 ${c.className}`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg lg:h-10 lg:w-10 lg:rounded-xl ${c.iconWrap}`}
            >
              <c.icon className="h-[18px] w-[18px] lg:h-5 lg:w-5" strokeWidth={2} />
            </span>
            <div className="flex w-full items-end justify-between gap-1">
              <div>
                <p className="font-heading text-[13px] font-bold leading-tight lg:text-sm">{c.title}</p>
                <p className="mt-0.5 text-[11px] opacity-80 lg:text-xs">{c.subtitle}</p>
              </div>
              <ChevronRight className="mb-0.5 h-4 w-4 shrink-0 opacity-70 lg:h-4 lg:w-4" strokeWidth={2.5} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
