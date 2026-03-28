import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { mockNotifications } from '../data/notifications'

export function NotificationsPage() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-4 lg:max-w-2xl lg:px-0 lg:pb-12 lg:pt-6">
      <div className="flex items-start gap-2">
        <Link
          to="/profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal transition hover:bg-charcoal/10 active:scale-95 lg:h-11 lg:w-11"
          aria-label="Back to profile"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>
        <div className="min-w-0 flex-1 pt-0.5">
          <h1 className="font-heading text-xl font-extrabold text-charcoal lg:text-2xl">Notifications</h1>
          <p className="mt-1 text-sm text-charcoal/55">
            {unreadCount > 0 ? `${unreadCount} unread · ` : null}
            Updates on bookings, messages, and your rides
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-2 lg:mt-8">
        {mockNotifications.map((n) => (
          <li key={n.id}>
            <div
              className={`rounded-2xl px-4 py-4 ring-1 transition lg:px-5 lg:py-4 ${
                n.read
                  ? 'bg-white ring-charcoal/10 shadow-sm'
                  : 'bg-primary/[0.06] ring-primary/15 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-heading text-sm font-bold text-charcoal lg:text-base">{n.title}</p>
                {!n.read ? (
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                ) : null}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-charcoal/65">{n.body}</p>
              <p className="mt-2 text-xs font-semibold text-charcoal/40">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
