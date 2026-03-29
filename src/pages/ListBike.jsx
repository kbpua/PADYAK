import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, ChevronRight, MapPin, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LateReturnRateNotice } from '../components/bike/LateReturnRateNotice'
import { useApp } from '../context/AppContext'
import { DAY_KEYS } from '../lib/bikeAvailability'

const steps = ['Photos', 'Details', 'Pricing', 'Availability', 'Location']

/** One line per step — what to do right now */
const stepGuidance = [
  'Add at least one photo from your device (tap the dashed box). Clear shots of the whole bike help renters decide faster.',
  'Give your listing a name renters will recognize, then choose type, condition, gears, and frame size. Add a short honest description.',
  'Set your hourly and daily rates in pesos. Daily should usually be higher than a single hour — use the suggestion if it helps.',
  'Tap days you can usually hand off the bike, then pick a typical time window. You can refine this with renters in chat later.',
  'Type a landmark or street near where you meet renters, or use “my area” for a quick demo pin on the map.',
]

const LISTING_COLORS = ['#22C55E', '#14B8A6', '#3B82F6', '#F59E0B', '#A855F7', '#EC4899']

const TIME_WINDOWS = [
  { id: '7-9a', label: '7–9 AM' },
  { id: '9-12p', label: '9 AM–12 PM' },
  { id: '12-4p', label: '12–4 PM' },
  { id: '4-7p', label: '4–7 PM' },
]

const initialForm = () => ({
  photos: [],
  name: '',
  type: 'City',
  condition: 'Excellent',
  gears: '7-speed',
  frame: 'Medium',
  desc: '',
  hourly: '',
  daily: '',
  daysAvailable: DAY_KEYS.reduce((acc, d) => ({ ...acc, [d]: true }), {}),
  timeWindow: TIME_WINDOWS[0].id,
  pickupAddress: '',
  lat: null,
  lng: null,
})

function readImagesAsDataUrls(files, max = 5) {
  const slice = Array.from(files || []).slice(0, max)
  return Promise.all(
    slice.map(
      (file) =>
        new Promise((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            resolve(null)
            return
          }
          const r = new FileReader()
          r.onload = () => resolve(r.result)
          r.onerror = reject
          r.readAsDataURL(file)
        }),
    ),
  ).then((urls) => urls.filter(Boolean))
}

function mockGeocode(address, userBarangay) {
  const barangay = address.trim().slice(0, 48) || userBarangay
  return {
    barangay,
    city: 'Quezon City',
    distance: '—',
    lat: 14.648 + (Math.random() * 0.02 - 0.01),
    lng: 121.055 + (Math.random() * 0.03 - 0.015),
  }
}

function validateStep(step, form) {
  switch (step) {
    case 0:
      return form.photos.length ? null : 'Add at least one photo.'
    case 1:
      if (!form.name.trim()) return 'Enter a bike name.'
      if (form.desc.trim().length < 12) return 'Write a short description (12+ characters).'
      return null
    case 2: {
      const h = Number(form.hourly)
      const d = Number(form.daily)
      if (!form.hourly.trim() || Number.isNaN(h) || h < 1) return 'Enter a valid hourly rate (₱).'
      if (!form.daily.trim() || Number.isNaN(d) || d < 1) return 'Enter a valid daily rate (₱).'
      if (d < h) return 'Daily rate should be at least the hourly rate.'
      return null
    }
    case 3:
      return Object.values(form.daysAvailable).some(Boolean)
        ? null
        : 'Pick at least one day for pickup.'
    case 4:
      if (!form.pickupAddress.trim() || form.pickupAddress.trim().length < 3) {
        return 'Enter a pickup location or use current location.'
      }
      return null
    default:
      return null
  }
}

