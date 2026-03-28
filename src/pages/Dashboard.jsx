import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ImpactStats } from '../components/dashboard/ImpactStats'
import { ContextualImpact } from '../components/dashboard/ContextualImpact'
import { WeeklyChart } from '../components/dashboard/WeeklyChart'
import { FullLeaderboard } from '../components/dashboard/FullLeaderboard'

export function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-8 pt-4 lg:space-y-8 lg:px-0 lg:pb-12 lg:pt-2">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-charcoal/5 transition active:scale-95 lg:h-11 lg:w-11"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-charcoal" />
          </Link>
          <div>
            <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-3xl">
              Your Eco Dashboard 🌍
            </h1>
            <p className="text-xs text-charcoal/50 lg:text-sm">March 2026</p>
          </div>
        </div>
      </div>
      <ImpactStats />
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        <div className="space-y-6 lg:space-y-8">
          <ContextualImpact />
          <WeeklyChart />
        </div>
        <FullLeaderboard />
      </div>
    </div>
  )
}
