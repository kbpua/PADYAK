import { Link, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { LeafletMap } from '../components/common/LeafletMap'
import { useApp } from '../context/AppContext'
import { DraggableSheet } from '../components/common/DraggableSheet'

const filters = ['All', 'Mountain', 'City', 'Road', 'Folding']

function ExploreBikeList({ list, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {list.map((bike) => (
        <Link
          key={bike.id}
          to={`/bike/${bike.id}`}
          className="flex items-center gap-3 rounded-2xl border border-charcoal/5 p-3 transition hover:border-primary/20 hover:bg-surface active:scale-[0.99] lg:p-4"
        >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white lg:h-16 lg:w-16"
            style={{ background: bike.color }}
          >
            <span className="text-xl lg:text-2xl">🚲</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-sm font-bold text-charcoal lg:text-base">{bike.name}</p>
            <p className="text-xs text-charcoal/55 lg:text-sm">
              {bike.location.barangay} · {bike.location.distance}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono-data text-sm font-bold text-primary lg:text-base">
              ₱{bike.pricePerHour}/hr
            </p>
            <p className="text-[10px] text-charcoal/45 lg:text-xs">★ {bike.rating}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

function ExploreToolbar({ filter, setFilter, onClose }) {
  const chipBtn =
    'flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-md ring-1 ring-charcoal/10 backdrop-blur-md transition hover:bg-white lg:h-11 lg:w-11'
  return (
    <>
      <header className="relative z-10 flex items-center justify-between px-4 pt-4 text-charcoal drop-shadow-sm lg:px-6 lg:pt-6">
        <h1 className="font-heading text-lg font-bold lg:text-2xl">Explore map</h1>
        <div className="flex items-center gap-2">
          <button type="button" className={chipBtn} aria-label="Search">
            <Search className="h-5 w-5" strokeWidth={2} />
          </button>
          <button type="button" onClick={onClose} className={chipBtn} aria-label="Back to home">
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </header>
      <div className="relative z-10 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mt-4 lg:px-6 lg:pb-4 [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold shadow-sm ring-1 transition active:scale-95 lg:px-5 lg:py-2.5 lg:text-sm ${
              filter === f
                ? 'bg-primary text-white ring-primary/20'
                : 'bg-white/95 text-charcoal ring-charcoal/10 hover:bg-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </>
  )
}

/** Larger peek = sheet stops higher when collapsed (less map covered by empty drag strip). */
const SHEET_PEEK_PX = 176

export function Explore() {
  const navigate = useNavigate()
  const { allBikes } = useApp()
  const [filter, setFilter] = useState('All')
  const list = filter === 'All' ? allBikes : allBikes.filter((b) => b.type === filter)
  const sheetShellRef = useRef(null)
  const [sheetMaxDrag, setSheetMaxDrag] = useState(360)

  useLayoutEffect(() => {
    const el = sheetShellRef.current
    if (!el) return
    const measure = () => {
      const h = el.getBoundingClientRect().height
      setSheetMaxDrag(Math.max(180, Math.round(h - SHEET_PEEK_PX)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="relative flex min-h-svh flex-col bg-charcoal lg:min-h-screen lg:flex-row">
      <div className="relative min-h-svh flex-1 lg:min-h-screen lg:min-h-0">
        <div className="absolute inset-0 z-0 [&_.leaflet-container]:bg-charcoal">
          <LeafletMap
            className="h-full min-h-[280px] w-full rounded-none lg:min-h-full"
            filteredBikes={list}
            onMarkerClick={(bike) => navigate(`/bike/${bike.id}`)}
          />
        </div>
        <ExploreToolbar
          filter={filter}
          setFilter={setFilter}
          onClose={() => navigate('/home')}
        />
      </div>

      <aside className="relative z-20 hidden w-[min(440px,38vw)] shrink-0 flex-col border-l border-white/10 bg-white lg:flex lg:h-screen lg:shadow-[-12px_0_40px_rgba(0,0,0,0.15)]">
        <div className="border-b border-charcoal/5 px-6 py-5">
          <h2 className="font-heading text-xl font-bold text-charcoal">{list.length} bikes in area</h2>
          <p className="mt-1 text-sm text-charcoal/55">Quezon City · near you</p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <ExploreBikeList list={list} />
        </div>
      </aside>

      {/* Single motion root = white card + shadow move with drag (no fixed ghost shell). z-30 below BottomNav (z-40). */}
      <DraggableSheet
        ref={sheetShellRef}
        maxDrag={sheetMaxDrag}
        className="fixed inset-x-0 bottom-0 z-30 flex max-h-[min(78dvh,calc(100dvh-5rem))] min-h-0 flex-col overflow-hidden rounded-t-3xl bg-white pb-[calc(5.375rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_40px_rgba(0,0,0,0.2)] lg:hidden"
      >
        <div className="shrink-0 border-b border-charcoal/5 px-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-charcoal">
                {list.length} bikes in area
              </h2>
              <p className="text-xs text-charcoal/55">Quezon City · near you</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="rounded-full p-2 hover:bg-charcoal/5"
              aria-label="Back to home"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-2 pt-4">
          <ExploreBikeList list={list} />
        </div>
      </DraggableSheet>
    </div>
  )
}
