/**
 * Daily rate for browse cards / map (uses listing day price, or ~6× hourly if missing).
 * @param {{ pricePerDay?: number; pricePerHour?: number } | null | undefined} bike
 * @returns {number | null}
 */
export function effectiveDailyRatePesos(bike) {
  const d = Number(bike?.pricePerDay)
  if (Number.isFinite(d) && d > 0) return d
  const h = Number(bike?.pricePerHour)
  if (Number.isFinite(h) && h > 0) return Math.max(1, Math.round(h * 6))
  return null
}
