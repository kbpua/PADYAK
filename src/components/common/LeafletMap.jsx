import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { bikes } from '../../data/bikes'
import { effectiveDailyRatePesos } from '../../lib/bikePricing'

function bikeIcon(color = '#22C55E') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="16" fill="white" stroke="${color}" stroke-width="2"/>
      <g transform="translate(8,8)" stroke="${color}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="4" cy="14" r="3.5"/>
        <circle cx="16" cy="14" r="3.5"/>
        <path d="M4 14L7 6h2"/>
        <path d="M9 6l4 8"/>
        <path d="M13 14l-4-8h5l2 4"/>
        <path d="M7 10h6"/>
      </g>
    </svg>`
  return L.divIcon({
    html: svg,
    className: 'bike-marker-icon !border-0 !bg-transparent',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  })
}

function FitBounds({ positions }) {
  const map = useMap()
  const fitted = useRef(false)
  useEffect(() => {
    if (positions.length && !fitted.current) {
      map.fitBounds(positions, { padding: [40, 40], maxZoom: 15 })
      fitted.current = true
    }
  }, [map, positions])
  return null
}

export function LeafletMap({
  className = '',
  filteredBikes = bikes,
  onMarkerClick,
  interactive = true,
  center = [14.647, 121.065],
  zoom = 14,
}) {
  const positions = filteredBikes
    .filter((b) => b.location.lat && b.location.lng)
    .map((b) => [b.location.lat, b.location.lng])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={false}
      attributionControl={false}
      className={`z-0 rounded-2xl ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <FitBounds positions={positions} />
      {filteredBikes
        .filter((b) => b.location.lat && b.location.lng)
        .map((bike) => {
          const dayRate = effectiveDailyRatePesos(bike)
          return (
            <Marker
              key={bike.id}
              position={[bike.location.lat, bike.location.lng]}
              icon={bikeIcon(bike.color)}
              eventHandlers={{
                click: () => onMarkerClick?.(bike),
              }}
            >
              {!onMarkerClick && (
                <Popup className="bike-popup" closeButton={false}>
                  <div className="min-w-[160px] p-1 text-center">
                    <p className="font-heading text-sm font-bold text-charcoal">{bike.name}</p>
                    <p className="text-xs text-charcoal/60">{bike.location.barangay}</p>
                    <p className="mt-1 font-heading text-sm font-bold text-primary">
                      {dayRate != null ? `₱${dayRate}/day` : '—'}
                    </p>
                  </div>
                </Popup>
              )}
            </Marker>
          )
        })}
    </MapContainer>
  )
}
