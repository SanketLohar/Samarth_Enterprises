import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function HelperLayout() {
  const { authReady, isAuthenticated, isTechnician } = useApp()

  // GATE 1: Auth + role resolution still in flight — show spinner
  if (!authReady) {
    return (
      <div className="min-h-screen bg-brand-deep flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/70 font-medium tracking-wide">Verifying Security Credentials...</p>
        </div>
      </div>
    )
  }

  // GATE 2: Not authenticated — send to login
  if (!isAuthenticated) return <Navigate to="/login" replace />

  // GATE 3: Authenticated but NOT a technician — bounce to admin portal
  if (!isTechnician) return <Navigate to="/admin" replace />

  // GATE 4: Technician confirmed — render helper portal
  return <Outlet />
}
