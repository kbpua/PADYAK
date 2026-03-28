import { Loader2 } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { AppLayout } from './components/layout/AppLayout'
import { AuthenticatedAppRoutes, PreAuthRoutes } from './AppMainRoutes'

export default function App() {
  const { authReady, isSupabaseConfigured, isAuthenticated } = useAuth()

  if (!authReady) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-surface">
        <Loader2 className="h-10 w-10 animate-spin text-primary" strokeWidth={2} />
      </div>
    )
  }

  if (!isSupabaseConfigured) {
    return (
      <AppLayout>
        <AuthenticatedAppRoutes />
      </AppLayout>
    )
  }

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <PreAuthRoutes />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <AuthenticatedAppRoutes />
    </AppLayout>
  )
}
