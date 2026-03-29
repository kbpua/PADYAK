import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Bike, Heart, MessageCircle } from 'lucide-react'
import { GreenRouteCard } from '../components/bike/GreenRouteCard'
import { LateReturnRateNotice } from '../components/bike/LateReturnRateNotice'
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

  const reviewsSection = (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5 lg:p-4 xl:p-5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="font-heading text-sm font-bold text-charcoal lg:text-[13px] xl:text-base">Reviews</h3>
        <span className="text-sm font-bold text-charcoal lg:text-[13px] xl:text-base">
          ★ {avg}{' '}
          <span className="text-xs font-normal text-charcoal/50">({reviews.length})</span>
        </span>
      </div>
      <div
        className={`mt-3 space-y-3 pr-0.5 lg:mt-3 xl:space-y-4 ${
          reviews.length > 2
            ? 'max-h-[12.5rem] overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] sm:max-h-[13rem] lg:max-h-[13.25rem] xl:max-h-[14rem]'
            : ''
        }`}
        role={reviews.length > 2 ? 'region' : undefined}
        aria-label={reviews.length > 2 ? 'Reviews — two visible, scroll for more' : undefined}
      >
        {reviews.map((r) => (
          <div key={r.id} className="border-t border-charcoal/5 pt-3 first:border-0 first:pt-0 xl:pt-4">
            <div className="flex gap-2.5 xl:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal/10 text-[11px] font-bold xl:h-9 xl:w-9 xl:text-xs">
                {r.author[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-charcoal lg:text-sm xl:text-base">{r.author}</p>
                <div className="mt-0.5">
                  <RatingStars value={r.rating} size={11} />
                </div>
                <p className="mt-0.5 text-[10px] text-charcoal/45 lg:text-[11px]">{r.date}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal/75 lg:text-sm xl:text-base">{r.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-heading text-2xl font-extrabold tracking-tight text-primary lg:text-3xl xl:text-4xl">
            ₱{bike.pricePerDay}/day
          </span>
          <span className="text-lg font-normal text-charcoal/25 lg:text-xl" aria-hidden>
            ·
          </span>
          <span className="font-heading text-lg font-bold text-orange-600 lg:text-2xl">
            ₱{bike.pricePerHour}/hr
          </span>
        </div>
        <div className="mt-4">
          <LateReturnRateNotice pricePerHour={bike.pricePerHour} variant="card" />
        </div>
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

      <div className="lg:hidden">{reviewsSection}</div>

      <AvailabilityCalendar bike={bike} selected={slot} onSelect={setSlot} />
    </>
  )

  const bookBar = (
    <div className="fixed bottom-0 left-0 right-0 z-30 min-w-0 rounded-t-2xl border-t border-charcoal/10 bg-white/95 px-4 pt-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-lg max-lg:pb-[calc(5.375rem+env(safe-area-inset-bottom,0px))] sm:pt-3 lg:static lg:bottom-auto lg:z-0 lg:w-full lg:max-w-full lg:rounded-2xl lg:border lg:p-5 lg:shadow-lg lg:shadow-charcoal/5 xl:p-6">
      <div className="mx-auto flex w-full min-w-0 max-w-lg flex-col gap-2 sm:max-w-none">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:max-w-none lg:flex-row lg:items-center lg:justify-between lg:gap-6 xl:gap-8">
          <div className="min-w-0 shrink-0 leading-none">
            <p className="text-[11px] text-charcoal/50 sm:text-xs lg:text-sm">From</p>
            <p className="font-mono-data text-base font-bold tabular-nums text-primary sm:text-lg lg:text-2xl lg:whitespace-nowrap">
              ₱{bike.pricePerDay}/day
            </p>
            <p
              className="mt-0.5 font-mono-data text-xs font-semibold tabular-nums text-orange-600 sm:text-sm lg:whitespace-nowrap"
              title="Per hour after your booked return time"
            >
              ₱{bike.pricePerHour}/hr if late
            </p>
          </div>
          <div className="flex min-w-0 w-full flex-row items-stretch justify-stretch gap-2 sm:gap-3 lg:min-w-0 lg:flex-1 lg:items-center lg:justify-end">
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
        <div className="lg:hidden">
          <LateReturnRateNotice pricePerHour={bike.pricePerHour} variant="compact" />
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
            <div className="hidden min-w-0 space-y-5 lg:block xl:space-y-6">
              <GreenRouteCard />
              {reviewsSection}
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
