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
        className={`p-2 rounded-lg transition-colors ${
          isMobile 
            ? 'text-white hover:bg-white/10' 
            : 'text-gray-500 hover:text-brand-dark hover:bg-gray-100 bg-white border border-gray-200 shadow-sm'
        }`}
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
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
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
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
              {label === 'Service Enquiries' && newServiceEnquiries > 0 && (
                <span className="bg-brand-cyan text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {newServiceEnquiries}
                </span>
              )}
              {label === 'Product Enquiries' && newProductEnquiries > 0 && (
                <span className="bg-brand-cyan text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {newProductEnquiries}
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
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-white/5 w-full transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 bg-brand-dark text-white flex-col shrink-0 shadow-xl">
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
        {/* Desktop Top Bar */}
        <div className="hidden lg:flex items-center justify-end bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-30 shadow-sm">
          <NotificationBell notifications={notifications} hasUnread={hasUnread} isMobile={false} />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between bg-brand-dark text-white px-4 py-3 sticky top-0 z-30 shadow-md relative">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-white">
              <Menu className="w-6 h-6" />
            </button>
            <img src="/images/company_logo.png" alt="Samarth" className="h-7 w-auto" />
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
          <NotificationBell notifications={notifications} hasUnread={hasUnread} isMobile={true} />
        </div>

        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}