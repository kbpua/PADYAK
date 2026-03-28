import { Bus, Lightbulb, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function ContextualImpact() {
  const { user } = useApp()
  const g = user.greenEquivalent
  return (
    <div className="rounded-2xl bg-charcoal p-5 text-white shadow-xl ring-1 ring-primary/25">
      <h2 className="font-heading text-lg font-bold">What your rides mean for the Philippines 🇵🇭</h2>
      <p className="mt-2 text-sm text-white/65">
        Your {user.stats.totalDistance} km biked this month offset:
      </p>
      <ul className="mt-4 space-y-3">
        <li className="flex gap-3 rounded-xl bg-white/5 p-3">
          <Lightbulb className="h-6 w-6 shrink-0 text-accent" />
          <div>
            <p className="font-mono-data text-lg font-bold text-accent">{g.airconHours} hours</p>
            <p className="text-xs text-white/60">of aircon on the PH coal grid</p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl bg-white/5 p-3">
          <Bus className="h-6 w-6 shrink-0 text-teal" />
          <div>
            <p className="font-mono-data text-lg font-bold text-teal">{g.jeepneyTrips} jeepney trips</p>
            <p className="text-xs text-white/60">worth of PM2.5 emissions</p>
          </div>
        </li>
        <li className="flex gap-3 rounded-xl bg-white/5 p-3">
          <Zap className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="font-mono-data text-lg font-bold text-primary">{g.coalKwh} kWh</p>
            <p className="text-xs text-white/60">of coal-generated electricity</p>
          </div>
        </li>
      </ul>
    </div>
  )
}
