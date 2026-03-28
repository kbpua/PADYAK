const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const slots = ['8a', '10a', '12p', '2p', '4p', '6p']

/** @type {Record<string, 'available' | 'booked' | 'pending'>} */
const mock = {
  'Mon-8a': 'booked',
  'Mon-10a': 'available',
  'Mon-12p': 'available',
  'Tue-2p': 'pending',
  'Wed-10a': 'available',
  'Thu-4p': 'booked',
  'Fri-8a': 'available',
  'Sat-10a': 'available',
  'Sun-6p': 'available',
}

const styles = {
  available: 'bg-primary/20 text-primary ring-1 ring-primary/40 hover:bg-primary/30',
  booked: 'bg-charcoal/10 text-charcoal/35 cursor-not-allowed',
  pending: 'bg-accent/20 text-amber-800 ring-1 ring-accent/40',
}

export function AvailabilityCalendar({ selected, onSelect }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5">
      <h3 className="font-heading text-sm font-bold text-charcoal">Availability</h3>
      <p className="mt-1 text-xs text-charcoal/55">Tap a green slot to select</p>
      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-charcoal/45">
            <div />
            {days.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          {slots.map((slot) => (
            <div
              key={slot}
              className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] gap-1 py-1"
            >
              <div className="flex items-center text-xs font-mono-data font-semibold text-charcoal/60">
                {slot}
              </div>
              {days.map((day) => {
                const key = `${day}-${slot}`
                const state = mock[key] || 'available'
                const isSelected = selected === key
                const clickable = state === 'available'
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={!clickable}
                    onClick={() => clickable && onSelect?.(key)}
                    className={`rounded-lg py-2 text-[10px] font-bold transition active:scale-95 ${
                      styles[state]
                    } ${isSelected ? 'ring-2 ring-charcoal ring-offset-1' : ''}`}
                  >
                    {state === 'booked' ? '—' : state === 'pending' ? '…' : 'Free'}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
