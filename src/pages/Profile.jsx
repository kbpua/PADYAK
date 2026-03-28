import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Bell,
  Clock,
  CreditCard,
  HelpCircle,
  History,
  LogOut,
  MessageCircle,
  Shield,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export function Profile() {
  const { user, profileRole, setProfileRole, listedBikes } = useApp()
  const renter = profileRole === 'renter'

  const menuRows = [
    { label: 'Payment methods', icon: CreditCard },
    {
      label: 'ID Verification',
      icon: Shield,
      extra: 'Verified',
      extraClass: 'text-primary',
    },
    { label: 'Notifications', icon: Bell },
    { to: '/messages', label: 'My messages', icon: MessageCircle },
    { to: '/activity', label: 'Trip history & activity', icon: Clock },
    { to: '/kalsada', label: 'Kalsada Reports history', icon: History },
    { label: 'Help & Support', icon: HelpCircle },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-4 lg:max-w-[1400px] lg:px-10 xl:px-14 lg:pb-12 lg:pt-8">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
        {/* Identity + role + stats — desktop: left column card */}
        <div className="min-w-0 space-y-6 lg:col-span-5 xl:col-span-4 lg:space-y-8">
          <div className="min-w-0 rounded-3xl bg-white p-6 shadow-md ring-1 ring-charcoal/5 lg:p-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="max-w-full truncate px-1 font-heading text-lg font-bold tracking-tight text-charcoal lg:text-xl">
                {user.name}
              </h1>
              <p className="mt-1.5 text-sm text-charcoal/60 lg:text-[15px]">
                {user.barangay}, {user.city}
              </p>
              <p className="mt-0.5 text-xs text-charcoal/45">Member since {user.memberSince}</p>
              <div className="relative mt-5 shrink-0 lg:mt-6">
                <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 text-3xl font-heading font-bold text-primary ring-4 ring-primary/25 lg:h-28 lg:w-28 lg:text-4xl">
                  {user.firstName[0]}
                </span>
                <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-white">
                  <BadgeCheck className="h-5 w-5" />
                </span>
              </div>
            </div>

            <div className="mx-auto mt-6 flex max-w-md rounded-full bg-charcoal/10 p-1 lg:mx-0 lg:mt-8 lg:max-w-none">
              <button
                type="button"
                onClick={() => setProfileRole('renter')}
                className={`flex-1 rounded-full py-2.5 text-xs font-bold transition lg:py-3 lg:text-sm ${
                  renter ? 'bg-white text-charcoal shadow-md' : 'text-charcoal/50'
                }`}
              >
                Renter
              </button>
              <button
                type="button"
                onClick={() => setProfileRole('owner')}
                className={`flex-1 rounded-full py-2.5 text-xs font-bold transition lg:py-3 lg:text-sm ${
                  !renter ? 'bg-white text-charcoal shadow-md' : 'text-charcoal/50'
                }`}
              >
                Owner
              </button>
            </div>

            {renter ? (
              <div className="mt-6 grid min-w-0 grid-cols-3 overflow-hidden rounded-2xl bg-charcoal/[0.04] ring-1 ring-charcoal/10 lg:mt-8">
                {[
                  { v: user.stats.totalRides, label: 'Rides', c: 'text-primary' },
                  { v: user.stats.totalDistance, label: 'km', c: 'text-teal' },
                  { v: user.stats.totalCO2Saved, label: 'kg CO₂', c: 'text-accent' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1.5 py-3 sm:px-2 sm:py-3.5 lg:px-2.5 lg:py-4 ${
                      i < 2 ? 'border-r border-charcoal/10' : ''
                    }`}
                  >
                    <p
                      className={`min-w-0 max-w-full text-center font-mono-data text-base font-bold tabular-nums leading-tight sm:text-lg lg:text-xl ${stat.c}`}
                    >
                      {stat.v}
                    </p>
                    <p className="min-w-0 max-w-full text-center text-[10px] font-semibold uppercase tracking-wide text-charcoal/50 sm:text-xs sm:normal-case sm:tracking-normal sm:text-charcoal/55">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid min-w-0 grid-cols-3 overflow-hidden rounded-2xl bg-charcoal/[0.04] ring-1 ring-charcoal/10 lg:mt-8">
                {[
                  {
                    v: user.ownerStats.bikesListed + listedBikes.length,
                    label: 'Bikes',
                    c: 'text-primary',
                  },
                  { v: user.ownerStats.totalRentals, label: 'Rentals', c: 'text-teal' },
                  {
                    v: `₱${user.ownerStats.totalEarnings}`,
                    label: 'Earned',
                    c: 'text-accent',
                    mono: false,
                  },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex min-w-0 flex-col items-center justify-center gap-0.5 px-1.5 py-3 sm:px-2 sm:py-3.5 lg:px-2.5 lg:py-4 ${
                      i < 2 ? 'border-r border-charcoal/10' : ''
                    }`}
                  >
                    <p
                      className={`min-w-0 max-w-full text-center text-base font-bold tabular-nums leading-tight sm:text-lg lg:text-xl ${stat.c} ${
                        stat.mono === false ? 'font-heading' : 'font-mono-data'
                      }`}
                    >
                      {stat.v}
                    </p>
                    <p className="min-w-0 max-w-full text-center text-[10px] font-semibold uppercase tracking-wide text-charcoal/50 sm:text-xs sm:normal-case sm:tracking-normal sm:text-charcoal/55">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings + actions — desktop: wider column */}
        <div className="mt-8 space-y-6 lg:col-span-7 xl:col-span-8 lg:mt-0 lg:space-y-8">
          <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-charcoal/5 lg:rounded-3xl">
            {menuRows.map((row, i) => {
              const Icon = row.icon
              const inner = (
                <>
                  <Icon className="h-5 w-5 shrink-0 text-charcoal/45 lg:h-6 lg:w-6" />
                  <span className="flex-1 text-sm font-semibold text-charcoal lg:text-base">{row.label}</span>
                  {row.extra && (
                    <span className={`text-xs font-bold lg:text-sm ${row.extraClass ?? 'text-charcoal/45'}`}>
                      {row.extra}
                    </span>
                  )}
                </>
              )
              const className =
                'flex w-full items-center gap-3 border-b border-charcoal/5 px-4 py-4 text-left transition hover:bg-surface lg:gap-4 lg:px-6 lg:py-5 last:border-0'
              return row.to ? (
                <Link key={row.label} to={row.to} className={className}>
                  {inner}
                </Link>
              ) : (
                <button key={row.label} type="button" className={className}>
                  {inner}
                </button>
              )
            })}
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-4 text-left text-red-600 transition hover:bg-red-50 lg:gap-4 lg:px-6 lg:py-5"
            >
              <LogOut className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="text-sm font-semibold lg:text-base">Log out</span>
            </button>
          </div>

          <Link
            to="/dashboard"
            className="block rounded-2xl bg-charcoal py-4 text-center font-heading text-sm font-bold text-white shadow-lg transition hover:bg-charcoal/90 lg:rounded-3xl lg:py-5 lg:text-base"
          >
            Open Eco Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
