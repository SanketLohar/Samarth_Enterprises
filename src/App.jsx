import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import SplashLoader from './components/layout/SplashLoader'
import ScrollToTop from './components/layout/ScrollToTop'
import Layout from './components/layout/Layout'

// Public Pages
import Home from './pages/Home'
import Products from './pages/Products'
import Services from './pages/Services'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminServices from './pages/admin/AdminServices'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminStaff from './pages/admin/AdminStaff'

// Helper Portal
import HelperLogin from './pages/helper/HelperLogin'
import HelperDashboard from './pages/helper/HelperDashboard'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SplashLoader />
        <Routes>
          {/* Public */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="services" element={<Services />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin */}
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="staff" element={<AdminStaff />} />
          </Route>

          {/* Helper Portal */}
          <Route path="helper/login" element={<HelperLogin />} />
          <Route path="helper/dashboard" element={<HelperDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
