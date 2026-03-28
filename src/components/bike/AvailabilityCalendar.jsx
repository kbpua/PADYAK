import {
  AVAILABILITY_SLOT_ROWS,
  DAY_KEYS,
  getAvailabilityCellState,
  makeSlotId,
} from '../../lib/bikeAvailability'

const styles = {
  available: 'bg-primary/20 text-primary ring-1 ring-primary/40 hover:bg-primary/30',
  booked: 'bg-charcoal/10 text-charcoal/35 cursor-not-allowed',
  pending: 'bg-accent/20 text-amber-800 ring-1 ring-accent/40 cursor-not-allowed',
  off: 'bg-charcoal/[0.06] text-charcoal/30 cursor-not-allowed',
}

const labels = {
  available: 'Free',
  booked: '—',
  pending: '…',
  off: '—',
}

/**
 * @param {{ bike?: object, selected?: string | null, onSelect?: (slotId: string) => void }} props
 */
export function AvailabilityCalendar({ bike, selected, onSelect }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5">
      <h3 className="font-heading text-sm font-bold text-charcoal">Availability</h3>
      <p className="mt-1 text-xs text-charcoal/55">
        {bike?.availability
          ? 'Green slots match this host’s listed days & pickup window.'
          : 'Tap a green slot to select'}
      </p>
      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] gap-1 text-center text-[10px] font-bold uppercase tracking-wide text-charcoal/45">
            <div />
            {DAY_KEYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          {AVAILABILITY_SLOT_ROWS.map(({ hour, label }) => (
            <div
              key={hour}
              className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] gap-1 py-1"
            >
              <div className="flex items-center pr-1 text-left text-[11px] font-semibold tabular-nums text-charcoal/70">
                {label}
              </div>
              {DAY_KEYS.map((day) => {
                const key = makeSlotId(day, hour)
                const state = getAvailabilityCellState(bike, day, hour)
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
                    {labels[state]}
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
