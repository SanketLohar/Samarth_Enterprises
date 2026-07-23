import { useState, useRef, useEffect } from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, LogOut, ExternalLink, Wrench, Users, Menu, Bell, ClipboardCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import NotificationDropdown from './NotificationDropdown'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/product-enquiries', label: 'Product Enquiries', icon: Package },
  { to: '/admin/service-enquiries', label: 'Service Enquiries', icon: Wrench },
  { to: '/admin/staff', label: 'Manage Staff', icon: Users },
  { to: '/admin/history', label: 'Job History', icon: ClipboardCheck },
]

// ─── MOVED OUTSIDE: NOTIFICATION BELL COMPONENT TO FIX MOUNTING RESETS ───
function NotificationBell({ isMobile, notifications, hasUnread }) {
  const [showNotifs, setShowNotifs] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && notifRef.current.contains(event.target)) {
        return
      }
      setShowNotifs(false)
    }
    
    if (showNotifs) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifs])

  return (
    <div className="relative" ref={notifRef}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowNotifs(prev => !prev);
        }}
        className={`transition-colors ${
          isMobile 
            ? 'p-2 rounded-lg text-white hover:bg-white/10' 
            : 'relative p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-600'
        }`}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      {showNotifs && (
        <NotificationDropdown notifications={notifications} onClose={() => setShowNotifs(false)} />
      )}
    </div>
  )
}

export default function AdminLayout() {
  const { authReady, isAuthenticated, isTechnician, logout, enquiries, productEnquiries, notifications } = useApp()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout click execution failed:", error)
    }
  }

  const hasUnread = notifications ? notifications.some(n => n.status === 'unread') : false;

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

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isTechnician) return <Navigate to="/helper/dashboard" replace />

  const newServiceEnquiries = enquiries.filter((e) => e.status === 'New').length
  const newProductEnquiries = productEnquiries?.filter((e) => e.status === 'New').length || 0

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/images/company_logo.png" alt="Samarth Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="font-bold text-white text-sm leading-tight">Samarth Admin</h2>
          <p className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase mt-0.5">DASHBOARD</p>
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
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all ${
                active ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800/80 font-medium'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {label}
              </span>
              {label === 'Service Enquiries' && newServiceEnquiries > 0 && (
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold px-2.5 py-0.5 text-xs rounded-full">
                  {newServiceEnquiries}
                </span>
              )}
              {label === 'Product Enquiries' && newProductEnquiries > 0 && (
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold px-2.5 py-0.5 text-xs rounded-full">
                  {newProductEnquiries}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/80 w-full transition-all font-medium">
          <ExternalLink className="w-4 h-4" /> View Website
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all font-medium">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex p-4 md:p-6 gap-4 md:gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white rounded-3xl p-5 shadow-xl shadow-slate-900/10 flex-col shrink-0 justify-between h-[calc(100vh-2rem)] sticky top-4">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-5 flex flex-col shadow-xl transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Top Bar — sticky, takes real space so content never overlaps */}
        <div className="hidden lg:flex items-center justify-end px-6 py-3 bg-[#EEF2F6] sticky top-0 z-20 shrink-0">
          <NotificationBell notifications={notifications} hasUnread={hasUnread} isMobile={false} />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-white text-gray-900 px-4 py-3 sticky top-0 z-30 rounded-2xl shadow-sm border border-gray-100 relative mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-900">
              <Menu className="w-6 h-6" />
            </button>
            <img src="/images/company_logo.png" alt="Samarth" className="h-7 w-auto" />
            <span className="font-bold text-sm text-gray-900">Admin Panel</span>
          </div>
          <NotificationBell notifications={notifications} hasUnread={hasUnread} isMobile={false} />
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}