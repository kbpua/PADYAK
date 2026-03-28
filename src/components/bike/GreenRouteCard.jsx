import { Leaf, TrainFront, Wind } from 'lucide-react'

export function GreenRouteCard() {
  return (
    <div className="rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20">
      <h3 className="font-heading text-sm font-bold text-charcoal">Suggested Green Route 🌿</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
        Bike → Philcoa → UP Diliman → Katipunan Ave → Anonas LRT{' '}
        <span className="font-mono-data font-semibold text-primary">(2.1 km)</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-charcoal/70">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 ring-1 ring-charcoal/10">
          <Wind className="h-3.5 w-3.5 text-teal" />
          AQI along route: 38 (Good)
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 ring-1 ring-charcoal/10">
          <Leaf className="h-3.5 w-3.5 text-primary" />
          70% shaded path
        </span>
      </div>
      <p className="mt-3 flex items-start gap-2 text-xs text-charcoal/65">
        <TrainFront className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        Connect to LRT-2 Anonas for trips to Cubao, Recto, and beyond
      </p>
    </div>
  )
}
