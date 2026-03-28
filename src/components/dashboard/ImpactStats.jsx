import { useEffect, useState } from 'react'
import { Leaf, Route, Sparkles, Trees } from 'lucide-react'
import { useApp } from '../../context/AppContext'

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
  const { user } = useApp()
  const g = user.greenEquivalent
  const co2 = useCountUp(user.stats.totalCO2Saved, 1200, 1)
  const km = useCountUp(user.stats.totalDistance, 1200, 1)
  const rides = useCountUp(user.stats.totalRides, 1000, 0)
  const trees = useCountUp(g.treesEquivalent, 1200, 1)

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
      <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20 lg:rounded-2xl lg:p-3.5">
        <Leaf className="h-4 w-4 text-primary lg:h-[18px] lg:w-[18px]" />
        <p className="mt-1.5 font-mono-data text-2xl font-bold text-primary lg:text-[1.65rem]">{co2}</p>
        <p className="text-[11px] font-semibold text-charcoal/55 lg:text-xs">kg CO₂ saved</p>
      </div>
      <div className="rounded-xl bg-teal/10 p-3 ring-1 ring-teal/20 lg:rounded-2xl lg:p-3.5">
        <Route className="h-4 w-4 text-teal lg:h-[18px] lg:w-[18px]" />
        <p className="mt-1.5 font-mono-data text-2xl font-bold text-teal lg:text-[1.65rem]">{km}</p>
        <p className="text-[11px] font-semibold text-charcoal/55 lg:text-xs">km biked</p>
      </div>
      <div className="rounded-xl bg-accent/15 p-3 ring-1 ring-accent/25 lg:rounded-2xl lg:p-3.5">
        <Sparkles className="h-4 w-4 text-accent lg:h-[18px] lg:w-[18px]" />
        <p className="mt-1.5 font-mono-data text-2xl font-bold text-charcoal lg:text-[1.65rem]">{rides}</p>
        <p className="text-[11px] font-semibold text-charcoal/55 lg:text-xs">total rides</p>
      </div>
      <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20 lg:rounded-2xl lg:p-3.5">
        <Trees className="h-4 w-4 text-primary lg:h-[18px] lg:w-[18px]" />
        <p className="mt-1.5 font-mono-data text-2xl font-bold text-primary lg:text-[1.65rem]">≈ {trees}</p>
        <p className="text-[11px] font-semibold text-charcoal/55 lg:text-xs">trees equivalent</p>
      </div>
    </div>
  )
}
