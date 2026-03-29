import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Bike, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useMessages } from '../context/MessagesContext'
import { LateReturnRateNotice } from '../components/bike/LateReturnRateNotice'
import { MapPlaceholder } from '../components/common/MapPlaceholder'
import { paymentMethodOptions } from '../data/paymentMethods'

export function BookingConfirm() {
  const navigate = useNavigate()
  const { bookingDraft, paymentMethod, setPaymentMethod, setLastBooking, startRide } = useApp()
  const { ensureChatForBike } = useMessages()
  const [success, setSuccess] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)

  if (!bookingDraft) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8">
        <p className="text-center text-charcoal/60">No booking in progress.</p>
        <Link to="/home" className="font-bold text-primary">
          Browse bikes
        </Link>
      </div>
    )
  }

  const { bike, dateLabel, duration, pickup, rental, serviceFee, slot } = bookingDraft
  const total = rental + serviceFee

  const confirm = () => {
    const booking = {
      id: `b${Date.now()}`,
      bike,
      dateLabel,
      duration,
      pickup,
      total,
      slot,
    }
    setLastBooking(booking)
    setConfirmedBooking(booking)
    startRide(booking)
    setSuccess(true)
  }

  const goToRide = () => {
    navigate('/ride/active')
  }

  const messageOwner = () => {
    const chatId = ensureChatForBike(bike, {
      date: dateLabel,
      time: `${slot} · ${duration}`,
      status: 'pending',
    })
    navigate(`/messages/${chatId}`)
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-svh bg-surface px-4 pb-10 pt-6 lg:mx-auto lg:max-w-3xl lg:px-0 lg:pb-16 lg:pt-8 xl:max-w-4xl">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={goBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal transition hover:bg-charcoal/10 active:scale-95 lg:h-11 lg:w-11"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <div className="min-w-0 flex-1 pt-0.5">
          <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-3xl">Confirm booking</h1>
          <p className="mt-1 text-sm text-charcoal/55">Review details before you pay</p>
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-charcoal/5">
        <div className="flex gap-3">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: bike.color }}
          >
            <Bike className="h-10 w-10" />
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-charcoal">{bike.name}</p>
            <p className="text-sm text-charcoal/60">{dateLabel}</p>
            <p className="text-sm text-charcoal/60">
              {slot} · {duration}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-charcoal/45">Pickup</p>
          <p className="text-sm font-medium text-charcoal">{pickup}</p>
          <div className="mt-2 h-24 overflow-hidden rounded-xl">
            <MapPlaceholder className="h-full w-full" showMarkers={false} />
          </div>
        </div>
        <div className="space-y-2 border-t border-charcoal/5 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-charcoal/60">Rental</span>
            <span className="font-mono-data font-semibold">₱{rental}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/60">Service fee</span>
            <span className="font-mono-data font-semibold">₱{serviceFee}</span>
          </div>
          <div className="flex justify-between border-t border-charcoal/5 pt-2 font-heading text-base font-bold">
            <span>Total</span>
            <span className="text-primary">₱{total}</span>
          </div>
        </div>
        <div className="mt-4">
          <LateReturnRateNotice pricePerHour={bike.pricePerHour} variant="inline" />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-wide text-charcoal/45">Payment</p>
        <div className="mt-2 space-y-2">
          {paymentMethodOptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPaymentMethod(p.id)}
              className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition active:scale-[0.99] ${
                paymentMethod === p.id
                  ? 'border-primary bg-primary/5'
                  : 'border-charcoal/10 bg-white'
              }`}
            >
              <div>
                <p className="font-heading text-sm font-bold text-charcoal">{p.label}</p>
                <p className="text-xs text-charcoal/50">{p.sub}</p>
              </div>
              <span
                className={`h-5 w-5 rounded-full border-2 ${
                  paymentMethod === p.id ? 'border-primary bg-primary' : 'border-charcoal/20'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900 ring-1 ring-amber-200">
        A refundable <strong>₱100</strong> deposit will be held for this booking.
      </p>

      <button
        type="button"
        onClick={messageOwner}
        className="mt-6 w-full rounded-full border-2 border-charcoal/15 py-3.5 font-heading text-sm font-bold text-charcoal transition active:scale-[0.98] hover:bg-charcoal/[0.03]"
      >
        Message Owner
      </button>

      <button
        type="button"
        onClick={confirm}
        className="mt-4 w-full rounded-full bg-primary py-4 font-heading text-base font-bold text-white shadow-xl shadow-primary/25 transition active:scale-[0.98]"
      >
        Confirm Booking
      </button>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 text-center shadow-2xl"
            >
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="pointer-events-none absolute text-lg"
                  style={{
                    left: `${10 + (i * 7) % 80}%`,
                    top: '-10%',
                    animation: `confetti-fall ${1.2 + (i % 5) * 0.1}s ease-in forwards`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  {['🎉', '✨', '🚲', '🌿'][i % 4]}
                </span>
              ))}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-extrabold text-charcoal">Booking Confirmed! 🎉</h2>
              <div className="mx-auto mt-4 flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-charcoal/20 bg-charcoal/5 font-mono-data text-xs text-charcoal/40">
                QR unlock
              </div>
              <p className="mt-4 text-sm text-charcoal/70">
                You&apos;ll save an estimated <strong className="text-primary">0.8 kg CO₂</strong> on
                this ride
              </p>
              <button
                type="button"
                onClick={goToRide}
                className="mt-6 w-full rounded-full bg-charcoal py-3.5 font-heading text-sm font-bold text-white transition active:scale-[0.98]"
              >
                View Ride Details
              </button>
              <button
                type="button"
                onClick={() => {
                  const chatId = ensureChatForBike(bike, {
                    date: dateLabel,
                    time: `${slot} · ${duration}`,
                    status: 'confirmed',
                  })
                  navigate(`/messages/${chatId}`)
                }}
                className="mt-3 w-full text-sm font-bold text-primary underline-offset-2 hover:underline"
              >
                Message Owner
              </button>
              <Link to="/home" className="mt-2 block text-sm font-bold text-charcoal/60">
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
