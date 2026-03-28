import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { bikes as seedBikes } from '../data/bikes'
import { mockUser } from '../data/user'
import { kalsadaSeedReports } from '../data/kalsadaSeed'

const STORAGE_KEYS = {
  onboarding: 'padyak_onboarding_done',
  profileRole: 'padyak_profile_role',
  kalsada: 'padyak_kalsada_reports',
  bookings: 'padyak_bookings',
  listedBikes: 'padyak_listed_bikes',
}

/** One-time read from pre-rename keys */
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

export function AppProvider({ children }) {
  const [onboardingDone, setOnboardingDone] = useState(() =>
    loadJson(STORAGE_KEYS.onboarding, false),
  )
  const [profileRole, setProfileRole] = useState(() =>
    loadJson(STORAGE_KEYS.profileRole, 'renter'),
  )
  const [kalsadaReports, setKalsadaReports] = useState(() => {
    const saved = loadJson(STORAGE_KEYS.kalsada, null)
    return saved?.length ? saved : kalsadaSeedReports
  })
  const [bookingDraft, setBookingDraft] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('gcash')
  const [activeRide, setActiveRide] = useState(null)
  const [lastBooking, setLastBookingState] = useState(null)
  const [listedBikes, setListedBikes] = useState(() => loadJson(STORAGE_KEYS.listedBikes, []))

  const setLastBooking = useCallback((b) => setLastBookingState(b), [])

  const allBikes = useMemo(() => [...seedBikes, ...listedBikes], [listedBikes])

  const getBikeById = useCallback(
    (id) => allBikes.find((b) => String(b.id) === String(id)),
    [allBikes],
  )

  const addListedBike = useCallback((bike) => {
    setListedBikes((prev) => [...prev, bike])
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(onboardingDone))
  }, [onboardingDone])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profileRole, JSON.stringify(profileRole))
  }, [profileRole])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.kalsada, JSON.stringify(kalsadaReports))
  }, [kalsadaReports])

  /** Base64 photo data URLs exceed localStorage quota easily — persist without crashing. */
  useEffect(() => {
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
  }, [listedBikes])

  const completeOnboarding = useCallback(() => setOnboardingDone(true), [])

  const addKalsadaReport = useCallback((report) => {
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
  }, [])

  const upvoteReport = useCallback((id) => {
    setKalsadaReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r)),
    )
  }, [])

  const startRide = useCallback((booking) => {
    setActiveRide({
      startedAt: Date.now(),
      booking,
    })
  }, [])

  const endRide = useCallback(() => setActiveRide(null), [])

  const value = useMemo(
    () => ({
      user: mockUser,
      onboardingDone,
      completeOnboarding,
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
      lastBooking,
      setLastBooking,
      listedBikes,
      allBikes,
      getBikeById,
      addListedBike,
    }),
    [
      onboardingDone,
      completeOnboarding,
      profileRole,
      kalsadaReports,
      addKalsadaReport,
      upvoteReport,
      bookingDraft,
      paymentMethod,
      activeRide,
      startRide,
      endRide,
      lastBooking,
      setLastBooking,
      listedBikes,
      allBikes,
      getBikeById,
      addListedBike,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
