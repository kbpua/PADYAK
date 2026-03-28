import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { barangays } from '../../data/barangays'
import { useApp } from '../../context/AppContext'

function TrendIcon({ trend }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-primary" />
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-400" />
  return <Minus className="h-4 w-4 text-charcoal/35" />
}

export function FullLeaderboard() {
  const { user } = useApp()
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5">
      <h2 className="font-heading text-sm font-bold text-charcoal">Barangay leaderboard</h2>
      <div className="mt-3 divide-y divide-charcoal/5">
        {barangays.map((b) => {
          const mine = b.name === user.barangay
          return (
            <div
              key={b.name}
              className={`flex items-center gap-3 py-3 ${mine ? 'rounded-xl bg-primary/10 px-2 -mx-2' : ''}`}
            >
              <span className="w-6 text-center font-mono-data text-sm font-bold text-charcoal/50">
                {b.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-bold text-charcoal">
                  {b.name}
                  {mine && (
                    <span className="ml-2 text-[10px] font-bold uppercase text-primary">You</span>
                  )}
                </p>
                <p className="text-xs text-charcoal/55">
                  {b.totalCO2Saved} kg CO₂ · {b.activeRiders} active riders
                </p>
              </div>
              <TrendIcon trend={b.trend} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
