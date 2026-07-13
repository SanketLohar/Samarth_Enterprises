import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const location = useLocation()
  const { pathname } = location

  useEffect(() => {
    // Forcefully snap the viewport back to the absolute top on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Global Metadata / Title Mapping
    if (pathname.startsWith('/products/')) {
      // Allow the dynamic ProductDetail component to mount and inject its own specific title
      return;
    }

    switch (pathname) {
      case '/':
        document.title = "Samarth Enterprises | Premium Water Purifiers";
        break;
      case '/about':
        document.title = "About Us | Samarth Enterprises";
        break;
      case '/services':
        document.title = "Expert Services & AMC | Samarth Enterprises";
        break;
      case '/products':
        document.title = "Our Products | Samarth Enterprises";
        break;
      case '/contact':
      case '/enquire':
        document.title = "Contact & Support | Samarth Enterprises";
        break;
      case '/login':
        document.title = "Secure Portal Login | Samarth Enterprises";
        break;
      case '/admin':
      case '/admin/overview':
        document.title = "Admin Control Panel | Samarth Enterprises";
        break;
      case '/admin/enquiries':
        document.title = "Enquiry Inbox | Admin Hub";
        break;
      case '/admin/services':
        document.title = "Service Catalog | Admin Hub";
        break;
      case '/admin/staff':
        document.title = "Staff Management | Admin Hub";
        break;
      case '/helper/dashboard':
        document.title = "Technician Workstation | Portal";
        break;
      default:
        document.title = "Samarth Enterprises";
    }
  }, [location, pathname])

  return null
}
