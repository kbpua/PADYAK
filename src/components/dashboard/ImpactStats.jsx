import { useEffect, useState } from 'react'
import { Leaf, Route, Sparkles, Trees } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { renterStatsFromRideHistory } from '../../lib/rideStats'

function useCountUp(target, duration = 1000, decimals = 1) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf
    const t0 = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - (1 - p) ** 3
      setV(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return decimals === 0 ? Math.round(v) : Number(v.toFixed(decimals))
}

export function ImpactStats() {
  const { user, rideHistory } = useApp()
  const g = user.greenEquivalent
  const derived = renterStatsFromRideHistory(rideHistory)
  const hasTripData = rideHistory.length > 0
  const co2Target = hasTripData ? derived.co2 : user.stats.totalCO2Saved
  const kmTarget = hasTripData ? derived.km : user.stats.totalDistance
  const ridesTarget = hasTripData ? derived.rides : user.stats.totalRides
  const treesTarget =
    hasTripData && user.stats.totalCO2Saved > 0
      ? (derived.co2 / user.stats.totalCO2Saved) * g.treesEquivalent
      : hasTripData
        ? derived.co2 * (g.treesEquivalent / 2.4)
        : g.treesEquivalent
  const co2 = useCountUp(co2Target, 1200, 1)
  const km = useCountUp(kmTarget, 1200, 1)
  const rides = useCountUp(ridesTarget, 1000, 0)
  const trees = useCountUp(treesTarget, 1200, 1)

  return (
    <section className="space-y-3 lg:space-y-3.5" aria-labelledby="impact-stats-heading">
      <h2 id="impact-stats-heading" className="font-heading text-sm font-bold text-charcoal lg:text-base">
        Your impact in four numbers
      </h2>
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
        <div className="flex flex-col rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20 lg:min-h-[132px] lg:rounded-2xl lg:p-3.5">
          <Leaf className="h-4 w-4 text-primary lg:h-[18px] lg:w-[18px]" />
          <p className="mt-1.5 font-mono-data text-2xl font-bold text-primary lg:text-[1.65rem]">{co2}</p>
          <p className="text-[11px] font-semibold text-charcoal/60 lg:text-xs">kg CO₂ saved</p>
          <p className="mt-auto pt-1.5 text-[10px] leading-snug text-charcoal/45 lg:text-[11px]">
            Climate pollution you likely skipped by pedaling instead of riding in traffic.
          </p>
        </div>
        <div className="flex flex-col rounded-xl bg-teal/10 p-3 ring-1 ring-teal/20 lg:min-h-[132px] lg:rounded-2xl lg:p-3.5">
          <Route className="h-4 w-4 text-teal lg:h-[18px] lg:w-[18px]" />
          <p className="mt-1.5 font-mono-data text-2xl font-bold text-teal lg:text-[1.65rem]">{km}</p>
          <p className="text-[11px] font-semibold text-charcoal/60 lg:text-xs">km biked</p>
          <p className="mt-auto pt-1.5 text-[10px] leading-snug text-charcoal/45 lg:text-[11px]">
            Total distance you covered on the bike this month.
          </p>
        </div>
        <div className="flex flex-col rounded-xl bg-accent/15 p-3 ring-1 ring-accent/25 lg:min-h-[132px] lg:rounded-2xl lg:p-3.5">
          <Sparkles className="h-4 w-4 text-accent lg:h-[18px] lg:w-[18px]" />
          <p className="mt-1.5 font-mono-data text-2xl font-bold text-charcoal lg:text-[1.65rem]">{rides}</p>
          <p className="text-[11px] font-semibold text-charcoal/60 lg:text-xs">total rides</p>
          <p className="mt-auto pt-1.5 text-[10px] leading-snug text-charcoal/45 lg:text-[11px]">
            How many trips you logged — each one counts toward the totals.
          </p>
        </div>
        <div className="flex flex-col rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20 lg:min-h-[132px] lg:rounded-2xl lg:p-3.5">
          <Trees className="h-4 w-4 text-primary lg:h-[18px] lg:w-[18px]" />
          <p className="mt-1.5 font-mono-data text-2xl font-bold text-primary lg:text-[1.65rem]">≈ {trees}</p>
          <p className="text-[11px] font-semibold text-charcoal/60 lg:text-xs">trees equivalent</p>
          <p className="mt-auto pt-1.5 text-[10px] leading-snug text-charcoal/45 lg:text-[11px]">
            Imaginary young trees — helps picture the same benefit in nature terms.
          </p>
        </div>
      </div>
    </section>
  )
}
