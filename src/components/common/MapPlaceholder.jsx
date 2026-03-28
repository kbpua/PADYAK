import { Bike, MapPin } from 'lucide-react'

const markers = [
  { top: '18%', left: '22%', color: '#22C55E' },
  { top: '42%', left: '55%', color: '#F59E0B' },
  { top: '58%', left: '30%', color: '#14B8A6' },
  { top: '35%', left: '72%', color: '#6366F1' },
  { top: '68%', left: '62%', color: '#EC4899' },
]

export function MapPlaceholder({ className = '', showMarkers = true, variant = 'light' }) {
  const isDark = variant === 'dark'
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-charcoal' : 'bg-slate-200'} ${className}`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(90deg, ${isDark ? '#334155' : '#cbd5e1'} 1px, transparent 1px),
            linear-gradient(${isDark ? '#334155' : '#cbd5e1'} 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />
      {!isDark && (
        <div className="pointer-events-none absolute inset-0 bg-primary/[0.06]" aria-hidden />
      )}
      {showMarkers &&
        markers.map((m, i) => (
          <div
            key={i}
            className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-lg"
            style={{ top: m.top, left: m.left }}
          >
            <Bike className="h-4 w-4" style={{ color: m.color }} strokeWidth={2} />
          </div>
        ))}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-charcoal shadow backdrop-blur-sm">
        <MapPin className="h-3 w-3 text-primary" />
        QC
      </div>
    </div>
  )
}
