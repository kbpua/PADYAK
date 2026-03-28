import { useEffect, useState } from 'react'
import { Camera, Crosshair, MapPin, Navigation, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { KALSADA_ISSUES, SEVERITY_OPTIONS } from './issueConfig'

export function ReportForm({ open, onClose }) {
  const { addKalsadaReport, user } = useApp()
  const [issueType, setIssueType] = useState(KALSADA_ISSUES[0].type)
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState(KALSADA_ISSUES[0].defaultSeverity)
  const [description, setDescription] = useState('')
  const [locError, setLocError] = useState(false)

  useEffect(() => {
    if (!open) return
    const row = KALSADA_ISSUES.find((x) => x.type === issueType)
    if (row) setSeverity(row.defaultSeverity)
  }, [issueType, open])

  const reset = () => {
    setIssueType(KALSADA_ISSUES[0].type)
    setLocation('')
    setSeverity(KALSADA_ISSUES[0].defaultSeverity)
    setDescription('')
    setLocError(false)
  }

  const useMyLocation = () => {
    const line = [user.barangay, user.city].filter(Boolean).join(', ')
    setLocation(line || 'Quezon City · near you')
    setLocError(false)
  }

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    const loc = location.trim()
    if (!loc) {
      setLocError(true)
      return
    }
    addKalsadaReport({
      type: issueType,
      location: loc,
      severity,
      description,
    })
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 p-0 sm:items-center sm:p-4">
      <button type="button" aria-label="Close" className="absolute inset-0" onClick={handleClose} />
      <div className="relative z-10 max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-charcoal/5 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/45">Kalsada</p>
            <h2 className="font-heading text-lg font-bold text-charcoal">Mark for riders</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-charcoal/5"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5 px-5 pb-8 pt-5" onSubmit={submit}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">What do you see?</p>
            <p className="mt-0.5 text-xs text-charcoal/45">Pick one — same idea as reporting on map apps.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {KALSADA_ISSUES.map(({ type, subtitle, Icon }) => {
                const on = issueType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIssueType(type)}
                    className={`flex flex-col items-start gap-2 rounded-2xl border-2 px-3 py-3 text-left transition active:scale-[0.98] ${
                      on
                        ? 'border-primary bg-primary/[0.07] shadow-sm shadow-primary/10'
                        : 'border-charcoal/10 bg-surface hover:border-charcoal/20'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        on ? 'bg-primary/20 text-primary' : 'bg-white text-charcoal/70 ring-1 ring-charcoal/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span>
                      <span className="block font-heading text-xs font-bold leading-tight text-charcoal">{type}</span>
                      <span className="mt-0.5 block text-[10px] leading-snug text-charcoal/50">{subtitle}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">Where on your route?</p>
            <div className="mt-2 overflow-hidden rounded-2xl border border-charcoal/10 bg-surface ring-1 ring-charcoal/5">
              <div className="flex items-center gap-2 border-b border-charcoal/5 bg-charcoal/[0.03] px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                  <MapPin className="h-4 w-4 text-primary" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-charcoal/40">Pin</p>
                  <p className="truncate text-xs text-charcoal/70">
                    {location.trim() || 'Add a street or landmark'}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <input
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    setLocError(false)
                  }}
                  placeholder="e.g. Katipunan Ave near Petron"
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 ${
                    locError ? 'border-red-300 ring-1 ring-red-200' : 'border-charcoal/15 focus:border-primary'
                  }`}
                />
                {locError ? (
                  <p className="mt-1.5 text-xs font-medium text-red-600">Add a location so others can find it.</p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-[0.98] min-[400px]:flex-initial min-[400px]:px-4"
                  >
                    <Crosshair className="h-3.5 w-3.5" strokeWidth={2} />
                    Use my area
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation((prev) => (prev ? `${prev} · on bike lane side` : 'On bike lane side'))}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-charcoal/15 bg-white py-2.5 text-xs font-bold text-charcoal/80 transition hover:bg-charcoal/[0.03] active:scale-[0.98] min-[400px]:flex-initial min-[400px]:px-4"
                  >
                    <Navigation className="h-3.5 w-3.5" strokeWidth={2} />
                    Lane side note
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">How risky for bikes?</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SEVERITY_OPTIONS.map(({ value, label, hint, tone }) => {
                const on = severity === value
                const tones = {
                  teal: on ? 'bg-teal text-white shadow-md shadow-teal/20' : 'bg-surface ring-1 ring-charcoal/10',
                  amber: on ? 'bg-accent text-charcoal shadow-md shadow-accent/25' : 'bg-surface ring-1 ring-charcoal/10',
                  red: on ? 'bg-red-500 text-white shadow-md shadow-red-500/25' : 'bg-surface ring-1 ring-charcoal/10',
                }
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSeverity(value)}
                    className={`rounded-xl px-2 py-2.5 text-center transition active:scale-[0.98] ${tones[tone]}`}
                  >
                    <span className="block font-heading text-xs font-bold">{label}</span>
                    <span className={`mt-0.5 block text-[9px] font-medium ${on ? 'text-white/90' : 'text-charcoal/45'}`}>
                      {hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">Photo (optional)</p>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal/15 bg-charcoal/[0.02] py-6 text-sm font-semibold text-charcoal/45 transition hover:border-primary/30 hover:bg-primary/[0.03] hover:text-charcoal/65"
            >
              <Camera className="h-5 w-5" strokeWidth={2} />
              Add photo — helps confirm
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-charcoal/50" htmlFor="kalsada-notes">
              Quick note <span className="font-normal text-charcoal/35">(optional)</span>
            </label>
            <textarea
              id="kalsada-notes"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-2 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Anything else riders should know?"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition active:scale-[0.98]"
          >
            Send to map
          </button>
          <p className="text-center text-[11px] text-charcoal/40">
            Reports are shared with the community. Stay safe and don’t use your phone while riding.
          </p>
        </form>
      </div>
    </div>
  )
}
