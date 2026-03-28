import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Bike, Heart, MessageCircle } from 'lucide-react'
import { GreenRouteCard } from '../components/bike/GreenRouteCard'
import { AvailabilityCalendar } from '../components/bike/AvailabilityCalendar'
import { RatingStars } from '../components/common/RatingStars'
import { PillBadge } from '../components/common/PillBadge'
import { useApp } from '../context/AppContext'
import { useMessages } from '../context/MessagesContext'
import { defaultBookableSlotId, formatSlotLabel } from '../lib/bikeAvailability'

export function BikeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setBookingDraft, getBikeById, getReviewsForBikeMerged } = useApp()
  const { ensureChatForBike } = useMessages()
  const bike = getBikeById(id)
  const [fav, setFav] = useState(false)
  const [slot, setSlot] = useState(null)

  const reviews = useMemo(
    () => (bike ? getReviewsForBikeMerged(bike.id) : []),
    [bike, getReviewsForBikeMerged],
  )
  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : bike?.rating

  if (!bike) {
    return (
      <div className="p-8 text-center">
        <p className="text-charcoal/60">Bike not found.</p>
        <Link to="/home" className="mt-4 inline-block font-bold text-primary">
          Back home
        </Link>
      </div>
    )
  }

  const book = () => {
    const slotId = slot ?? defaultBookableSlotId(bike)
    setBookingDraft({
      bike,
      slot: formatSlotLabel(slotId),
      dateLabel: 'Wed, Apr 1, 2026',
      duration: '2 hours',
      pickup: `${bike.location.barangay}, ${bike.location.city}`,
      rental: bike.pricePerHour * 2,
      serviceFee: 5,
    })
    navigate('/booking/confirm')
  }

  const messageOwner = () => {
    const chatId = ensureChatForBike(bike, {
      date: slot ? formatSlotLabel(slot) : 'TBD',
      time: slot ? 'Pickup slot selected — confirm with owner' : 'No slot selected yet',
      status: 'pending',
    })
    navigate(`/messages/${chatId}`)
  }

  const heroPhoto = bike.photos?.[0]

  const hero = (
    <div className="relative">
      <div
        className="relative flex h-56 items-center justify-center overflow-hidden lg:min-h-[420px] lg:rounded-3xl"
        style={{ backgroundColor: bike.color }}
      >
        {heroPhoto ? (
          <img src={heroPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Bike className="h-24 w-24 text-white/95 lg:h-32 lg:w-32" strokeWidth={1} />
        )}
      </div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition active:scale-95 lg:left-6 lg:top-6 lg:h-11 lg:w-11"
        aria-label="Back"
      >
        <ArrowLeft className="h-5 w-5 text-charcoal" />
      </button>
      <button
        type="button"
        onClick={() => setFav(!fav)}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition active:scale-95 lg:right-6 lg:top-6 lg:h-11 lg:w-11"
        aria-label="Favorite"
      >
        <Heart
          className={`h-5 w-5 ${fav ? 'fill-red-500 text-red-500' : 'text-charcoal'}`}
        />
      </button>
      <PillBadge
        className="absolute bottom-4 left-4 bg-white/95 text-charcoal shadow-md lg:bottom-6 lg:left-6"
        variant="neutral"
      >
        {bike.type}
      </PillBadge>
    </div>
  )

  const detailBlocks = (
    <>
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-charcoal lg:text-3xl xl:text-4xl">
          {bike.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            {bike.owner.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </span>
          <div className="min-w-[200px] flex-1">
            <p className="text-sm font-semibold text-charcoal lg:text-base">
              Owned by {bike.owner.name}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal/60 lg:text-sm">
              <RatingStars value={bike.owner.rating} size={12} />
              <span>{bike.owner.rating}</span>
              {bike.owner.verified && (
                <span className="inline-flex items-center gap-0.5 font-bold text-primary">
                  <BadgeCheck className="h-4 w-4" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-charcoal/70 lg:text-base">
          📍 {bike.location.barangay}, {bike.location.city} — {bike.location.distance} away
        </p>
        <p className="mt-2 font-heading text-2xl font-bold text-primary lg:text-3xl">
          ₱{bike.pricePerHour}/hr · ₱{bike.pricePerDay}/day
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
        {[
          { label: 'Condition', value: bike.condition, c: 'bg-primary/15 text-primary' },
          { label: 'Type', value: `${bike.type} Bike`, c: 'bg-teal/15 text-teal' },
          { label: 'Gears', value: bike.gears, c: 'bg-accent/15 text-amber-900' },
          { label: 'Frame', value: bike.frameSize, c: 'bg-charcoal/10 text-charcoal' },
        ].map((x) => (
          <div key={x.label} className={`rounded-2xl px-3 py-3 text-center ${x.c} lg:py-4`}>
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{x.label}</p>
            <p className="mt-1 font-heading text-sm font-bold lg:text-base">{x.value}</p>
          </div>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-charcoal/75 lg:text-base">{bike.description}</p>

      {bike.listingMeta?.availabilitySummary && (
        <p className="rounded-xl bg-primary/5 px-4 py-3 text-sm text-charcoal/80 ring-1 ring-primary/15">
          <span className="font-bold text-charcoal">Pickup windows · </span>
          {bike.listingMeta.availabilitySummary}
        </p>
      )}

      <div className="lg:hidden">
        <GreenRouteCard />
      </div>

      <AvailabilityCalendar bike={bike} selected={slot} onSelect={setSlot} />

      <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5 lg:p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-charcoal lg:text-base">Reviews</h3>
          <span className="text-sm font-bold text-charcoal lg:text-base">
            ★ {avg}{' '}
            <span className="text-xs font-normal text-charcoal/50">({reviews.length})</span>
          </span>
        </div>
        <div className="mt-4 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-t border-charcoal/5 pt-4 first:border-0 first:pt-0">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal/10 text-xs font-bold">
                  {r.author[0]}
                </span>
                <div>
                  <p className="text-sm font-bold text-charcoal lg:text-base">{r.author}</p>
                  <p className="text-[11px] text-charcoal/45">{r.date}</p>
                </div>
                <span className="ml-auto">
                  <RatingStars value={r.rating} size={11} />
                </span>
              </div>
              <p className="mt-2 text-sm text-charcoal/75 lg:text-base">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  const bookBar = (
    <div className="fixed bottom-0 left-0 right-0 z-30 min-w-0 rounded-t-2xl border-t border-charcoal/10 bg-white/95 px-4 pt-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-lg max-lg:pb-[calc(5.375rem+env(safe-area-inset-bottom,0px))] sm:pt-3 lg:static lg:bottom-auto lg:z-0 lg:w-full lg:max-w-full lg:rounded-2xl lg:border lg:p-5 lg:shadow-lg lg:shadow-charcoal/5 xl:p-6">
      <div className="mx-auto flex w-full min-w-0 max-w-lg flex-col gap-2 sm:max-w-none lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-x-4">
        <div className="shrink-0 leading-none lg:justify-self-start">
          <p className="text-[11px] text-charcoal/50 sm:text-xs lg:text-sm">From</p>
          <p className="font-mono-data text-base font-bold text-primary sm:text-lg lg:text-2xl">₱{bike.pricePerHour}/hr</p>
        </div>
        <div className="flex min-w-0 w-full flex-row items-stretch justify-center gap-2 lg:w-auto lg:max-w-full lg:justify-center">
          <button
            type="button"
            onClick={messageOwner}
            aria-label="Message owner"
            className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-charcoal/15 bg-white px-2.5 py-2 text-center font-heading text-xs font-bold leading-tight text-charcoal transition active:scale-[0.98] sm:min-h-12 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm lg:min-w-[11rem] lg:flex-none lg:px-6"
          >
            <MessageCircle className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" strokeWidth={2} />
            <span className="min-w-0 text-center leading-tight">Message Owner</span>
          </button>
          <button
            type="button"
            onClick={book}
            aria-label="Book this ride"
            className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-transparent bg-primary px-2.5 py-2 text-center font-heading text-xs font-bold leading-tight text-white shadow-md shadow-primary/20 transition active:scale-[0.98] sm:min-h-12 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm sm:shadow-lg sm:shadow-primary/25 lg:min-w-[11rem] lg:flex-none lg:px-6"
          >
            <span className="min-w-0 text-center leading-tight">Book This Ride</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="pb-[calc(12rem+env(safe-area-inset-bottom,0px))] lg:mx-auto lg:max-w-7xl lg:pb-10 lg:px-4 xl:max-w-[1400px] xl:px-10 2xl:px-14">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12 2xl:gap-14">
        <div className="min-w-0 lg:col-span-5 xl:col-span-5">
          <div className="lg:sticky lg:top-6 lg:space-y-6">
            {hero}
            <div className="hidden lg:block">
              <GreenRouteCard />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col lg:col-span-7 xl:col-span-7">
          <div className="space-y-5 px-4 pt-5 lg:px-0 lg:pt-2">{detailBlocks}</div>
          <div className="mt-6 min-w-0 px-4 pb-4 lg:mt-8 lg:px-0 lg:pb-0">{bookBar}</div>
        </div>
      </div>
    </div>
  )
}
