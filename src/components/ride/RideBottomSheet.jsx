import { Link, useNavigate } from 'react-router-dom'
import { Leaf, MessageCircle, Siren, TriangleAlert } from 'lucide-react'
import { DraggableSheet } from '../common/DraggableSheet'
import { useApp } from '../../context/AppContext'
import { useMessages } from '../../context/MessagesContext'

export function RidePanelBody({ className = '', onSos }) {
  const navigate = useNavigate()
  const { endRide, activeRide } = useApp()
  const { ensureChatForBike } = useMessages()

  const chatWithOwner = () => {
    const b = activeRide?.booking
    if (!b?.bike) {
      navigate('/messages/chat-1')
      return
    }
    const chatId = ensureChatForBike(b.bike, {
      date: b.dateLabel,
      time: `${b.slot} · ${b.duration}`,
      status: 'active',
    })
    navigate(`/messages/${chatId}`)
  }
  return (
    <div className={`space-y-4 px-5 pb-8 pt-1 lg:px-6 lg:pb-8 lg:pt-6 ${className}`}>
      <div className="text-center lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Ride timer</p>
        <p className="font-mono-data text-4xl font-bold tracking-tight text-charcoal tabular-nums lg:text-5xl">
          00:42:15
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        <div className="rounded-2xl bg-surface p-3 text-center ring-1 ring-charcoal/5 lg:p-4">
          <p className="text-xs text-charcoal/50">Distance</p>
          <p className="font-mono-data text-xl font-bold text-charcoal lg:text-2xl">3.2 km</p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-center ring-1 ring-primary/20 lg:p-4">
          <p className="flex items-center justify-center gap-1 text-xs font-semibold text-primary">
            <Leaf className="h-3.5 w-3.5 animate-pulse" />
            CO₂ saved
          </p>
          <p className="font-mono-data text-xl font-bold text-primary lg:text-2xl">0.6 kg</p>
        </div>
      </div>
      <div className="rounded-2xl bg-teal/10 px-4 py-3 text-center lg:text-left">
        <p className="text-xs text-charcoal/55">Calories burned</p>
        <p className="font-heading text-lg font-bold text-teal lg:text-xl">~85 kcal</p>
      </div>
      <button
        type="button"
        onClick={chatWithOwner}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 py-3 text-sm font-bold text-primary transition hover:bg-primary/10 active:scale-[0.98] lg:py-3.5"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2} />
        Chat with Owner
      </button>
      <Link
        to="/kalsada"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-charcoal/15 py-3 text-sm font-bold text-charcoal transition hover:bg-charcoal/5 active:scale-[0.98] lg:py-3.5"
      >
        <TriangleAlert className="h-4 w-4 text-accent" />
        Report Road Issue
      </Link>
      {onSos && (
        <button
          type="button"
          onClick={onSos}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-600 bg-amber-500 py-3.5 font-heading text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-amber-600/35 transition hover:bg-amber-600 active:scale-[0.98] lg:py-4"
        >
          <Siren className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          SOS — Emergency help
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          const b = activeRide?.booking
          endRide()
          if (b?.bike?.id !== undefined && b?.bike?.id !== null && b?.bike?.id !== '') {
            navigate('/ride/review', { state: { booking: b } })
          } else {
            navigate('/home')
          }
        }}
        className="w-full rounded-full bg-red-500 py-3.5 font-heading text-sm font-bold text-white shadow-lg shadow-red-500/25 transition active:scale-[0.98] lg:py-4 lg:text-base"
      >
        End Ride
      </button>
    </div>
  )
}

export function RideBottomSheet({ onSos }) {
  return (
    <>
      <DraggableSheet className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md lg:hidden">
        <RidePanelBody onSos={onSos} />
      </DraggableSheet>
      <aside className="relative z-20 hidden h-screen w-[min(420px,34vw)] shrink-0 flex-col border-l border-white/10 bg-white shadow-[-12px_0_48px_rgba(0,0,0,0.2)] lg:flex">
        <div className="border-b border-charcoal/5 px-6 py-4">
          <p className="font-heading text-lg font-bold text-charcoal">Live ride</p>
          <p className="text-sm text-charcoal/55">Eco stats update as you pedal</p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <RidePanelBody className="pb-10" onSos={onSos} />
        </div>
      </aside>
    </>
  )
}
