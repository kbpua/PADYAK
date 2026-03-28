import { Link } from 'react-router-dom'
import { BikeCard } from '../common/BikeCard'
import { useApp } from '../../context/AppContext'

export function NearbyBikes() {
  const { allBikes } = useApp()
  return (
    <section className="px-4 lg:px-0">
      <div className="mb-3 flex items-center justify-between lg:mb-3">
        <h2 className="font-heading text-sm font-bold text-charcoal lg:text-sm">Bikes Near You</h2>
        <Link to="/explore" className="text-xs font-bold text-primary lg:text-xs">
          See All →
        </Link>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible lg:pb-0 xl:grid-cols-3 xl:gap-4 [&::-webkit-scrollbar]:hidden">
        {allBikes.slice(0, 6).map((bike) => (
          <BikeCard key={bike.id} bike={bike} />
        ))}
      </div>
    </section>
  )
}
