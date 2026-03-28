import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Bike, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { onboardingDone, resetOnboarding } = useApp()
  const { signIn, signUp, isSupabaseConfigured } = useAuth()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    if (!isSupabaseConfigured) {
      setError('Add Supabase keys to your .env file (see .env.example), then restart the dev server.')
      return
    }
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await signIn(email, password)
        if (err) {
          setError(err.message)
          return
        }
        navigate('/home', { replace: true })
        return
      }

      const { data, error: err } = await signUp(email, password, displayName)
      if (err) {
        setError(err.message)
        return
      }
      if (data?.session) {
        navigate('/home', { replace: true })
        return
      }
      setInfo(
        'Check your email to confirm, then sign in. (You can disable confirmation under Supabase → Authentication → Email.)',
      )
    } finally {
      setLoading(false)
    }
  }

  if (!onboardingDone) {
    return <Navigate to="/" replace />
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-charcoal/15 px-2.5 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/25'

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[22rem] flex-col justify-center px-4 py-6 sm:max-w-[24rem] sm:py-8">
      <p className="mb-3 text-center font-heading text-xs font-extrabold tracking-tight text-primary">Padyak</p>

      <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-charcoal/5 sm:p-5">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Bike className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h1 className="font-heading text-lg font-extrabold leading-tight text-charcoal">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-0.5 text-[11px] leading-snug text-charcoal/50 sm:text-xs">
              {mode === 'signin'
                ? 'Sign in to sync bookings and reviews.'
                : 'Email + password. Data lives in your Supabase project.'}
            </p>
          </div>
        </div>

        {!isSupabaseConfigured ? (
          <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-950 ring-1 ring-amber-200/80 sm:text-xs">
            <p className="font-bold">Supabase not connected</p>
            <p className="mt-0.5 text-amber-900/90">
              Copy <code className="rounded bg-amber-100/80 px-1 font-mono text-[10px]">.env.example</code> to{' '}
              <code className="rounded bg-amber-100/80 px-1 font-mono text-[10px]">.env</code>, add URL + anon key,
              restart dev.
            </p>
          </div>
        ) : null}

        <div className="mt-3 flex rounded-full bg-charcoal/10 p-0.5">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError(null)
              setInfo(null)
            }}
            className={`flex-1 rounded-full py-2 text-[11px] font-bold transition sm:text-xs ${
              mode === 'signin' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/50'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
              setInfo(null)
            }}
            className={`flex-1 rounded-full py-2 text-[11px] font-bold transition sm:text-xs ${
              mode === 'signup' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal/50'
            }`}
          >
            Create account
          </button>
        </div>

        <form className={`mt-3 ${mode === 'signup' ? 'space-y-2.5' : 'space-y-3'}`} onSubmit={submit}>
          {mode === 'signup' ? (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-charcoal/45" htmlFor="displayName">
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How we greet you"
                className={inputClass}
              />
            </div>
          ) : null}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-charcoal/45" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide text-charcoal/45" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] text-red-800 ring-1 ring-red-100 sm:text-xs">
              {error}
            </p>
          ) : null}
          {info ? (
            <p className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] leading-snug text-charcoal ring-1 ring-primary/20 sm:text-xs">
              {info}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-heading text-sm font-bold text-white shadow-md shadow-primary/20 transition enabled:active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> : null}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-3 text-center text-[10px] leading-snug text-charcoal/40 sm:text-[11px]">
          By continuing you agree to use this app responsibly. Passwords are handled by Supabase Auth.
        </p>
      </div>

      <p className="mt-4 text-center text-[10px] text-charcoal/45 sm:text-xs">
        Need the intro again?{' '}
        <button
          type="button"
          onClick={() => {
            resetOnboarding()
            navigate('/')
          }}
          className="font-bold text-primary underline-offset-2 hover:underline"
        >
          Replay introduction
        </button>
      </p>
    </div>
  )
}
