import { weeklyRideCounts } from '../../data/user'

const max = Math.max(...weeklyRideCounts.map((d) => d.count), 1)

export function WeeklyChart() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-charcoal/5">
      <h2 className="font-heading text-sm font-bold text-charcoal">Weekly activity</h2>
      <div className="mt-6 flex h-40 items-end justify-between gap-2">
        {weeklyRideCounts.map((d) => {
          const h = (d.count / max) * 100
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end justify-center">
                <div
                  className="w-full max-w-8 rounded-t-md bg-primary transition-all"
                  style={{ height: `${Math.max(h, 8)}%` }}
                  title={`${d.count} rides`}
                />
              </div>
              <span className="text-[10px] font-bold text-charcoal/45">{d.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
