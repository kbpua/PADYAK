import { NavLink } from 'react-router-dom'
import { Home, ListPlus, MessageCircle, User } from 'lucide-react'
import { AppLogo } from '../common/AppLogo'
import { useMessages } from '../../context/MessagesContext'

const linkClass =
  'flex flex-col items-center gap-0.5 text-[10px] font-semibold transition active:scale-95'

export function BottomNav() {
  const { totalUnread } = useMessages()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-charcoal/10 bg-white/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg lg:hidden">
      <div className="mx-auto flex max-w-lg items-end justify-between px-1">

        {/* Home */}
        <NavLink to="/home" className={({ isActive }) => `${linkClass} ${isActive ? 'text-primary' : 'text-charcoal/45'}`}>
          {({ isActive }) => (
            <>
              <span className="relative">
                <Home className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </span>
              Home
            </>
          )}
        </NavLink>

        {/* List a bike */}
        <NavLink
          to="/list-bike"
          className={({ isActive }) => `${linkClass} ${isActive ? 'text-primary' : 'text-charcoal/45'}`}
        >
          {({ isActive }) => (
            <>
              <ListPlus className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              List
            </>
          )}
        </NavLink>

        {/* Center FAB — Book a bike */}
        <NavLink to="/explore" className="-mt-4 flex flex-col items-center active:scale-95">
          {({ isActive }) => (
            <>
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-4 ring-white transition ${
                  isActive ? 'bg-primary/85 shadow-primary/20' : 'bg-primary shadow-primary/25'
                }`}
              >
                <span className="grid h-10 w-10 place-items-stretch overflow-hidden rounded-full bg-white shadow-inner">
                  <AppLogo zoom={1.22} className="min-h-0 min-w-0" />
                </span>
              </span>
              <span className={`mt-1 text-[10px] font-bold ${isActive ? 'text-primary' : 'text-charcoal/70'}`}>
                Book
              </span>
            </>
          )}
        </NavLink>

        {/* Messages */}
        <NavLink
          to="/messages"
          className={({ isActive }) => `${linkClass} ${isActive ? 'text-primary' : 'text-charcoal/45'}`}
        >
          {({ isActive }) => (
            <>
              <span className="relative">
                <MessageCircle className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
                {totalUnread > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 animate-pulse items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white ring-2 ring-white">
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </span>
              Messages
            </>
          )}
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) => `${linkClass} ${isActive ? 'text-primary' : 'text-charcoal/45'}`}
        >
          {({ isActive }) => (
            <>
              <User className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              Profile
            </>
          )}
        </NavLink>

      </div>
      <div className="h-2" />
    </nav>
  )
}
