import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { useAuth } from './context/AuthContext'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { BikeDetailPage } from './pages/BikeDetailPage'
import { BookingConfirm } from './pages/BookingConfirm'
import { ActiveRidePage } from './pages/ActiveRidePage'
import { PostRideReviewPage } from './pages/PostRideReviewPage'
import { Dashboard } from './pages/Dashboard'
import { ListBike } from './pages/ListBike'
import { Profile } from './pages/Profile'
import { NotificationsPage } from './pages/NotificationsPage'
import { HelpSupportPage } from './pages/HelpSupportPage'
import { PaymentMethodsPage } from './pages/PaymentMethodsPage'
import { KalsadaReports } from './pages/KalsadaReports'
import { Activity } from './pages/Activity'
import { MessagesLayout } from './pages/MessagesLayout'
import { MessagesEmptyPlaceholder } from './pages/MessagesEmptyPlaceholder'
import { ChatPage } from './pages/ChatPage'
import { LoginPage } from './pages/LoginPage'

export function RootGate() {
  const { onboardingDone } = useApp()
  const { isSupabaseConfigured, isAuthenticated } = useAuth()

  if (!onboardingDone) return <Onboarding />

  if (isSupabaseConfigured && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to="/home" replace />
}

/** Authenticated + demo (no Supabase): full app. */
export function AuthenticatedAppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/home" replace />} />
      <Route path="/" element={<RootGate />} />
      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/bike/:id" element={<BikeDetailPage />} />
      <Route path="/booking/confirm" element={<BookingConfirm />} />
      <Route path="/ride/active" element={<ActiveRidePage />} />
      <Route path="/ride/review" element={<PostRideReviewPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/list-bike" element={<ListBike />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/notifications" element={<NotificationsPage />} />
      <Route path="/profile/payment-methods" element={<PaymentMethodsPage />} />
      <Route path="/profile/help" element={<HelpSupportPage />} />
      <Route path="/kalsada" element={<KalsadaReports />} />
      <Route path="/activity" element={<Activity />} />
      <Route path="/messages" element={<MessagesLayout />}>
        <Route index element={<MessagesEmptyPlaceholder />} />
        <Route path=":chatId" element={<ChatPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

/** Supabase on, not signed in: onboarding + login only. */
export function PreAuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootGate />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
