import { Package, Inbox, Eye, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AnalyticsCards() {
  const { products, enquiries, productEnquiries, visibleProducts } = useApp()

  const pendingEnquiries = enquiries.filter((e) => e.status === 'New' || e.status === 'Contacted').length
  const pendingProductEnquiries = (productEnquiries || []).filter((e) => e.status === 'New' || e.status === 'Contacted').length
  const totalPendingCount = pendingEnquiries + pendingProductEnquiries
  const lowStockCount = products.filter((p) => typeof p.stock === 'number' && p.stock < 5).length

  const cards = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-brand-cyan', bg: 'bg-brand-cyan/10' },
    { label: 'Visible Products', value: visibleProducts.length, icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending Enquiries', value: totalPendingCount, icon: Inbox, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Low Stock Warnings', value: lowStockCount, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className={`${bg} p-3 rounded-xl shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-extrabold text-brand-dark mt-0.5">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
