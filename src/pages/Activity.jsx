import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, ChevronRight } from 'lucide-react'
import { mockActivity } from '../data/user'
import { useApp } from '../context/AppContext'
import { RideReceiptModal } from '../components/activity/RideReceiptModal'

const demoBooking = {
  id: 'demo-ride',
  bike: { id: 2, name: 'City Cruiser Lite', color: '#14B8A6' },
  dateLabel: 'Sat, Mar 28, 2026',
  duration: '1 hour',
  pickup: 'Brgy. UP Campus',
  total: 25,
  slot: 'Sat 10:00 AM',
}

export function Activity() {
  const navigate = useNavigate()
  const { startRide, rideHistory } = useApp()
  const [receiptRide, setReceiptRide] = useState(null)

  const rides = useMemo(() => [...rideHistory, ...mockActivity], [rideHistory])

  const goDemoRide = () => {
    startRide(demoBooking)
    navigate('/ride/active')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-4 lg:px-0 lg:pb-12 lg:pt-6 xl:max-w-4xl">
      <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-3xl">My rides</h1>
      <p className="mt-1 text-sm text-charcoal/55">Receipts and trip history</p>
      <div className="mt-6 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {rides.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setReceiptRide(a)}
            aria-label={`View receipt — ${a.bikeName}, ${a.date}`}
            className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-md ring-1 ring-charcoal/5 transition hover:shadow-lg hover:ring-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${a.bikeColor || '#22c55e'}26` }}
            >
              <Bike className="h-6 w-6 text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-bold text-charcoal">{a.bikeName}</p>
              <p className="text-xs text-charcoal/55">
                {a.date} · {a.time}
              </p>
              <p className="text-xs font-mono-data text-teal">{a.distance}</p>
            </div>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-charcoal/25 transition group-hover:text-primary/70"
              aria-hidden
            />
            <span className="shrink-0 rounded-full bg-teal/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-teal">
              {typeof a.status === 'string' ? a.status : 'completed'}
            </span>
          </button>
        ))}
      </div>

      <RideReceiptModal
        open={Boolean(receiptRide)}
        onClose={() => setReceiptRide(null)}
        ride={receiptRide}
      />
      <button
        type="button"
        onClick={goDemoRide}
        className="mt-6 flex w-full items-center justify-between rounded-2xl bg-charcoal p-4 text-white shadow-lg transition active:scale-[0.99]"
      >
        <span className="font-heading text-sm font-bold">Simulate active ride</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
