import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { ReportForm } from '../components/kalsada/ReportForm'
import { ReportsList } from '../components/kalsada/ReportsList'

export function KalsadaReports() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 lg:max-w-[1400px] lg:px-10 xl:px-14 lg:pb-12 lg:pt-8">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
        <header className="lg:col-span-4 xl:col-span-3">
          <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-3xl xl:text-4xl">
            Kalsada Reports 🛣️
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/60 lg:mt-4 lg:text-base lg:leading-relaxed">
            Spot something on your ride? Mark it in a few taps—like map apps do for traffic, but for people on bikes.
            Others see it on their route.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-charcoal/55 lg:text-sm">
            <li className="flex gap-2">
              <span className="font-bold text-primary">1.</span>
              Choose what you saw (pothole, flood, risky crossing…)
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">2.</span>
              Drop where it is — street name or “use my area”
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary">3.</span>
              Send — riders nearby can confirm with a tap
            </li>
          </ul>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 font-heading text-sm font-bold text-charcoal shadow-lg shadow-accent/20 transition hover:bg-accent/90 active:scale-[0.98] lg:mt-8 lg:py-4 lg:text-base xl:max-w-sm"
          >
            <MapPin className="h-5 w-5 shrink-0" strokeWidth={2} />
            Mark on map
          </button>
        </header>

        <div className="mt-8 lg:col-span-8 xl:col-span-9 lg:mt-0">
          <ReportsList />
        </div>
      </div>
      <ReportForm open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
