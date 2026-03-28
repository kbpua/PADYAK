import { useState } from 'react'
import { Camera, MapPin, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const types = [
  'Pothole',
  'No Bike Lane',
  'Flooding',
  'Dangerous Intersection',
  'Obstruction',
  'Poor Lighting',
]

const severities = ['Low', 'Medium', 'High']

export function ReportForm({ open, onClose }) {
  const { addKalsadaReport } = useApp()
  const [issueType, setIssueType] = useState(types[0])
  const [location, setLocation] = useState('')
  const [severity, setSeverity] = useState('Medium')
  const [description, setDescription] = useState('')

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    addKalsadaReport({
      type: issueType,
      location: location || 'Near current location',
      severity,
      description,
    })
    onClose()
    setLocation('')
    setDescription('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-charcoal">Report an issue</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-charcoal/5"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-charcoal/50">
              Issue type
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setIssueType(t)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                    issueType === t
                      ? 'bg-charcoal text-white'
                      : 'bg-surface text-charcoal ring-1 ring-charcoal/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-charcoal/50">
              Location
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street or landmark"
                className="flex-1 rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                className="flex shrink-0 items-center gap-1 rounded-xl bg-primary/15 px-3 text-xs font-bold text-primary"
              >
                <MapPin className="h-4 w-4" />
                GPS
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-charcoal/50">
              Photo
            </label>
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal/20 py-8 text-sm font-semibold text-charcoal/50"
            >
              <Camera className="h-6 w-6" />
              Tap to add photo
            </button>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-charcoal/50">
              Severity
            </label>
            <div className="mt-2 flex gap-2">
              {severities.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition active:scale-95 ${
                    severity === s
                      ? s === 'High'
                        ? 'bg-red-500 text-white'
                        : s === 'Medium'
                          ? 'bg-accent text-charcoal'
                          : 'bg-teal text-white'
                      : 'bg-surface ring-1 ring-charcoal/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-charcoal/50">
              Notes (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-charcoal/15 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="What should other riders know?"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-primary py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition active:scale-[0.98]"
          >
            Submit report
          </button>
        </form>
      </div>
    </div>
  )
}