function buildListing(form, user, colorIndex, listingId) {
  const loc = mockGeocode(form.pickupAddress, user.barangay)
  const activeDays = DAY_KEYS.filter((d) => form.daysAvailable[d])
  const tw = TIME_WINDOWS.find((t) => t.id === form.timeWindow)?.label || form.timeWindow
  const summary = `${activeDays.join(', ')} · ${tw}`

  return {
    id: listingId,
    name: form.name.trim(),
    type: form.type,
    condition: form.condition,
    gears: form.gears,
    frameSize: form.frame,
    pricePerHour: Number(form.hourly),
    pricePerDay: Number(form.daily),
    owner: {
      name: user.name,
      avatar: null,
      rating: 5,
      verified: true,
    },
    location: {
      ...loc,
      lat: form.lat ?? loc.lat,
      lng: form.lng ?? loc.lng,
    },
    rating: 0,
    totalRentals: 0,
    description: form.desc.trim(),
    color: LISTING_COLORS[colorIndex % LISTING_COLORS.length],
    photos: form.photos,
    listingMeta: {
      availabilitySummary: summary,
      pickupNote: form.pickupAddress.trim(),
    },
    availability: {
      days: activeDays,
      timeWindowId: form.timeWindow,
    },
  }
}

export function ListBike() {
  const { user, addListedBike, listedBikes } = useApp()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [createdId, setCreatedId] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const update = useCallback((patch) => {
    setForm((f) => ({ ...f, ...patch }))
    setError(null)
  }, [])

  const toggleDay = (d) => {
    setForm((f) => ({
      ...f,
      daysAvailable: { ...f.daysAvailable, [d]: !f.daysAvailable[d] },
    }))
    setError(null)
  }

  const onPickPhotos = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    const urls = await readImagesAsDataUrls(files, 5 - form.photos.length)
    if (urls.length) update({ photos: [...form.photos, ...urls].slice(0, 5) })
    e.target.value = ''
  }

  const removePhoto = (i) => {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))
  }

  const useCurrentLocation = () => {
    const lat = 14.6538
    const lng = 121.0685
    update({
      lat,
      lng,
      pickupAddress: `Near ${user.barangay}, ${user.city}`,
    })
  }

  const next = () => {
    const err = validateStep(step, form)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    if (step < steps.length - 1) setStep((s) => s + 1)
    else {
      void (async () => {
        try {
          let publishForm = form
          if (publishForm.lat == null || publishForm.lng == null) {
            const loc = mockGeocode(publishForm.pickupAddress, user.barangay)
            publishForm = { ...publishForm, lat: loc.lat, lng: loc.lng }
          }
          const tempId = `listed-${Date.now()}`
          const bike = buildListing(publishForm, user, listedBikes.length, tempId)
          const saved = await addListedBike(bike)
          setCreatedId(String(saved?.id ?? tempId))
          setDone(true)
        } catch (e) {
          console.error(e)
          setError('Something went wrong publishing. Please try again.')
        }
      })()
    }
  }

  const back = () => {
    if (step > 0) {
      setStep((s) => s - 1)
      setError(null)
    }
  }

  const suggestedDaily = form.hourly ? Math.max(1, Math.round(Number(form.hourly) * 6)) : ''

  if (done && createdId) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-8 pb-24 text-center lg:mx-auto lg:max-w-xl lg:pb-10 xl:max-w-2xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl"
        >
          🚲
        </motion.div>
        <h1 className="font-heading text-2xl font-extrabold text-charcoal">Your bike is live!</h1>
        <p className="max-w-sm text-sm text-charcoal/65">
          It appears on the map and in Explore. Renters can message you or book when you enable slots.
        </p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Link
            to={`/bike/${createdId}`}
            className="rounded-full bg-primary py-4 text-center font-heading font-bold text-white shadow-lg shadow-primary/25"
          >
            View listing
          </Link>
          <Link
            to="/explore"
            className="rounded-full border-2 border-charcoal/15 py-3.5 text-center font-heading text-sm font-bold text-charcoal"
          >
            See it on the map
          </Link>
          <Link to="/home" className="text-center text-sm font-bold text-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const aiHint =
    form.hourly && Number(form.hourly) > 0
      ? `Tip: many hosts near ${user.barangay} list around ₱${Math.round(Number(form.hourly) * 0.9)}–${Math.round(Number(form.hourly) * 1.15)}/hr.`
      : 'AI suggestion: try ₱20–35/hr near UP Campus for city bikes.'

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-4 lg:max-w-2xl lg:px-5 lg:pb-8 lg:pt-3 xl:max-w-3xl xl:px-6">
      <div className="lg:rounded-2xl lg:bg-white lg:p-5 lg:shadow-md lg:ring-1 lg:ring-charcoal/5 xl:p-6">
        <div className="mb-4 flex items-start justify-between gap-3 lg:mb-3">
          <div className="min-w-0">
            <h1 className="font-heading text-lg font-extrabold text-charcoal lg:text-xl xl:text-2xl">List your bike</h1>
            <p className="mt-1.5 text-sm leading-snug text-charcoal/55 lg:mt-1 lg:max-w-xl lg:text-[13px] lg:leading-snug">
              Put your bike on Padyak so nearby renters can discover it, see your rates, and message you to book. You
              stay in control of pickup details and availability.
            </p>
          </div>
          <span
            className="shrink-0 rounded-full bg-charcoal/10 px-2.5 py-1 text-[11px] font-bold tabular-nums text-charcoal/60 lg:px-3 lg:py-1.5 lg:text-xs"
            aria-label={`Step ${step + 1} of ${steps.length}`}
          >
            {step + 1}/{steps.length}
          </span>
        </div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-charcoal/10 lg:mb-3 lg:h-1.5">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="mb-4 flex flex-wrap justify-between gap-x-1 gap-y-1.5 text-[10px] font-bold uppercase tracking-wide text-charcoal/40 lg:mb-3 lg:justify-start lg:gap-3 lg:text-[10px]">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`inline-flex items-baseline gap-1 ${i === step ? 'text-primary' : ''}`}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className="font-mono-data tabular-nums opacity-70">{i + 1}</span>
              <span>{s}</span>
            </span>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-500/20 lg:mb-4 lg:py-2.5 lg:text-sm">
            {error}
          </p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="min-h-[280px] space-y-3 lg:min-h-0 lg:space-y-3"
          >
          <div className="rounded-xl bg-primary/[0.07] px-3.5 py-2.5 ring-1 ring-primary/15 lg:rounded-2xl lg:px-4 lg:py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-primary lg:text-[11px]">
              Step {step + 1} · {steps[step]}
            </p>
            <p className="mt-1 text-sm leading-snug text-charcoal/70 lg:text-[13px] lg:leading-snug">
              {stepGuidance[step]}
            </p>
          </div>

          {step === 0 && (
            <>
              <p className="text-sm font-medium text-charcoal/75 lg:text-[13px] lg:leading-snug">
                <span className="font-heading font-bold text-charcoal">What to do:</span> Tap{' '}
                <span className="whitespace-nowrap font-semibold text-charcoal">&quot;Choose photos&quot;</span> below
                to open your gallery or file picker. Add up to 5 (frame, tires, drivetrain).{' '}
                <span className="font-bold text-red-600">*</span>
                <span className="sr-only"> Required: at least one photo.</span>
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onPickPhotos}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal/20 py-10 text-charcoal/50 transition hover:border-primary/40 hover:bg-primary/5 lg:min-h-[148px] lg:gap-2 lg:py-8"
              >
                <Camera className="h-9 w-9 lg:h-8 lg:w-8" />
                <span className="text-sm font-semibold text-charcoal/80 lg:text-sm">Choose photos</span>
                <span className="max-w-[240px] text-center text-xs leading-snug text-charcoal/45 lg:max-w-sm lg:text-[11px]">
                  Opens your device&apos;s photo picker · JPEG or PNG · up to 5 images
                </span>
              </button>
              {form.photos.length > 0 && (
                <>
                  <p className="text-xs text-charcoal/50 lg:text-[11px]">
                    Tap <span className="font-semibold text-charcoal/65">✕</span> on a thumbnail to remove it. Add more
                    until you&apos;re happy (max 5).
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:max-w-xl">
                    {form.photos.map((src, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-charcoal/10">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal/80 text-white shadow-md"
                          aria-label="Remove photo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm font-medium text-charcoal/75 lg:text-[13px] lg:leading-snug">
                <span className="font-heading font-bold text-charcoal">Tip:</span> Match the name on your frame or
                receipt so renters can search for it.
              </p>
              <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-bold uppercase text-charcoal/45 lg:text-[11px]">
                    Bike name <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="e.g. Trek Marlin 5"
                    className="mt-1 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 lg:py-2 lg:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal/45 lg:text-[11px]">
                    Type <span className="font-normal normal-case text-charcoal/40">(bike style)</span>
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => update({ type: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm focus:border-primary focus:outline-none lg:py-2 lg:text-sm"
                  >
                {['City', 'Mountain', 'Road', 'Folding'].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal/45">Condition</label>
                  <select
                    value={form.condition}
                    onChange={(e) => update({ condition: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm"
                  >
                    {['Excellent', 'Very Good', 'Good', 'Fair'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal/45">Gears</label>
                  <select
                    value={form.gears}
                    onChange={(e) => update({ gears: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm"
                  >
                    {['Single', '3-speed', '7-speed', '21-speed', '24-speed'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal/45">Frame</label>
                  <select
                    value={form.frame}
                    onChange={(e) => update({ frame: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm"
                  >
                    {['Small', 'Medium', 'Large', 'XL'].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="block text-xs font-bold uppercase text-charcoal/45 lg:text-[11px]">
                Description <span className="text-red-600">*</span>
              </label>
              <p className="mt-1 text-xs text-charcoal/50 lg:text-[11px]">
                Minimum <span className="font-semibold text-charcoal/65">12 characters</span> — include condition,
                accessories, lock policy, or pickup tips.
              </p>
              <textarea
                value={form.desc}
                onChange={(e) => update({ desc: e.target.value })}
                rows={4}
                placeholder="Condition, accessories, lock policy, pickup tips…"
                className="mt-1 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 lg:min-h-[96px] lg:py-2 lg:text-sm"
              />
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-charcoal/65 lg:text-[13px] lg:leading-snug">
                Renters compare prices here — both fields are required. Your daily rate should cover a full day, not
                just one hour.
              </p>
              <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal/45 lg:text-[11px]">
                    Hourly (₱) <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-1 flex rounded-xl border border-charcoal/15 focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="flex items-center px-3 font-mono-data font-bold text-charcoal/50 lg:text-base">
                      ₱
                    </span>
                    <input
                      type="number"
                      min={1}
                      inputMode="decimal"
                      value={form.hourly}
                      onChange={(e) => update({ hourly: e.target.value })}
                      placeholder="25"
                      className="w-full py-2.5 pr-3 text-sm focus:outline-none lg:py-2 lg:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal/45 lg:text-[11px]">
                    Daily (₱) <span className="text-red-600">*</span>
                  </label>
                  <div className="mt-1 flex rounded-xl border border-charcoal/15 focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="flex items-center px-3 font-mono-data font-bold text-charcoal/50 lg:text-base">
                      ₱
                    </span>
                    <input
                      type="number"
                      min={1}
                      inputMode="decimal"
                      value={form.daily}
                      onChange={(e) => update({ daily: e.target.value })}
                      placeholder={suggestedDaily ? String(suggestedDaily) : '150'}
                      className="w-full py-2.5 pr-3 text-sm focus:outline-none lg:py-2 lg:text-sm"
                    />
                  </div>
                </div>
              </div>
              {form.hourly && Number(form.hourly) > 0 ? (
                <LateReturnRateNotice pricePerHour={Number(form.hourly)} variant="host" />
              ) : null}
              <button
                type="button"
                onClick={() => suggestedDaily && update({ daily: String(suggestedDaily) })}
                className="text-xs font-bold text-primary underline disabled:opacity-40"
                disabled={!suggestedDaily}
              >
                Use suggested daily (~6× hourly)
              </button>
              <p className="rounded-xl bg-primary/10 px-3 py-2.5 text-xs font-semibold text-primary ring-1 ring-primary/20 lg:text-[11px] lg:leading-snug">
                {aiHint}
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm font-medium text-charcoal/75 lg:text-[13px] lg:leading-snug">
                <span className="font-heading font-bold text-charcoal">Tap a day</span> to toggle it on (green) or off
                (gray). You need at least one day. Then choose the usual handoff time band.{' '}
                <span className="font-bold text-red-600">*</span>
                <span className="sr-only"> At least one day required.</span>
              </p>
              <div className="grid grid-cols-7 gap-1.5 lg:max-w-xl lg:gap-2">
                {DAY_KEYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`rounded-lg py-2.5 text-[11px] font-bold transition active:scale-[0.98] lg:py-2.5 lg:text-[11px] ${
                      form.daysAvailable[d]
                        ? 'bg-primary text-white shadow-md shadow-primary/25 ring-1 ring-primary/30'
                        : 'bg-charcoal/5 text-charcoal/40 ring-1 ring-charcoal/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <label className="block text-xs font-bold uppercase text-charcoal/45">
                Typical pickup window <span className="font-normal normal-case text-charcoal/40">(when you&apos;re free)</span>
              </label>
              <select
                value={form.timeWindow}
                onChange={(e) => update({ timeWindow: e.target.value })}
                className="w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm lg:py-2 lg:text-sm"
              >
                {TIME_WINDOWS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-sm text-charcoal/65 lg:text-[13px] lg:leading-snug">
                Renters see this on the listing. Be specific enough to find you (gate, building, street corner). The
                map uses this text when you publish.
              </p>
              <label className="block text-xs font-bold uppercase text-charcoal/45 lg:text-[11px]">
                Pickup address or landmark <span className="text-red-600">*</span>
              </label>
              <input
                value={form.pickupAddress}
                onChange={(e) => update({ pickupAddress: e.target.value })}
                placeholder="e.g. Near Vinzons Hall, UP Diliman"
                className="mt-1 w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 lg:max-w-xl lg:py-2 lg:text-sm"
              />
              <p className="mt-1.5 text-xs text-charcoal/50 lg:text-[11px]">
                Map position is set automatically from your address when you publish, or use the button below for a
                quick demo location.
              </p>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="flex w-full min-h-[48px] max-w-xl items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-3 font-heading text-sm font-bold text-white shadow-md transition hover:bg-charcoal/90 active:scale-[0.99] lg:min-h-[44px] lg:py-2.5 lg:text-sm"
              >
                <MapPin className="h-5 w-5 shrink-0" strokeWidth={2} />
                <span className="text-balance">Use my area (demo GPS)</span>
              </button>
            </>
          )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-[calc(5.375rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-50 flex gap-3 border-t border-charcoal/10 bg-white/95 px-4 py-2.5 shadow-[0_-1px_0_rgba(15,23,42,0.06)] backdrop-blur-lg lg:static lg:z-0 lg:mx-auto lg:mt-5 lg:flex lg:max-w-2xl lg:items-center lg:justify-between lg:rounded-xl lg:border lg:border-charcoal/10 lg:bg-white lg:px-5 lg:py-3 lg:shadow-md xl:max-w-3xl xl:px-6">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          title={step === 0 ? 'You are on the first step' : undefined}
          className="rounded-xl px-4 py-2.5 text-sm font-bold text-charcoal/50 disabled:opacity-30 lg:px-5 lg:py-2 lg:text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          className="flex flex-1 items-center justify-center gap-2 text-balance rounded-full bg-primary py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-primary/25 active:scale-[0.98] lg:max-w-[220px] lg:flex-none lg:px-6 lg:py-2.5 lg:text-sm"
        >
          {step === steps.length - 1
            ? 'Publish listing'
            : `Continue to ${steps[step + 1]}`}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
