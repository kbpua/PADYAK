import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { AppLayout } from './components/layout/AppLayout'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { BikeDetailPage } from './pages/BikeDetailPage'
import { BookingConfirm } from './pages/BookingConfirm'
import { ActiveRidePage } from './pages/ActiveRidePage'
import { Dashboard } from './pages/Dashboard'
import { ListBike } from './pages/ListBike'
import { Profile } from './pages/Profile'
import { KalsadaReports } from './pages/KalsadaReports'
import { Activity } from './pages/Activity'
import { MessagesLayout } from './pages/MessagesLayout'
import { MessagesEmptyPlaceholder } from './pages/MessagesEmptyPlaceholder'
import { ChatPage } from './pages/ChatPage'

function RootGate() {
  const { onboardingDone } = useApp()
  if (onboardingDone) return <Navigate to="/home" replace />
  return <Onboarding />
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<RootGate />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/bike/:id" element={<BikeDetailPage />} />
        <Route path="/booking/confirm" element={<BookingConfirm />} />
        <Route path="/ride/active" element={<ActiveRidePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/list-bike" element={<ListBike />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/kalsada" element={<KalsadaReports />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/messages" element={<MessagesLayout />}>
          <Route index element={<MessagesEmptyPlaceholder />} />
          <Route path=":chatId" element={<ChatPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppLayout>
  )
}
