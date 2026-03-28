import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { bikes as seedBikes } from '../data/bikes'
import { mockUser } from '../data/user'
import { kalsadaSeedReports } from '../data/kalsadaSeed'
import { getSeedReviewsForBike } from '../data/reviews'
import {
  fetchBikeListings,
  fetchBikeReviews,
  fetchKalsadaReports,
  incrementKalsadaUpvote,
  insertBikeListing,
  insertBikeReview,
  insertKalsadaReport,
} from '../lib/supabase/dataApi'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const STORAGE_KEYS = {
  onboarding: 'padyak_onboarding_done',
  profileRole: 'padyak_profile_role',
  kalsada: 'padyak_kalsada_reports',
  bookings: 'padyak_bookings',
  listedBikes: 'padyak_listed_bikes',
  bikeReviews: 'padyak_bike_reviews',
  rideHistory: 'padyak_ride_history',
}

const LEGACY_STORAGE_KEYS = {
  [STORAGE_KEYS.onboarding]: 'siklocity_onboarding_done',
  [STORAGE_KEYS.profileRole]: 'siklocity_profile_role',
  [STORAGE_KEYS.kalsada]: 'siklocity_kalsada_reports',
  [STORAGE_KEYS.bookings]: 'siklocity_bookings',
  [STORAGE_KEYS.listedBikes]: 'siklocity_listed_bikes',
}

const AppContext = createContext(null)

