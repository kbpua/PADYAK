import {
  Bike,
  Flame,
  Leaf,
  Route,
  Sparkles,
  Target,
  TreePine,
  TrendingUp,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const MONTHLY_GOAL_KM = 50

export function EcoImpactCard() {
  const { user } = useApp()
  const s = user.stats
  const g = user.greenEquivalent
  const avgKm = s.totalRides > 0 ? (s.totalDistance / s.totalRides).toFixed(1) : 0
  const goalPct = Math.min((s.totalDistance / MONTHLY_GOAL_KM) * 100, 100)

  return (
    <section className="w-full px-4 lg:px-0">
      <div className="rounded-2xl bg-charcoal p-5 shadow-lg ring-1 ring-white/10">
        {/* ── Header ── */}
        <h2 className="font-heading text-lg font-bold text-white">Your Green Impact 🌱</h2>

        {/* ── Stats grid: 3 cols × 2 rows, all tiles equal height ── */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Row 1 */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
            <Leaf className="mb-1.5 h-5 w-5 text-primary" />
            <p className="font-mono-data text-sm font-bold leading-none text-primary">{s.totalCO2Saved} kg</p>
            <p className="mt-1 text-[10px] font-medium text-white/70">CO₂ saved</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
            <Route className="mb-1.5 h-5 w-5 text-teal" />
            <p className="font-mono-data text-sm font-bold leading-none text-teal">{s.totalDistance} km</p>
            <p className="mt-1 text-[10px] font-medium text-white/70">Biked</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
            <Sparkles className="mb-1.5 h-5 w-5 text-accent" />
            <p className="font-mono-data text-sm font-bold leading-none text-accent">{s.ridesThisWeek}</p>
            <p className="mt-1 text-[10px] font-medium text-white/70">Rides this week</p>
          </div>
          {/* Row 2 */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
            <Bike className="mb-1.5 h-5 w-5 text-sky-400" />
            <p className="font-mono-data text-sm font-bold leading-none text-sky-400">{s.totalRides}</p>
            <p className="mt-1 text-[10px] font-medium text-white/70">Total rides</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
            <Flame className="mb-1.5 h-5 w-5 text-orange-400" />
            <p className="font-mono-data text-sm font-bold leading-none text-orange-400">{avgKm} km</p>
            <p className="mt-1 text-[10px] font-medium text-white/70">Avg per ride</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/10">
            <TrendingUp className="mb-1.5 h-5 w-5 text-primary" />
            <p className="font-mono-data text-sm font-bold leading-none text-primary">{s.totalCO2Saved} kg</p>
            <p className="mt-1 text-[10px] font-medium text-white/70">CO₂ this month</p>
          </div>
        </div>

        {/* ── Monthly goal progress ── */}
        <div className="mt-5 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-white">Monthly Goal</span>
            </div>
            <span className="font-mono-data text-xs font-bold text-accent">
              {s.totalDistance} / {MONTHLY_GOAL_KM} km
            </span>
          </div>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-white/50">
            {goalPct >= 100
              ? '🎉 Goal reached! Keep pedalling to set a new record.'
              : `${(MONTHLY_GOAL_KM - s.totalDistance).toFixed(1)} km to go — you're ${Math.round(goalPct)}% there!`}
          </p>
        </div>

        {/* ── Eco equivalencies ── */}
        <div className="mt-5 space-y-2.5">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-white/40">
            What your rides offset
          </h3>
          <div className="flex items-start gap-3 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-white/70">
              <span className="font-bold text-primary">{g.airconHours} hrs</span> of aircon
              switched off on the PH coal grid
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
            <TreePine className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
            <p className="text-xs leading-relaxed text-white/70">
              Equal to <span className="font-bold text-teal">{g.treesEquivalent} tree</span>{' '}
              absorbing CO₂ for a full month
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
            <p className="text-xs leading-relaxed text-white/70">
              You burned{' '}
              <span className="font-bold text-orange-400">{s.totalCalories} kcal</span> — that's
              about {Math.round(s.totalCalories / 260)} cups of rice worth of energy
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
