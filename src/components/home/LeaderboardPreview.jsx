import { Link } from 'react-router-dom'
import { barangays } from '../../data/barangays'

const medals = ['🥇', '🥈', '🥉']

export function LeaderboardPreview() {
  const top = barangays.slice(0, 3)
  return (
    <section className="px-4 pb-4 lg:px-0 lg:pb-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-sm font-bold text-charcoal">Top Green Barangays 🏆</h2>
      </div>
      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5">
        {top.map((b, i) => (
          <div
            key={b.name}
            className="flex items-center justify-between gap-4 border-b border-charcoal/5 pb-2 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg leading-none">{medals[i]}</span>
              <p className="truncate font-heading text-sm font-bold text-charcoal">{b.name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-charcoal/55">
              <span className="whitespace-nowrap">{b.totalCO2Saved} kg CO₂</span>
              <span className="whitespace-nowrap">{b.activeRiders} riders</span>
            </div>
          </div>
        ))}
        <Link
          to="/dashboard"
          className="mt-2 block text-center text-xs font-bold text-primary"
        >
          View Full Leaderboard →
        </Link>
      </div>
    </section>
  )
}
