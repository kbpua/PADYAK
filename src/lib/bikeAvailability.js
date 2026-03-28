/** 1-hour pickup rows shown on the bike detail calendar (start hour, 24h clock). */
export const AVAILABILITY_SLOT_ROWS = [
  { hour: 8, label: '8:00 AM', legacyKey: '8a' },
  { hour: 10, label: '10:00 AM', legacyKey: '10a' },
  { hour: 12, label: '12:00 PM', legacyKey: '12p' },
  { hour: 14, label: '2:00 PM', legacyKey: '2p' },
  { hour: 16, label: '4:00 PM', legacyKey: '4p' },
  { hour: 18, label: '6:00 PM', legacyKey: '6p' },
]

export const DAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Listing "typical pickup window" → inclusive start hour, exclusive end hour. */
export const PICKUP_WINDOW_HOURS = {
  '7-9a': { start: 7, end: 9 },
  '9-12p': { start: 9, end: 12 },
  '12-4p': { start: 12, end: 16 },
  '4-7p': { start: 16, end: 19 },
}

export function hourFitsPickupWindow(hour, timeWindowId) {
  const w = PICKUP_WINDOW_HOURS[timeWindowId]
  if (!w) return true
  return hour >= w.start && hour < w.end
}

/** @type {Record<string, 'booked' | 'pending'>} — demo-only, seed bikes */
export const SEED_SLOT_OVERRIDES = {
  'Mon-8': 'booked',
  'Tue-14': 'pending',
  'Thu-16': 'booked',
}

/**
 * @param {object} bike
 * @param {string} day
 * @param {number} hour - row start hour (e.g. 8 for 8:00 AM)
 * @returns {'available' | 'booked' | 'pending' | 'off'}
 */
export function getAvailabilityCellState(bike, day, hour) {
  const av = bike?.availability
  const slotKey = `${day}-${hour}`

  if (av?.days?.length && av?.timeWindowId) {
    if (!av.days.includes(day)) return 'off'
    if (!hourFitsPickupWindow(hour, av.timeWindowId)) return 'off'
    return 'available'
  }

  const override = SEED_SLOT_OVERRIDES[slotKey]
  if (override) return override
  return 'available'
}

/** Slot id used in booking draft: "Wed-10" */
export function makeSlotId(day, hour) {
  return `${day}-${hour}`
}

export function parseSlotId(id) {
  if (!id || typeof id !== 'string') return null
  const i = id.lastIndexOf('-')
  if (i <= 0) return null
  const day = id.slice(0, i)
  const hour = Number(id.slice(i + 1))
  if (!DAY_KEYS.includes(day) || Number.isNaN(hour)) return null
  return { day, hour }
}

export function formatSlotLabel(slotId) {
  const p = parseSlotId(slotId)
  if (!p) return slotId
  const row = AVAILABILITY_SLOT_ROWS.find((r) => r.hour === p.hour)
  return `${p.day} ${row?.label ?? `${p.hour}:00`}`
}

/** First calendar cell that is bookable (for default booking draft). */
export function defaultBookableSlotId(bike) {
  if (!bike) return 'Wed-10'
  for (const day of DAY_KEYS) {
    for (const { hour } of AVAILABILITY_SLOT_ROWS) {
      if (getAvailabilityCellState(bike, day, hour) === 'available') {
        return makeSlotId(day, hour)
      }
    }
  }
  return 'Wed-10'
}
