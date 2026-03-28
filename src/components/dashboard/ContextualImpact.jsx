import { Bus, Lightbulb, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function ContextualImpact() {
  const { user } = useApp()
  const g = user.greenEquivalent
  return (
    <div className="rounded-2xl bg-charcoal p-4 text-white shadow-xl ring-1 ring-primary/25 lg:p-4">
      <h2 className="font-heading text-base font-bold lg:text-lg">What your rides mean for the Philippines 🇵🇭</h2>
      <p className="mt-1.5 text-sm text-white/65 lg:text-[13px]">
        Your {user.stats.totalDistance} km biked this month offset:
      </p>
      <ul className="mt-3 space-y-2">
        <li className="flex gap-2.5 rounded-xl bg-white/5 p-2.5 lg:gap-3 lg:p-2.5">
          <Lightbulb className="h-5 w-5 shrink-0 text-accent lg:h-5 lg:w-5" />
          <div>
            <p className="font-mono-data text-base font-bold text-accent lg:text-base">{g.airconHours} hours</p>
            <p className="text-[11px] text-white/60 lg:text-xs">of aircon on the PH coal grid</p>
          </div>
        </li>
        <li className="flex gap-2.5 rounded-xl bg-white/5 p-2.5 lg:gap-3 lg:p-2.5">
          <Bus className="h-5 w-5 shrink-0 text-teal" />
          <div>
            <p className="font-mono-data text-base font-bold text-teal">{g.jeepneyTrips} jeepney trips</p>
            <p className="text-[11px] text-white/60 lg:text-xs">worth of PM2.5 emissions</p>
          </div>
        </li>
        <li className="flex gap-2.5 rounded-xl bg-white/5 p-2.5 lg:gap-3 lg:p-2.5">
          <Zap className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-mono-data text-base font-bold text-primary">{g.coalKwh} kWh</p>
            <p className="text-xs text-white/60">of coal-generated electricity</p>
          </div>
        </li>
      </ul>
    </div>
  )
}
