import { weeklyRideCounts } from '../../data/user'

const max = Math.max(...weeklyRideCounts.map((d) => d.count), 1)

export function WeeklyChart() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5 lg:p-4">
      <h2 className="font-heading text-sm font-bold text-charcoal">Weekly activity</h2>
      <p className="mt-2 text-xs leading-relaxed text-charcoal/55 lg:text-[13px]">
        Each bar is how many rides were logged that day of the week (sample pattern for this demo). Hover a day to see
        the count.
      </p>
      <div className="mt-4 flex h-32 items-end justify-between gap-1.5 lg:mt-4 lg:h-36 lg:gap-2">
        {weeklyRideCounts.map((d) => {
          const h = (d.count / max) * 100
          const rideLabel = `${d.count} ride${d.count === 1 ? '' : 's'}`
          return (
            <div key={d.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div
                className="group relative h-24 w-full cursor-default lg:h-28"
                role="img"
                aria-label={`${d.day}: ${rideLabel}`}
              >
                <span className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-charcoal px-2 py-1 text-[10px] font-bold text-white shadow-md opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {rideLabel}
                </span>
                <div className="flex h-full w-full items-end justify-center">
                  <div
                    className="w-full max-w-8 rounded-t-md bg-primary transition group-hover:brightness-105"
                    style={{ height: `${Math.max(h, 8)}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-bold text-charcoal/45">{d.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
