import { Bus, Lightbulb, Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function ContextualImpact() {
  const { user } = useApp()
  const g = user.greenEquivalent
  return (
    <div className="rounded-2xl bg-charcoal p-4 text-white shadow-xl ring-1 ring-primary/25 lg:p-5">
      <h2 className="font-heading text-base font-bold lg:text-lg">Everyday comparisons 🇵🇭</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70 lg:text-[13px]">
        Your <span className="font-semibold text-white">{user.stats.totalDistance} km</span> on the bike this month is
        compared to familiar things — aircon, jeepneys, and household power — so you can picture the size of the
        benefit.
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/45">Same benefit, shown as…</p>
      <ul className="mt-3 space-y-2">
        <li className="flex gap-2.5 rounded-xl bg-white/5 p-2.5 lg:gap-3 lg:p-3">
          <Lightbulb className="h-5 w-5 shrink-0 text-accent lg:h-5 lg:w-5" />
          <div>
            <p className="font-mono-data text-base font-bold text-accent lg:text-base">{g.airconHours} hours</p>
            <p className="text-[11px] leading-snug text-white/65 lg:text-xs">
              Running a room aircon — same rough energy &amp; pollution you avoided on the usual power mix.
            </p>
          </div>
        </li>
        <li className="flex gap-2.5 rounded-xl bg-white/5 p-2.5 lg:gap-3 lg:p-3">
          <Bus className="h-5 w-5 shrink-0 text-teal" />
          <div>
            <p className="font-mono-data text-base font-bold text-teal">{g.jeepneyTrips} short jeepney hops</p>
            <p className="text-[11px] leading-snug text-white/65 lg:text-xs">
              Roughly that much roadside smoke and fumes if those legs had been by diesel jeep instead of bike.
            </p>
          </div>
        </li>
        <li className="flex gap-2.5 rounded-xl bg-white/5 p-2.5 lg:gap-3 lg:p-3">
          <Zap className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-mono-data text-base font-bold text-primary">{g.coalKwh} kWh</p>
            <p className="text-[11px] leading-snug text-white/65 lg:text-xs">
              Electricity from a typical coal-heavy grid slice — think charging gadgets or running fans for a while, in
              the same ballpark.
            </p>
          </div>
        </li>
      </ul>
    </div>
  )
}
