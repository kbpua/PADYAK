import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { mockUser } from '../data/user'
import { fetchProfile, upsertProfile } from '../lib/supabase/dataApi'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

function viewerFromSession(sessionUser, profileRow) {
  if (!sessionUser) return null
  const meta = sessionUser.user_metadata || {}
  const email = sessionUser.email || ''
  const displayName =
    (profileRow?.display_name && String(profileRow.display_name).trim()) ||
    (typeof meta.display_name === 'string' && meta.display_name.trim()) ||
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    email.split('@')[0] ||
    'Rider'
  const parts = displayName.trim().split(/\s+/)
  const firstName = parts[0] || 'Rider'
  const barangay =
    (profileRow?.barangay && String(profileRow.barangay)) ||
    (typeof meta.barangay === 'string' ? meta.barangay : mockUser.barangay)
  const city =
    (profileRow?.city && String(profileRow.city)) ||
    (typeof meta.city === 'string' ? meta.city : mockUser.city)

  return {
    ...mockUser,
    firstName,
    name: displayName,
    email,
    barangay,
    city,
    memberSince: mockUser.memberSince,
    supabaseId: sessionUser.id,
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(() => !isSupabaseConfigured())
  const [profileRow, setProfileRow] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      setProfileRow(null)
      setAuthReady(true)
      return
    }

    let cancelled = false

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!cancelled) {
        setSession(s)
        setAuthReady(true)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user?.id) {
      setProfileRow(null)
      return
    }

    let cancelled = false

    ;(async () => {
      const { data, error } = await fetchProfile(session.user.id)
      if (cancelled) return

      if (data) {
        setProfileRow(data)
        return
      }

      const displayName =
        session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Rider'
      await upsertProfile({
        id: session.user.id,
        displayName,
        barangay: mockUser.barangay,
        city: mockUser.city,
      })

      const { data: again } = await fetchProfile(session.user.id)
      if (!cancelled && again) setProfileRow(again)
    })()

    return () => {
      cancelled = true
    }
  }, [session?.user?.id])

  const signIn = useCallback(async (email, password) => {
    if (!supabase) {
      return {
        error: new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.'),
      }
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return { error }
  }, [])

  const signUp = useCallback(async (email, password, displayName) => {
    if (!supabase) {
      return {
        error: new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.'),
      }
    }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim() || email.split('@')[0],
        },
      },
    })
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return { error: null }
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [])

  const viewer = useMemo(
    () => viewerFromSession(session?.user ?? null, profileRow),
    [session, profileRow],
  )

  const value = useMemo(
    () => ({
      session,
      authReady,
      profileRow,
      viewer,
      isAuthenticated: Boolean(session?.user),
      isSupabaseConfigured: isSupabaseConfigured(),
      signIn,
      signUp,
      signOut,
    }),
    [session, authReady, profileRow, viewer, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
