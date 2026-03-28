import { NavLink } from 'react-router-dom'
import { Home, ListPlus, MessageCircle, User } from 'lucide-react'
import { AppLogo } from '../common/AppLogo'
import { useMessages } from '../../context/MessagesContext'

/** Taller band fits a larger Book FAB while side icons stay bottom-aligned. */
const iconBand =
  'relative flex h-14 w-full flex-col items-center justify-end gap-0'
const labelClass = 'text-[10px] font-semibold leading-none'

export function BottomNav() {
  const { totalUnread } = useMessages()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-charcoal/10 bg-white/90 backdrop-blur-lg lg:hidden">
      <div className="mx-auto grid w-full max-w-lg grid-cols-5 px-0.5 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {/* Home */}
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex min-w-0 flex-col items-center gap-0.5 pb-1 transition active:scale-[0.98] ${isActive ? 'text-primary' : 'text-charcoal/45'}`
          }
        >
          {({ isActive }) => (
            <>
              <div className={iconBand}>
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <Home className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span
                  className={`mt-0.5 h-1 w-1 shrink-0 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`}
                  aria-hidden
                />
              </div>
              <span className={labelClass}>Home</span>
            </>
          )}
        </NavLink>

        {/* List */}
        <NavLink
          to="/list-bike"
          className={({ isActive }) =>
            `flex min-w-0 flex-col items-center gap-0.5 pb-1 transition active:scale-[0.98] ${isActive ? 'text-primary' : 'text-charcoal/45'}`
          }
        >
          {({ isActive }) => (
            <>
              <div className={iconBand}>
                <span className="flex h-6 w-6 items-center justify-center">
                  <ListPlus className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-transparent" aria-hidden />
              </div>
              <span className={labelClass}>List</span>
            </>
          )}
        </NavLink>

        {/* Book — same vertical band as other icons; column 3 keeps it centered */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex min-w-0 flex-col items-center gap-0.5 pb-1 transition active:scale-[0.98] ${isActive ? 'text-primary' : 'text-charcoal/70'}`
          }
        >
          {({ isActive }) => (
            <>
              <div className={iconBand}>
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-lg ring-4 ring-white transition ${
                    isActive ? 'bg-primary/90 shadow-primary/25' : 'bg-primary shadow-primary/30'
                  }`}
                >
                  <span className="grid h-10 w-10 place-items-stretch overflow-hidden rounded-full bg-white shadow-inner">
                    <AppLogo zoom={1.18} className="min-h-0 min-w-0" />
                  </span>
                </span>
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-transparent" aria-hidden />
              </div>
              <span className={`${labelClass} font-bold`}>Book</span>
            </>
          )}
        </NavLink>

        {/* Messages */}
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex min-w-0 flex-col items-center gap-0.5 pb-1 transition active:scale-[0.98] ${isActive ? 'text-primary' : 'text-charcoal/45'}`
          }
        >
          {({ isActive }) => (
            <>
              <div className={iconBand}>
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <MessageCircle className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                  {totalUnread > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white ring-2 ring-white">
                      {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-transparent" aria-hidden />
              </div>
              <span className={labelClass}>Messages</span>
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex min-w-0 flex-col items-center gap-0.5 pb-1 transition active:scale-[0.98] ${isActive ? 'text-primary' : 'text-charcoal/45'}`
          }
        >
          {({ isActive }) => (
            <>
              <div className={iconBand}>
                <span className="flex h-6 w-6 items-center justify-center">
                  <User className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-transparent" aria-hidden />
              </div>
              <span className={labelClass}>Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
