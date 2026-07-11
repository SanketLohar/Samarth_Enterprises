import { useState } from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Inbox, LogOut, ExternalLink, Wrench, Users, Menu } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/staff', label: 'Manage Staff', icon: Users },
]

export default function AdminLayout() {
  // All auth state is fully resolved in AppContext — no local Firestore calls needed
  const { authReady, isAuthenticated, isTechnician, logout, enquiries } = useApp()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  // GATE 3: Authenticated but is a technician — bounce to helper portal
  if (isTechnician) return <Navigate to="/helper/dashboard" replace />

  // GATE 4: Master Administrator confirmed — render admin panel
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/images/company_logo.png" alt="Samarth" className="h-9 w-auto" />
          <div>
            <p className="font-bold text-sm leading-tight">Samarth Admin</p>
            <p className="text-[10px] text-white/40 tracking-wider uppercase mt-0.5">Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => {
          const active = end ? location.pathname === '/admin' : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {label}
              </span>
              {label === 'Enquiries' && newEnquiries > 0 && (
                <span className="bg-brand-cyan text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {newEnquiries}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition">
          <ExternalLink className="w-4 h-4" /> View Website
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-white/5 w-full transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-brand-dark text-white flex-col shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white flex flex-col shadow-xl transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-4 bg-brand-dark text-white px-4 py-3 sticky top-0 z-30 shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
          <img src="/images/company_logo.png" alt="Samarth" className="h-7 w-auto" />
          <span className="font-bold text-sm">Admin Panel</span>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}