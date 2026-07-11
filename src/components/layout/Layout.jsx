import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import RouteTransitionOverlay from './RouteTransitionOverlay'
import WhatsAppButton from '../ui/WhatsAppButton'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <RouteTransitionOverlay />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  )
}
