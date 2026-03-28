export const mockUser = {
  firstName: 'Juan',
  name: 'Juan Dela Cruz',
  barangay: 'Brgy. UP Campus',
  city: 'Quezon City',
  memberSince: 'March 2026',
  stats: {
    totalRides: 12,
    totalDistance: 18.5,
    totalCO2Saved: 2.4,
    totalCalories: 420,
    ridesThisWeek: 3,
  },
  ownerStats: {
    bikesListed: 1,
    totalRentals: 7,
    totalEarnings: 3850,
  },
  greenEquivalent: {
    airconHours: 5,
    jeepneyTrips: 2,
    coalKwh: 3.2,
    treesEquivalent: 0.3,
  },
}

export const mockActivity = [
  {
    id: 'a1',
    bikeName: 'Trek Marlin 5',
    date: 'Mar 26, 2026',
    time: '7:30 AM',
    distance: '4.2 km',
    status: 'completed',
  },
  {
    id: 'a2',
    bikeName: 'City Cruiser Lite',
    date: 'Mar 24, 2026',
    time: '5:15 PM',
    distance: '2.1 km',
    status: 'completed',
  },
  {
    id: 'a3',
    bikeName: 'Giant Escape 3',
    date: 'Mar 22, 2026',
    time: '6:00 AM',
    distance: '6.0 km',
    status: 'completed',
  },
]

export const weeklyRideCounts = [
  { day: 'Mon', count: 1 },
  { day: 'Tue', count: 0 },
  { day: 'Wed', count: 2 },
  { day: 'Thu', count: 1 },
  { day: 'Fri', count: 2 },
  { day: 'Sat', count: 3 },
  { day: 'Sun', count: 1 },
]
