import { useState } from 'react'
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
            Help improve cycling infrastructure in your city. Report hazards, missing lanes, and issues you see on
            your route.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 w-full rounded-full bg-accent py-4 font-heading text-sm font-bold text-charcoal shadow-lg shadow-accent/20 transition hover:bg-accent/90 active:scale-[0.98] lg:mt-8 lg:py-4 lg:text-base xl:max-w-sm"
          >
            Report an Issue
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
