import { Link } from 'react-router-dom'
import {
  Bike,
  ChevronRight,
  Flame,
  Leaf,
  Route,
  Sparkles,
  Target,
  TreePine,
  TrendingUp,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { recentRidesCount, renterStatsFromRideHistory } from '../../lib/rideStats'

const MONTHLY_GOAL_KM = 50

const tileClass =
  'flex flex-col items-center justify-center rounded-xl bg-white/90 px-2 py-2.5 text-center shadow-sm ring-1 ring-emerald-200/60 backdrop-blur-sm lg:py-2'

export function EcoImpactCard() {
  const { user, rideHistory } = useApp()
  const g = user.greenEquivalent
  const derived = renterStatsFromRideHistory(rideHistory)
  const hasTripData = rideHistory.length > 0
  const hasRecordedWeek = rideHistory.some((t) => t.recordedAt)
  const ridesThisWeekLive = hasRecordedWeek ? recentRidesCount(rideHistory, 7) : user.stats.ridesThisWeek
  const s = hasTripData
    ? {
        totalRides: derived.rides,
        totalDistance: derived.km,
        totalCO2Saved: derived.co2,
        ridesThisWeek: ridesThisWeekLive,
        totalCalories: Math.max(1, Math.round(derived.km * 55)),
      }
    : user.stats
  const avgKm = s.totalRides > 0 ? (s.totalDistance / s.totalRides).toFixed(1) : 0
  const goalPct = Math.min((s.totalDistance / MONTHLY_GOAL_KM) * 100, 100)

  return (
    <section className="w-full px-4 lg:px-0">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-100/95 via-primary/[0.14] to-teal-100/90 p-4 shadow-md shadow-emerald-900/[0.06] ring-1 ring-emerald-200/80 lg:p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 font-heading text-base font-extrabold tracking-tight text-emerald-950 lg:text-base">
            Your Green Impact <span className="font-normal">🌱</span>
          </h2>
          <Link
            to="/dashboard"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-emerald-800 shadow-sm ring-1 ring-emerald-200/80 transition hover:bg-white hover:text-primary active:scale-95"
            aria-label="Open full eco dashboard"
            title="Eco Dashboard"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 lg:gap-2">
          <div className={tileClass}>
            <Leaf className="mb-1 h-4 w-4 text-primary lg:h-4 lg:w-4" />
            <p className="font-mono-data text-sm font-bold leading-none text-primary">{s.totalCO2Saved} kg</p>
            <p className="mt-1 text-[10px] font-medium text-emerald-900/55">CO₂ saved</p>
          </div>
          <div className={tileClass}>
            <Route className="mb-1 h-4 w-4 text-teal" />
            <p className="font-mono-data text-sm font-bold leading-none text-teal">{s.totalDistance} km</p>
            <p className="mt-1 text-[10px] font-medium text-emerald-900/55">Biked</p>
          </div>
          <div className={tileClass}>
            <Sparkles className="mb-1 h-4 w-4 text-accent" />
            <p className="font-mono-data text-sm font-bold leading-none text-accent">{s.ridesThisWeek}</p>
            <p className="mt-1 text-[10px] font-medium text-emerald-900/55">Rides this week</p>
          </div>
          <div className={tileClass}>
            <Bike className="mb-1 h-4 w-4 text-sky-600" />
            <p className="font-mono-data text-sm font-bold leading-none text-sky-600">{s.totalRides}</p>
            <p className="mt-1 text-[10px] font-medium text-emerald-900/55">Total rides</p>
          </div>
          <div className={tileClass}>
            <Flame className="mb-1 h-4 w-4 text-orange-500" />
            <p className="font-mono-data text-sm font-bold leading-none text-orange-500">{avgKm} km</p>
            <p className="mt-1 text-[10px] font-medium text-emerald-900/55">Avg per ride</p>
          </div>
          <div className={tileClass}>
            <TrendingUp className="mb-1 h-4 w-4 text-primary lg:h-4 lg:w-4" />
            <p className="font-mono-data text-sm font-bold leading-none text-primary">{s.totalCO2Saved} kg</p>
            <p className="mt-1 text-[10px] font-medium text-emerald-900/55">CO₂ this month</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white/75 p-3 ring-1 ring-emerald-200/70 backdrop-blur-sm lg:mt-4 lg:p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-xs font-bold text-emerald-950">Monthly Goal</span>
            </div>
            <span className="font-mono-data text-xs font-bold text-emerald-800">
              {s.totalDistance} / {MONTHLY_GOAL_KM} km
            </span>
          </div>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-emerald-200/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-400 to-accent transition-all"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-emerald-900/55">
            {goalPct >= 100
              ? '🎉 Goal reached! Keep pedalling to set a new record.'
              : `${(MONTHLY_GOAL_KM - s.totalDistance).toFixed(1)} km to go — you're ${Math.round(goalPct)}% there!`}
          </p>
        </div>

        <div className="mt-4 space-y-2 lg:mt-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/50">
            What your rides offset
          </h3>
          <div className="flex items-start gap-3 rounded-xl bg-white/75 px-3 py-2.5 ring-1 ring-emerald-200/60 backdrop-blur-sm">
            <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-charcoal/75">
              <span className="font-bold text-primary">{g.airconHours} hrs</span> of aircon switched off on the PH
              coal grid
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/75 px-3 py-2.5 ring-1 ring-emerald-200/60 backdrop-blur-sm">
            <TreePine className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
            <p className="text-xs leading-relaxed text-charcoal/75">
              Equal to <span className="font-bold text-teal">{g.treesEquivalent} tree</span> absorbing CO₂ for a full
              month
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-white/75 px-3 py-2.5 ring-1 ring-emerald-200/60 backdrop-blur-sm">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
            <p className="text-xs leading-relaxed text-charcoal/75">
              You burned <span className="font-bold text-orange-500">{s.totalCalories} kcal</span> — that&apos;s
              about {Math.round(s.totalCalories / 260)} cups of rice worth of energy
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
