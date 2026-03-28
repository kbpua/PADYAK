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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20">
        <Leaf className="h-5 w-5 text-primary" />
        <p className="mt-2 font-mono-data text-3xl font-bold text-primary">{co2}</p>
        <p className="text-xs font-semibold text-charcoal/55">kg CO₂ saved</p>
      </div>
      <div className="rounded-2xl bg-teal/10 p-4 ring-1 ring-teal/20">
        <Route className="h-5 w-5 text-teal" />
        <p className="mt-2 font-mono-data text-3xl font-bold text-teal">{km}</p>
        <p className="text-xs font-semibold text-charcoal/55">km biked</p>
      </div>
      <div className="rounded-2xl bg-accent/15 p-4 ring-1 ring-accent/25">
        <Sparkles className="h-5 w-5 text-accent" />
        <p className="mt-2 font-mono-data text-3xl font-bold text-charcoal">{rides}</p>
        <p className="text-xs font-semibold text-charcoal/55">total rides</p>
      </div>
      <div className="rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20">
        <Trees className="h-5 w-5 text-primary" />
        <p className="mt-2 font-mono-data text-3xl font-bold text-primary">≈ {trees}</p>
        <p className="text-xs font-semibold text-charcoal/55">trees equivalent</p>
      </div>
    </div>
  )
}
