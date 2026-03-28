import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Wind } from 'lucide-react'
import { GreetingHeader } from '../components/home/GreetingHeader'
import { useApp } from '../context/AppContext'
import { QuickActions } from '../components/home/QuickActions'
import { NearbyBikes } from '../components/home/NearbyBikes'
import { EcoImpactCard } from '../components/home/EcoImpactCard'
import { LeaderboardPreview } from '../components/home/LeaderboardPreview'
import { LeafletMap } from '../components/common/LeafletMap'

export function Home() {
  const navigate = useNavigate()
  const { allBikes } = useApp()
  return (
    <div className="space-y-6 pb-4 lg:space-y-5 lg:pb-8">
      <GreetingHeader />

      {/* Single unified grid — left: map + eco card; right: actions + bikes + leaderboard */}
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-6 xl:gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-6 xl:col-span-7">
          <section className="px-4 lg:px-0">
            <div className="relative h-56 w-full overflow-hidden rounded-2xl ring-1 ring-charcoal/10 md:h-64 lg:h-[min(300px,calc(100vh-8.5rem))] lg:min-h-[240px] xl:min-h-[260px] [&_.leaflet-container]:bg-slate-100">
              <LeafletMap
                className="z-0 h-full min-h-[200px] w-full"
                filteredBikes={allBikes}
                onMarkerClick={(bike) => navigate(`/bike/${bike.id}`)}
              />
              <Link
                to="/explore"
                className="absolute left-3 right-3 top-3 z-10 flex items-center justify-between rounded-full bg-white px-4 py-2.5 text-sm font-bold text-charcoal shadow-md ring-1 ring-charcoal/10 transition hover:bg-charcoal/[0.02] active:scale-[0.99] lg:left-3 lg:right-3 lg:py-2 lg:text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-black text-charcoal lg:h-8 lg:w-8">
                    {allBikes.length}
                  </span>
                  bikes available nearby
                </span>
                <ChevronRight className="h-5 w-5 text-charcoal/35" strokeWidth={2} />
              </Link>
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full bg-charcoal px-3 py-1.5 text-[11px] font-semibold text-white shadow-md lg:bottom-4 lg:left-4 lg:text-xs">
                <Wind className="h-3.5 w-3.5 text-teal" />
                AQI: 42 — Good 🟢
              </div>
              <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-charcoal shadow backdrop-blur-sm lg:bottom-4 lg:right-4 lg:text-xs">
                <MapPin className="h-3 w-3 text-primary" />
                QC
              </div>
            </div>
          </section>
          <div className="mt-4 lg:mt-4">
            <EcoImpactCard />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <aside className="mt-4 space-y-5 px-4 lg:col-span-6 lg:mt-0 lg:space-y-5 lg:px-0 xl:col-span-5">
          <QuickActions />
          <NearbyBikes />
          <LeaderboardPreview />
        </aside>

      </div>
    </div>
  )
}
