export const reviews = [
  {
    id: 'r1',
    bikeId: 1,
    author: 'Diego Almario',
    date: 'Mar 20, 2026',
    rating: 5,
    text: 'Solid bike, smooth gears. Maria was on time for handoff near AS Walk.',
  },
  {
    id: 'r2',
    bikeId: 1,
    author: 'Patricia Go',
    date: 'Mar 8, 2026',
    rating: 4.5,
    text: 'Great for the Diliman loop. Brakes were tuned perfectly.',
  },
  {
    id: 'r3',
    bikeId: 1,
    author: 'Kenzo Lim',
    date: 'Feb 26, 2026',
    rating: 5,
    text: 'Loved the eco route suggestion to Anonas LRT. Would rent again.',
  },
  {
    id: 'r4',
    bikeId: 2,
    author: 'Mara Santos',
    date: 'Mar 15, 2026',
    rating: 4,
    text: 'Light and easy to ride around Krus na Ligas.',
  },
]

export function getReviewsForBike(bikeId) {
  return reviews.filter((r) => String(r.bikeId) === String(bikeId))
}

export function getSeedReviewsForBike(bikeId) {
  return reviews.filter((r) => String(r.bikeId) === String(bikeId))
}
