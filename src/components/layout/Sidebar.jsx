import { NavLink } from 'react-router-dom'
import {
  Home,
  LayoutDashboard,
  LogIn,
  MapPin,
  MessageCircle,
  Plus,
  Route,
  ShieldAlert,
  User,
} from 'lucide-react'
import { AppLogo } from '../common/AppLogo'
import { useMessages } from '../../context/MessagesContext'
import { useAuth } from '../../context/AuthContext'

const item =
  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold transition hover:bg-white/10 active:scale-[0.99]'

export function Sidebar() {
  const { totalUnread } = useMessages()
  const { isAuthenticated, isSupabaseConfigured } = useAuth()

  return (
    <aside
      className="sticky top-0 z-30 flex max-lg:hidden h-svh w-52 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-charcoal py-4 text-white xl:w-56"
      aria-label="Main navigation"
    >
      <div className="mb-5 flex items-center gap-2.5 px-3 xl:px-4">
        <span className="grid h-10 w-10 shrink-0 place-items-stretch overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15 xl:h-11 xl:w-11">
          <AppLogo zoom={1.28} className="min-h-0 min-w-0" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold leading-tight tracking-tight xl:text-base">Padyak</p>
          <p className="truncate text-[10px] text-white/50 xl:text-[11px]">Pedal Your City Forward</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2 xl:px-3">
        <NavLink
          to="/home"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <Home className="h-5 w-5 shrink-0" strokeWidth={2} />
          Home
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <MapPin className="h-5 w-5 shrink-0" strokeWidth={2} />
          Explore
        </NavLink>
        <NavLink
          to="/list-bike"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <Plus className="h-5 w-5 shrink-0" strokeWidth={2} />
          List a bike
        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <span className="relative shrink-0">
            <MessageCircle className="h-5 w-5" strokeWidth={2} />
            {totalUnread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[8px] font-bold text-white ring-2 ring-charcoal">
                {totalUnread > 9 ? '+' : totalUnread}
              </span>
            )}
          </span>
          Messages
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" strokeWidth={2} />
          Eco Dashboard
        </NavLink>
        <NavLink
          to="/ride/active"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <Route className="h-5 w-5 shrink-0" strokeWidth={2} />
          Active ride
        </NavLink>
        <NavLink
          to="/kalsada"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <ShieldAlert className="h-5 w-5 shrink-0" strokeWidth={2} />
          Kalsada
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
        >
          <User className="h-5 w-5 shrink-0" strokeWidth={2} />
          Profile
        </NavLink>
        {isSupabaseConfigured && !isAuthenticated ? (
          <NavLink
            to="/login"
            className={({ isActive }) => `${item} ${isActive ? 'bg-white/10 text-primary' : 'text-white/85'}`}
          >
            <LogIn className="h-5 w-5 shrink-0" strokeWidth={2} />
            Log in
          </NavLink>
        ) : null}
      </nav>
    </aside>
  )
}
