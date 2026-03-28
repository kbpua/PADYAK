import { Bell, Search, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { mockNotifications } from '../../data/notifications'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Magandang umaga'
  if (h < 18) return 'Magandang hapon'
  return 'Magandang gabi'
}

export function GreetingHeader() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchDraft, setSearchDraft] = useState('')
  const unreadCount = mockNotifications.filter((n) => !n.read).length
  const initial = user.firstName?.[0] ?? user.name?.[0] ?? '?'

  const submitSearch = (e) => {
    e.preventDefault()
    const t = searchDraft.trim()
    if (t) navigate(`/explore?q=${encodeURIComponent(t)}`)
    else navigate('/explore')
  }

  const notificationsPanel = notificationsOpen ? (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-[1px]"
        aria-label="Close notifications"
        onClick={() => setNotificationsOpen(false)}
      />
      <div
        className="fixed inset-x-0 bottom-0 z-[101] flex max-h-[min(82dvh,560px)] flex-col rounded-t-3xl bg-white shadow-[0_-12px_48px_rgba(0,0,0,0.18)] sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-[4.5rem] sm:max-h-[min(72vh,520px)] sm:w-[min(100vw-2rem,400px)] sm:rounded-2xl sm:shadow-xl"
        role="dialog"
        aria-labelledby="notifications-title"
      >
        <div className="flex items-center justify-between border-b border-charcoal/5 px-5 py-4">
          <h2 id="notifications-title" className="font-heading text-lg font-bold text-charcoal">
            Notifications
          </h2>
          <button
            type="button"
            onClick={() => setNotificationsOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-charcoal/5"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto px-3 py-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {mockNotifications.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className={`mb-1 w-full rounded-xl px-3 py-3 text-left transition hover:bg-charcoal/[0.04] active:scale-[0.99] ${
                  n.read ? '' : 'bg-primary/[0.06] ring-1 ring-primary/10'
                }`}
                onClick={() => setNotificationsOpen(false)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-heading text-sm font-bold text-charcoal">{n.title}</p>
                  {!n.read ? (
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  ) : null}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/65">{n.body}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-charcoal/40">{n.time}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  ) : null

  return (
    <header className="space-y-4 px-4 pt-4 lg:flex lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between lg:gap-5 lg:space-y-0 lg:px-0 lg:pt-0">
      {notificationsPanel}
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
            onClick={() => setNotificationsOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-charcoal/5 transition active:scale-95"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell className="h-5 w-5 text-charcoal/70" />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </button>
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/30"
          >
            {initial}
          </Link>
        </div>
      </div>

      <form
        onSubmit={submitSearch}
        className="flex w-full min-w-0 items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-md ring-1 ring-charcoal/5 lg:max-w-md lg:flex-1 xl:max-w-lg"
      >
        <Search className="h-4 w-4 shrink-0 text-charcoal/40 lg:h-[18px] lg:w-[18px]" strokeWidth={2} />
        <input
          type="search"
          name="q"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Where do you want to ride?"
          className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none lg:text-sm"
          enterKeyHint="search"
        />
      </form>

      <div className="flex w-full shrink-0 flex-wrap items-center gap-2.5 lg:w-auto lg:justify-end">
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-charcoal/5 transition hover:bg-charcoal/5 active:scale-95"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell className="h-[18px] w-[18px] text-charcoal/70" strokeWidth={2} />
            {unreadCount > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </button>
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary ring-2 ring-primary/30"
          >
            {initial}
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
