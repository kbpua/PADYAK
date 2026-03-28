import { Link } from 'react-router-dom'
import { Bike, Home, MapPin, TrainFront } from 'lucide-react'
import { MapPlaceholder } from '../components/common/MapPlaceholder'
import { RideBottomSheet } from '../components/ride/RideBottomSheet'
import { useApp } from '../context/AppContext'

export function ActiveRidePage() {
  const { activeRide } = useApp()

  if (!activeRide) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-charcoal p-8 text-white lg:min-h-screen">
        <p className="text-center text-lg text-white/70">No active ride. Book a bike to start.</p>
        <Link
          to="/explore"
          className="rounded-full bg-primary px-8 py-3 font-heading text-sm font-bold text-white shadow-lg shadow-primary/30"
        >
          Find bikes
        </Link>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-charcoal lg:min-h-screen lg:flex-row lg:items-stretch">
      <div className="relative min-h-[55vh] flex-1 lg:min-h-screen lg:flex-1">
        <div className="absolute inset-0">
          <MapPlaceholder className="h-full min-h-[100dvh] w-full rounded-none lg:min-h-full" variant="dark" />
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 15 75 Q 35 45 50 50 T 85 28"
              fill="none"
              stroke="#22c55e"
              strokeWidth="0.8"
              strokeDasharray="3 2"
              opacity="0.85"
            />
          </svg>
          <div className="absolute left-[18%] top-[72%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-charcoal/20">
            <Home className="h-5 w-5 text-charcoal" />
          </div>
          <div className="absolute left-[55%] top-[48%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-xl ring-4 ring-primary/30">
            <Bike className="h-6 w-6 text-white" />
          </div>
          <div className="absolute left-[82%] top-[26%] flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-charcoal shadow-lg">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="absolute right-[12%] top-[40%] flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-charcoal shadow-md">
            <TrainFront className="h-3 w-3 text-primary" />
            LRT-2
          </div>
          <div className="absolute left-[40%] top-[60%] flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-charcoal shadow-md">
            <TrainFront className="h-3 w-3 text-teal" />
            MRT-3
          </div>
          <div className="absolute left-1/2 top-[58%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_8px_rgba(34,197,94,0.25)]" />
        </div>
        <header className="relative z-10 flex items-center justify-between px-4 pt-4 lg:px-8 lg:pt-6">
          <Link
            to="/home"
            className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md lg:px-5 lg:py-2.5 lg:text-sm"
          >
            Home
          </Link>
          <span className="rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white lg:px-4 lg:py-1.5 lg:text-xs">
            Live ride
          </span>
        </header>
      </div>
      <RideBottomSheet />
    </div>
  )
}
