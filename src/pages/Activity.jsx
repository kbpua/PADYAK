import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, ChevronRight } from 'lucide-react'
import { mockActivity } from '../data/user'
import { useApp } from '../context/AppContext'

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
          <div
            key={a.id}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5 transition hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
              <Bike className="h-6 w-6 text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-sm font-bold text-charcoal">{a.bikeName}</p>
              <p className="text-xs text-charcoal/55">
                {a.date} · {a.time}
              </p>
              <p className="text-xs font-mono-data text-teal">{a.distance}</p>
            </div>
            <span className="rounded-full bg-teal/15 px-2 py-1 text-[10px] font-bold uppercase text-teal">
              {a.status}
            </span>
          </div>
        ))}
      </div>
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
