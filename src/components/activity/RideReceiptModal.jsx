import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bike, CheckCircle2, MapPin, Receipt, X } from 'lucide-react'
import { receiptPaymentLabel } from '../../data/paymentMethods'
import { CO2_KG_PER_KM, parseDistanceKm } from '../../lib/rideStats'

function receiptRef(id) {
  if (id == null || id === '') return '—'
  const s = String(id).replace(/[^a-zA-Z0-9]/g, '')
  const tail = s.slice(-10).toUpperCase()
  return tail || '—'
}

function formatPeso(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return null
  return `₱${n.toLocaleString('en-PH')}`
}

/**
 * @param {{ open: boolean; onClose: () => void; ride: object | null }} props
 */
export function RideReceiptModal({ open, onClose, ride }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!ride) return null

  const km = parseDistanceKm(ride.distance)
  const co2Est = km > 0 ? Number((km * CO2_KG_PER_KM).toFixed(1)) : null
  const totalStr = formatPeso(ride.total)
  const paymentMethodLabel =
    ride.paymentMethodLabel ??
    (ride.paymentMethod != null && ride.paymentMethod !== ''
      ? receiptPaymentLabel(ride.paymentMethod)
      : null)
  const statusLabel =
    typeof ride.status === 'string' ? ride.status.replace(/_/g, ' ') : 'completed'
  const whenLine = ride.dateLabel
    ? `${ride.dateLabel}${ride.time ? ` · ${ride.time}` : ''}`
    : `${ride.date}${ride.time ? ` · ${ride.time}` : ''}`

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[78] bg-charcoal/60 backdrop-blur-sm"
            aria-label="Close receipt"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ride-receipt-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[79] max-h-[min(88dvh,640px)] overflow-y-auto rounded-3xl bg-[#fafaf8] p-5 shadow-2xl ring-1 ring-charcoal/10 sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:max-h-[min(92dvh,680px)] lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-charcoal/5"
                  style={{ backgroundColor: `${ride.bikeColor || '#22c55e'}22` }}
                >
                  <Receipt className="h-5 w-5 text-charcoal/80" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <h2
                    id="ride-receipt-title"
                    className="font-heading text-lg font-extrabold tracking-tight text-charcoal"
                  >
                    Ride receipt
                  </h2>
                  <p className="font-mono-data text-[11px] uppercase tracking-wider text-charcoal/45">
                    Ref · {receiptRef(ride.id)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-charcoal/10 hover:text-charcoal"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div
              className="my-4 border-b border-dashed border-charcoal/20"
              aria-hidden
            />

            <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-charcoal/[0.06]">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${ride.bikeColor || '#22c55e'}26` }}
              >
                <Bike className="h-6 w-6 text-primary" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-sm font-bold text-charcoal">{ride.bikeName}</p>
                <p className="mt-0.5 text-xs text-charcoal/55">{whenLine}</p>
                <p className="mt-1 text-xs font-mono-data font-semibold text-teal">{ride.distance}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-teal/12 px-2 py-1 text-[10px] font-bold capitalize text-teal">
                <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                {statusLabel}
              </span>
            </div>

            <dl className="mt-4 space-y-2.5 text-sm">
              {ride.pickup ? (
                <div className="flex gap-3 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-charcoal/[0.06]">
                  <dt className="flex shrink-0 items-center gap-1.5 text-charcoal/45">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                    Pickup
                  </dt>
                  <dd className="min-w-0 text-right font-medium text-charcoal">{ride.pickup}</dd>
                </div>
              ) : null}
              {ride.slot || ride.duration ? (
                <div className="flex justify-between gap-3 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-charcoal/[0.06]">
                  <dt className="text-charcoal/45">Booking</dt>
                  <dd className="text-right font-medium text-charcoal">
                    {[ride.slot, ride.duration].filter(Boolean).join(' · ')}
                  </dd>
                </div>
              ) : null}
              {co2Est != null && co2Est > 0 ? (
                <div className="flex justify-between gap-3 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-charcoal/[0.06]">
                  <dt className="text-charcoal/45">Est. CO₂ avoided</dt>
                  <dd className="font-mono-data font-semibold text-orange-600/90">
                    {co2Est} kg
                  </dd>
                </div>
              ) : null}
              {totalStr ? (
                <div className="flex justify-between gap-3 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-charcoal/[0.06]">
                  <dt className="text-charcoal/45">Amount paid</dt>
                  <dd className="font-heading font-extrabold tabular-nums text-charcoal">{totalStr}</dd>
                </div>
              ) : null}
              {paymentMethodLabel ? (
                <div className="flex justify-between gap-3 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-charcoal/[0.06]">
                  <dt className="text-charcoal/45">Payment method</dt>
                  <dd className="max-w-[58%] text-right font-medium text-charcoal">
                    {paymentMethodLabel}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-charcoal/40">
              Thank you for riding with Padyak. Keep this receipt for your records.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
