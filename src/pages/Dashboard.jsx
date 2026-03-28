import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ImpactStats } from '../components/dashboard/ImpactStats'
import { ContextualImpact } from '../components/dashboard/ContextualImpact'
import { WeeklyChart } from '../components/dashboard/WeeklyChart'
import { FullLeaderboard } from '../components/dashboard/FullLeaderboard'
import { useApp } from '../context/AppContext'

function weeklyFromMonth(stats) {
  const totalRides = stats.totalRides ?? 0
  const weekRides = stats.ridesThisWeek ?? 0
  if (totalRides <= 0 || weekRides <= 0) {
    return { weekRides, weekCo2: 0, weekKm: 0 }
  }
  const ratio = weekRides / totalRides
  return {
    weekRides,
    weekCo2: Number((stats.totalCO2Saved * ratio).toFixed(1)),
    weekKm: Number((stats.totalDistance * ratio).toFixed(1)),
  }
}

export function Dashboard() {
  const { user } = useApp()
  const displayName = user.firstName?.trim() || user.name?.split(/\s+/)[0] || 'there'
  const { weekRides, weekCo2, weekKm } = weeklyFromMonth(user.stats)
  const now = new Date()
  const periodLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const monthName = now.toLocaleDateString('en-US', { month: 'long' })

  const greeting =
    weekRides > 0 ? (
      <>
        Hi, <span className="font-semibold text-charcoal">{displayName}</span>! This past week you took{' '}
        <span className="font-semibold text-charcoal">
          {weekRides} bike ride{weekRides === 1 ? '' : 's'}
        </span>{' '}
        (~<span className="font-semibold text-charcoal">{weekKm} km</span>). Choosing the bike instead of a car or
        jeepney for those trips means about{' '}
        <span className="font-semibold text-primary">{weekCo2} kg less climate pollution</span> than if those trips
        had used a motor. The cards below add up your impact for{' '}
        <span className="font-semibold text-charcoal/80">{monthName}</span> overall.
      </>
    ) : (
      <>
        Hi, <span className="font-semibold text-charcoal">{displayName}</span>! No rides logged in the last week yet
        — when you do, a short recap will show up here. The numbers below are still your totals for{' '}
        <span className="font-semibold text-charcoal/80">{monthName}</span> so far.
      </>
    )

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 pb-8 pt-4 lg:space-y-5 lg:px-0 lg:pb-10 lg:pt-1">
      <div className="flex items-center gap-2.5">
        <Link
          to="/home"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-charcoal/5 transition active:scale-95 lg:h-9 lg:w-9"
          aria-label="Back"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-charcoal" />
        </Link>
      </div>
      <p className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.06] to-teal/[0.04] px-4 py-3.5 text-sm leading-relaxed text-charcoal/80 lg:px-5 lg:py-4 lg:text-[15px]">
        {greeting}
      </p>
      <div>
        <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-2xl">
          Your Eco Dashboard 🌍
        </h1>
        <p className="mt-0.5 text-xs text-charcoal/50 lg:text-xs">{periodLabel}</p>
        <p className="mt-3 w-full max-w-none text-pretty text-sm leading-relaxed text-charcoal/70 lg:text-[15px]">
          This page turns your rides into easy ideas: how far you pedaled, how much dirty air and climate pollution you
          likely avoided by not using a car or jeepney, and how your neighborhood compares with others. The figures are
          estimates for encouragement — not a medical or lab test.
        </p>
      </div>
      <ImpactStats />
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        <div className="space-y-5 lg:space-y-5">
          <ContextualImpact />
          <WeeklyChart />
        </div>
        <FullLeaderboard />
      </div>
    </div>
  )
}
