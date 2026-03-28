import { Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Magandang umaga'
  if (h < 18) return 'Magandang hapon'
  return 'Magandang gabi'
}

export function GreetingHeader() {
  const { user } = useApp()
  return (
    <header className="space-y-4 px-4 pt-4 lg:flex lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between lg:gap-8 lg:space-y-0 lg:px-0 lg:pt-0">
      <div className="flex w-full items-start justify-between gap-3 lg:w-auto lg:min-w-0 lg:flex-1 lg:items-center">
        <div>
          <p className="text-sm text-charcoal/60">
            {greeting()}, <span className="font-semibold text-charcoal">{user.firstName}!</span>
          </p>
          <h1 className="font-heading text-xl font-extrabold tracking-tight text-charcoal lg:text-3xl">
            Padyak
          </h1>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-charcoal/5 transition active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-charcoal/70" />
          </button>
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/30"
          >
            {user.firstName[0]}
          </Link>
        </div>
      </div>

      <label className="flex w-full min-w-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-md ring-1 ring-charcoal/5 lg:max-w-xl lg:flex-1 xl:max-w-2xl">
        <Search className="h-5 w-5 shrink-0 text-charcoal/40" />
        <input
          type="search"
          placeholder="Where do you want to ride?"
          className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none lg:text-base"
        />
      </label>

      <div className="flex w-full shrink-0 flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-charcoal/5 transition hover:bg-charcoal/5 active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-charcoal/70" />
          </button>
          <Link
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/30"
          >
            {user.firstName[0]}
          </Link>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-charcoal ring-1 ring-amber-200/80 lg:text-sm">
          <span>32°C ☀️</span>
          <span className="text-charcoal/70">Good biking weather!</span>
        </div>
      </div>
    </header>
  )
}