function loadJson(key, fallback) {
  try {
    let raw = localStorage.getItem(key)
    if (!raw) {
      const legacy = LEGACY_STORAGE_KEYS[key]
      if (legacy) {
        raw = localStorage.getItem(legacy)
        if (raw != null) {
          localStorage.setItem(key, raw)
          localStorage.removeItem(legacy)
        }
      }
    }
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function initialListedBikes() {
  if (isSupabaseConfigured()) return []
  return loadJson(STORAGE_KEYS.listedBikes, [])
}

function initialBikeReviews() {
  if (isSupabaseConfigured()) return []
  return loadJson(STORAGE_KEYS.bikeReviews, [])
}

function initialKalsada() {
  if (isSupabaseConfigured()) return kalsadaSeedReports
  const saved = loadJson(STORAGE_KEYS.kalsada, null)
  return saved?.length ? saved : kalsadaSeedReports
}

function initialRideHistory() {
  return loadJson(STORAGE_KEYS.rideHistory, [])
}

/** Snapshot when a live ride ends — matches Activity / mockActivity row shape */
function tripHistoryEntryFromActiveRide(activeRide) {
  const booking = activeRide?.booking
  if (!booking?.bike?.name) return null
  const ended = new Date()
  return {
    id: `trip-${booking.id}-${ended.getTime()}`,
    bikeName: booking.bike.name,
    date: ended.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: ended.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    distance: '3.2 km',
    status: 'completed',
  }
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function AppProvider({ children }) {
  const { viewer, session, isAuthenticated, isSupabaseConfigured: sbOn } = useAuth()
  const user = viewer ?? mockUser
  const remoteData = Boolean(sbOn && isAuthenticated && session?.user?.id)

  const [onboardingDone, setOnboardingDone] = useState(() =>
    loadJson(STORAGE_KEYS.onboarding, false),
  )
  const [profileRole, setProfileRole] = useState(() =>
    loadJson(STORAGE_KEYS.profileRole, 'renter'),
  )
  const [kalsadaReports, setKalsadaReports] = useState(initialKalsada)
  const [bookingDraft, setBookingDraft] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('gcash')
  const [activeRide, setActiveRide] = useState(null)
  const activeRideRef = useRef(null)
  const [rideHistory, setRideHistory] = useState(initialRideHistory)
  const [lastBooking, setLastBookingState] = useState(null)
  const [listedBikes, setListedBikes] = useState(initialListedBikes)
  const [bikeReviews, setBikeReviews] = useState(initialBikeReviews)
  const [remoteSynced, setRemoteSynced] = useState(false)

  const setLastBooking = useCallback((b) => setLastBookingState(b), [])

  useEffect(() => {
    activeRideRef.current = activeRide
  }, [activeRide])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.rideHistory, JSON.stringify(rideHistory))
    } catch {
      /* ignore */
    }
  }, [rideHistory])

  useEffect(() => {
    if (!sbOn || session?.user) return
    setListedBikes([])
    setBikeReviews([])
    setKalsadaReports(kalsadaSeedReports)
    setRemoteSynced(false)
  }, [sbOn, session?.user])

  useEffect(() => {
    if (!remoteData || !supabase) {
      setRemoteSynced(false)
      return
    }

    let cancelled = false
    setRemoteSynced(false)

    ;(async () => {
      const [listRes, revRes, kalRes] = await Promise.all([
        fetchBikeListings(),
        fetchBikeReviews(),
        fetchKalsadaReports(),
      ])

      if (cancelled) return

      if (!listRes.error && listRes.data) setListedBikes(listRes.data)
      if (!revRes.error && revRes.data) setBikeReviews(revRes.data)
      if (!kalRes.error && kalRes.data?.length) {
        setKalsadaReports(kalRes.data)
      } else if (!kalRes.error) {
        setKalsadaReports(kalsadaSeedReports)
      }

      setRemoteSynced(true)
    })()

    return () => {
      cancelled = true
    }
  }, [remoteData, session?.user?.id])

  const allBikes = useMemo(() => [...seedBikes, ...listedBikes], [listedBikes])

  const getBikeById = useCallback(
    (id) => allBikes.find((b) => String(b.id) === String(id)),
    [allBikes],
  )

  const addListedBike = useCallback(
    async (bike) => {
      if (remoteData && session?.user?.id) {
        const { data, error } = await insertBikeListing(bike, session.user.id)
        if (error) throw error
        if (data) {
          setListedBikes((prev) => [data, ...prev])
          return data
        }
      }
      setListedBikes((prev) => [...prev, bike])
      return bike
    },
    [remoteData, session?.user?.id],
  )

  const addBikeReview = useCallback(
    async (payload) => {
      const author = payload.author || user.name
      const text = payload.text.trim()
      const bikeId = String(payload.bikeId)
      const rating = payload.rating

      if (remoteData && session?.user?.id) {
        const { data, error } = await insertBikeReview({
          bikeId,
          userId: session.user.id,
          authorName: author,
          rating,
          text,
        })
        if (error) throw error
        if (data) {
          setBikeReviews((prev) => [data, ...prev])
          return data
        }
      }

      const id = `ur${Date.now()}`
      const row = {
        id,
        bikeId,
        author,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        rating,
        text,
      }
      setBikeReviews((prev) => [row, ...prev])
      return row
    },
    [remoteData, session?.user?.id, user.name],
  )

  const getReviewsForBikeMerged = useCallback(
    (bikeId) => {
      const id = String(bikeId)
      const userRows = bikeReviews.filter((r) => String(r.bikeId) === id)
      const seed = getSeedReviewsForBike(id)
      return [...userRows, ...seed]
    },
    [bikeReviews],
  )

  useEffect(() => {
    if (remoteData) return
    try {
      localStorage.setItem(STORAGE_KEYS.bikeReviews, JSON.stringify(bikeReviews))
    } catch {
      /* ignore */
    }
  }, [bikeReviews, remoteData])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(onboardingDone))
  }, [onboardingDone])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profileRole, JSON.stringify(profileRole))
  }, [profileRole])

  useEffect(() => {
    if (remoteData) return
    localStorage.setItem(STORAGE_KEYS.kalsada, JSON.stringify(kalsadaReports))
  }, [kalsadaReports, remoteData])

  useEffect(() => {
    if (remoteData) return
    const trySave = (payload) => {
      try {
        localStorage.setItem(STORAGE_KEYS.listedBikes, JSON.stringify(payload))
        return true
      } catch {
        return false
      }
    }
    if (trySave(listedBikes)) return
    const withoutPhotos = listedBikes.map((b) => ({ ...b, photos: [] }))
    if (trySave(withoutPhotos)) return
    try {
      localStorage.removeItem(STORAGE_KEYS.listedBikes)
    } catch {
      /* ignore */
    }
  }, [listedBikes, remoteData])

  const completeOnboarding = useCallback(() => setOnboardingDone(true), [])

  const resetOnboarding = useCallback(() => {
    setOnboardingDone(false)
    try {
      localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(false))
    } catch {
      /* ignore */
    }
  }, [])

  const addKalsadaReport = useCallback(
    async (report) => {
      if (remoteData && session?.user?.id) {
        const { data, error } = await insertKalsadaReport(report, session.user.id)
        if (error) throw error
        if (data) {
          setKalsadaReports((prev) => [data, ...prev])
          return
        }
      }
      const id = `k${Date.now()}`
      setKalsadaReports((prev) => [
        {
          ...report,
          id,
          timestamp: 'Just now',
          upvotes: 0,
        },
        ...prev,
      ])
    },
    [remoteData, session?.user?.id],
  )

  const upvoteReport = useCallback(
    async (id) => {
      let previous = 0
      setKalsadaReports((prev) => {
        const t = prev.find((r) => r.id === id)
        previous = t?.upvotes || 0
        return prev.map((r) => (r.id === id ? { ...r, upvotes: previous + 1 } : r))
      })

      if (remoteData && supabase && UUID_RE.test(String(id))) {
        const { error } = await incrementKalsadaUpvote(id, previous + 1)
        if (error) {
          setKalsadaReports((prev) =>
            prev.map((r) => (r.id === id ? { ...r, upvotes: previous } : r)),
          )
        }
      }
    },
    [remoteData],
  )

  const startRide = useCallback((booking) => {
    setActiveRide({
      startedAt: Date.now(),
      booking,
    })
  }, [])

  const endRide = useCallback(() => {
    const current = activeRideRef.current
    const entry = tripHistoryEntryFromActiveRide(current)
    if (entry) {
      setRideHistory((prev) => [entry, ...prev])
    }
    setActiveRide(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      onboardingDone,
      completeOnboarding,
      resetOnboarding,
      profileRole,
      setProfileRole,
      kalsadaReports,
      addKalsadaReport,
      upvoteReport,
      bookingDraft,
      setBookingDraft,
      paymentMethod,
      setPaymentMethod,
      activeRide,
      startRide,
      endRide,
      rideHistory,
      lastBooking,
      setLastBooking,
      listedBikes,
      allBikes,
      getBikeById,
      addListedBike,
      bikeReviews,
      addBikeReview,
      getReviewsForBikeMerged,
      remoteData,
      remoteSynced,
    }),
    [
      user,
      onboardingDone,
      completeOnboarding,
      resetOnboarding,
      profileRole,
      kalsadaReports,
      addKalsadaReport,
      upvoteReport,
      bookingDraft,
      paymentMethod,
      activeRide,
      startRide,
      endRide,
      rideHistory,
      lastBooking,
      setLastBooking,
      listedBikes,
      allBikes,
      getBikeById,
      addListedBike,
      bikeReviews,
      addBikeReview,
      getReviewsForBikeMerged,
      remoteData,
      remoteSynced,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
