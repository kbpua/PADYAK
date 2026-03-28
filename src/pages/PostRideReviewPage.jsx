import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bike, CheckCircle2 } from 'lucide-react'
import { RatingStarsInput } from '../components/common/RatingStars'
import { useApp } from '../context/AppContext'

export function PostRideReviewPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addBikeReview, getBikeById, user } = useApp()
  const booking = location.state?.booking
  const bikeIdRaw = booking?.bike?.id
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (bikeIdRaw === undefined || bikeIdRaw === null || bikeIdRaw === '') {
      navigate('/home', { replace: true })
    }
  }, [bikeIdRaw, navigate])

  if (!booking?.bike || bikeIdRaw === undefined || bikeIdRaw === null || bikeIdRaw === '') {
    return null
  }

  const bike = getBikeById(booking.bike.id) ?? booking.bike

  const submit = async (e) => {
    e.preventDefault()
    if (rating < 1) {
      setError('Choose a rating from 1 to 5 stars.')
      return
    }
    if (text.trim().length < 10) {
      setError('Write at least a short note (10+ characters).')
      return
    }
    try {
      await addBikeReview({ bikeId: bike.id, rating, text, author: user.name })
      setDone(true)
      window.setTimeout(() => navigate(`/bike/${bike.id}`), 1400)
    } catch (err) {
      console.error(err)
      setError('Could not save your review. Check your connection and try again.')
    }
  }

  const skip = () => {
    navigate('/home')
  }

  return (
    <div className="mx-auto min-h-svh max-w-lg px-4 pb-28 pt-8 lg:max-w-xl lg:pb-12 lg:pt-10">
      <p className="text-center text-xs font-bold uppercase tracking-wider text-charcoal/45">
        Ride complete
      </p>
      <h1 className="mt-2 text-center font-heading text-xl font-extrabold text-charcoal lg:text-2xl">
        How was your trip?
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-charcoal/55">
        Your feedback helps other riders and keeps hosts accountable.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-charcoal/5">
        <div className="flex gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: bike.color || '#22C55E' }}
          >
            <Bike className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-charcoal">{bike.name}</p>
            {booking.dateLabel && (
              <p className="text-xs text-charcoal/50">{booking.dateLabel}</p>
            )}
            {booking.slot && (
              <p className="text-xs text-charcoal/50">
                {booking.slot}
                {booking.duration ? ` · ${booking.duration}` : ''}
              </p>
            )}
          </div>
        </div>

        {done ? (
          <div className="mt-6 flex flex-col items-center gap-2 py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={2} />
            <p className="font-heading font-bold text-charcoal">Thanks for your review!</p>
            <p className="text-sm text-charcoal/55">Taking you to the bike page…</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">Rate this bike</p>
              <p className="mt-1 text-xs text-charcoal/55">Posting as {user.name}</p>
              <div className="mt-3 flex justify-center sm:justify-start">
                <RatingStarsInput value={rating} onChange={setRating} />
              </div>
            </div>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-charcoal/50">
                Your review
              </span>
              <textarea
                value={text}
                onChange={(ev) => {
                  setText(ev.target.value)
                  setError(null)
                }}
                rows={4}
                maxLength={800}
                placeholder="How was the bike and handoff?"
                className="mt-2 w-full resize-y rounded-xl border border-charcoal/10 bg-surface px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            </label>
            {error && <p className="text-xs font-medium text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 transition active:scale-[0.98]"
            >
              Post review
            </button>
            <button
              type="button"
              onClick={skip}
              className="w-full rounded-full border-2 border-charcoal/10 py-3 font-heading text-sm font-bold text-charcoal/70 transition active:scale-[0.98]"
            >
              Skip for now
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-charcoal/45">
        <Link to="/home" className="font-bold text-primary">
          Back to home
        </Link>
      </p>
    </div>
  )
}
