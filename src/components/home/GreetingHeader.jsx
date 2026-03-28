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
    <header className="space-y-4 px-4 pt-4 lg:flex lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between lg:gap-5 lg:space-y-0 lg:px-0 lg:pt-0">
      <div className="flex w-full items-start justify-between gap-3 lg:w-auto lg:min-w-0 lg:flex-1 lg:items-center">
        <div>
          <h1 className="font-heading text-xl font-extrabold tracking-tight text-charcoal lg:text-2xl">
            Padyak
          </h1>
          <p className="mt-0.5 text-sm text-charcoal/60 lg:mt-0.5 lg:text-[13px]">
            {greeting()}, <span className="font-semibold text-charcoal">{user.firstName}!</span>
          </p>
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

      <label className="flex w-full min-w-0 items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-md ring-1 ring-charcoal/5 lg:max-w-md lg:flex-1 xl:max-w-lg">
        <Search className="h-4 w-4 shrink-0 text-charcoal/40 lg:h-[18px] lg:w-[18px]" />
        <input
          type="search"
          placeholder="Where do you want to ride?"
          className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none lg:text-sm"
        />
      </label>

      <div className="flex w-full shrink-0 flex-wrap items-center gap-2.5 lg:w-auto lg:justify-end">
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-charcoal/5 transition hover:bg-charcoal/5 active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px] text-charcoal/70" />
          </button>
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/30"
          >
            {user.firstName[0]}
          </Link>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-charcoal ring-1 ring-amber-200/80 lg:text-[11px]">
          <span>32°C ☀️</span>
          <span className="text-charcoal/70">Good biking weather!</span>
        </div>
      </div>
    </header>
  )
}
