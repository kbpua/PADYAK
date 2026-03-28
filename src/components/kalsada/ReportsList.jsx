import { AlertTriangle, ThumbsUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const severityColor = {
  Low: 'bg-teal/20 text-teal',
  Medium: 'bg-accent/25 text-amber-900',
  High: 'bg-red-100 text-red-700',
}

export function ReportsList() {
  const { kalsadaReports, upvoteReport } = useApp()
  return (
    <div>
      <h2 className="font-heading text-sm font-bold text-charcoal lg:text-lg">Recent reports near you</h2>
      <div className="mt-3 space-y-3 lg:mt-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
      {kalsadaReports.map((r) => (
        <div
          key={r.id}
          className="flex gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5 lg:p-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-charcoal/5">
            <AlertTriangle className="h-6 w-6 text-accent" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading text-sm font-bold text-charcoal">{r.type}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${severityColor[r.severity] || severityColor.Medium}`}
              >
                {r.severity}
              </span>
            </div>
            <p className="mt-1 text-xs text-charcoal/65">{r.location}</p>
            <p className="mt-1 text-[11px] text-charcoal/45">{r.timestamp}</p>
          </div>
          <button
            type="button"
            onClick={() => upvoteReport(r.id)}
            className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl bg-surface px-2 py-1 text-charcoal/70 transition hover:bg-primary/10 active:scale-95"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs font-bold">{r.upvotes}</span>
          </button>
        </div>
      ))}
      </div>
    </div>
  )
}
