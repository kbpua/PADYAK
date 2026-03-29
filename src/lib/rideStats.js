/** Parse trip row distance like "4.2 km" or "3.2 km" → kilometers */
export function parseDistanceKm(distanceStr) {
  if (typeof distanceStr !== 'string') return 0
  const m = distanceStr.match(/([\d.]+)/)
  if (!m) return 0
  const n = Number.parseFloat(m[1])
  return Number.isFinite(n) ? n : 0
}

/** Same ballpark as demo profile: 2.4 kg CO₂ over 18.5 km */
export const CO2_KG_PER_KM = 2.4 / 18.5

export function renterStatsFromRideHistory(rideHistory) {
  const list = Array.isArray(rideHistory) ? rideHistory : []
  const rides = list.length
  const kmRaw = list.reduce((sum, t) => sum + parseDistanceKm(t.distance), 0)
  const km = Number(kmRaw.toFixed(1))
  const co2 = rides === 0 ? 0 : Number((kmRaw * CO2_KG_PER_KM).toFixed(1))
  return { rides, km, co2 }
}

/** Count trips in the last `days` days if `recordedAt` ISO exists on rows */
export function recentRidesCount(rideHistory, days = 7) {
  const list = Array.isArray(rideHistory) ? rideHistory : []
  const cutoff = Date.now() - days * 86400000
  return list.filter((t) => t.recordedAt && new Date(t.recordedAt).getTime() >= cutoff).length
}

/** km + CO₂ for trips in the last `days` days (requires recordedAt on rows) */
export function renterStatsForRecentDays(rideHistory, days = 7) {
  const list = Array.isArray(rideHistory) ? rideHistory : []
  const cutoff = Date.now() - days * 86400000
  const slice = list.filter((t) => t.recordedAt && new Date(t.recordedAt).getTime() >= cutoff)
  const rides = slice.length
  if (rides === 0) return null
  const kmRaw = slice.reduce((sum, t) => sum + parseDistanceKm(t.distance), 0)
  const km = Number(kmRaw.toFixed(1))
  const co2 = Number((kmRaw * CO2_KG_PER_KM).toFixed(1))
  return { rides, km, co2 }
}

export function ownerStatsFromBikes(allBikes, userName) {
  const name = String(userName ?? '').trim()
  if (!name) return { bikes: 0, rentals: 0, earnedPesos: 0 }
  const owned = (Array.isArray(allBikes) ? allBikes : []).filter(
    (b) => String(b.owner?.name ?? '').trim() === name,
  )
  const bikes = owned.length
  const rentals = owned.reduce((sum, b) => sum + (Number(b.totalRentals) || 0), 0)
  const earnedPesos = Math.round(
    owned.reduce(
      (sum, b) => sum + (Number(b.totalRentals) || 0) * (Number(b.pricePerHour) || 0) * 2,
      0,
    ),
  )
  return { bikes, rentals, earnedPesos }
}
