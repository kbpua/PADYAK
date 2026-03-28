import { supabase } from '../supabaseClient'

/** @param {Record<string, unknown>} row */
export function bikeListingRowToApp(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    condition: row.condition,
    gears: row.gears,
    frameSize: row.frame_size,
    pricePerHour: row.price_per_hour,
    pricePerDay: row.price_per_day,
    description: row.description,
    color: row.color,
    owner: row.owner_snapshot || {},
    location: row.location || {},
    rating: Number(row.rating) || 0,
    totalRentals: row.total_rentals ?? 0,
    photos: Array.isArray(row.photos) ? row.photos : [],
    listingMeta: row.listing_meta || {},
    availability: row.availability || {},
  }
}

/** @param {object} bike app-shaped listing @param {string} ownerId uuid */
export function appListingToRow(bike, ownerId) {
  return {
    owner_id: ownerId,
    name: bike.name,
    type: bike.type,
    condition: bike.condition,
    gears: bike.gears,
    frame_size: bike.frameSize,
    price_per_hour: bike.pricePerHour,
    price_per_day: bike.pricePerDay,
    description: bike.description,
    color: bike.color,
    location: bike.location || {},
    owner_snapshot: bike.owner || {},
    photos: bike.photos || [],
    listing_meta: bike.listingMeta || {},
    availability: bike.availability || {},
    rating: bike.rating ?? 0,
    total_rentals: bike.totalRentals ?? 0,
  }
}

export async function fetchBikeListings() {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('bike_listings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { data: [], error }
  return { data: (data || []).map(bikeListingRowToApp), error: null }
}

export async function insertBikeListing(bike, ownerId) {
  if (!supabase) return { data: null, error: new Error('No Supabase client') }
  const row = appListingToRow(bike, ownerId)
  const { data, error } = await supabase.from('bike_listings').insert(row).select('*').single()
  if (error) return { data: null, error }
  return { data: bikeListingRowToApp(data), error: null }
}

function formatReviewDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

/** @param {Record<string, unknown>} row */
export function reviewRowToApp(row) {
  return {
    id: row.id,
    bikeId: String(row.bike_id),
    author: row.author_name,
    date: formatReviewDate(row.created_at),
    rating: Number(row.rating),
    text: row.body,
    _createdAt: row.created_at,
  }
}

export async function fetchBikeReviews() {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase.from('bike_reviews').select('*').order('created_at', { ascending: false })
  if (error) return { data: [], error }
  return { data: (data || []).map(reviewRowToApp), error: null }
}

export async function insertBikeReview({ bikeId, userId, authorName, rating, text }) {
  if (!supabase) return { data: null, error: new Error('No Supabase client') }
  const { data, error } = await supabase
    .from('bike_reviews')
    .insert({
      bike_id: String(bikeId),
      user_id: userId,
      author_name: authorName,
      rating,
      body: text.trim(),
    })
    .select('*')
    .single()
  if (error) return { data: null, error }
  return { data: reviewRowToApp(data), error: null }
}

function formatKalsadaTime(iso) {
  if (!iso) return 'Just now'
  try {
    const d = new Date(iso)
    const now = Date.now()
    const diff = now - d.getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'Just now'
    if (h < 24) return `${h}h ago`
    const days = Math.floor(h / 24)
    if (days === 1) return '1d ago'
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return 'Recently'
  }
}

/** @param {Record<string, unknown>} row */
export function kalsadaRowToApp(row) {
  return {
    id: row.id,
    type: row.issue_type,
    location: row.location,
    severity: row.severity,
    description: row.description || '',
    upvotes: row.upvotes ?? 0,
    timestamp: formatKalsadaTime(row.created_at),
    _createdAt: row.created_at,
  }
}

export async function fetchKalsadaReports() {
  if (!supabase) return { data: [], error: null }
  const { data, error } = await supabase
    .from('kalsada_reports')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { data: [], error }
  return { data: (data || []).map(kalsadaRowToApp), error: null }
}

export async function insertKalsadaReport(report, userId) {
  if (!supabase) return { data: null, error: new Error('No Supabase client') }
  const { data, error } = await supabase
    .from('kalsada_reports')
    .insert({
      user_id: userId,
      issue_type: report.type,
      location: report.location,
      severity: report.severity,
      description: report.description || '',
      upvotes: 0,
    })
    .select('*')
    .single()
  if (error) return { data: null, error }
  return { data: kalsadaRowToApp(data), error: null }
}

export async function incrementKalsadaUpvote(id, nextCount) {
  if (!supabase) return { error: new Error('No Supabase client') }
  const { error } = await supabase.from('kalsada_reports').update({ upvotes: nextCount }).eq('id', id)
  return { error }
}

export async function fetchProfile(userId) {
  if (!supabase) return { data: null, error: null }
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  return { data, error }
}

export async function upsertProfile({ id, displayName, barangay, city }) {
  if (!supabase) return { error: new Error('No Supabase client') }
  const { error } = await supabase.from('profiles').upsert(
    {
      id,
      display_name: displayName,
      barangay: barangay ?? undefined,
      city: city ?? undefined,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )
  return { error }
}
