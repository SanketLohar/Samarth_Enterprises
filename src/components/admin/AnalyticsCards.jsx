import { Package, Inbox, Briefcase, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AnalyticsCards() {
  const { products, enquiries, productEnquiries, visibleProducts } = useApp()

  const pendingEnquiries = enquiries.filter((e) => e.status === 'New').length
  const pendingProductEnquiries = (productEnquiries || []).filter((e) => e.status === 'New').length
  const totalPendingCount = pendingEnquiries + pendingProductEnquiries
  const lowStockCount = products.filter((p) => typeof p.stock === 'number' && p.stock < 5).length
  
  const totalJobsDone = enquiries.filter(e => 
    ['Resolved', 'Pending Billing', 'Partially Paid', 'Warranty Service'].includes(e.status)
  ).length

  const cards = [
    { label: 'Total Products', value: products.length, icon: Package, iconBox: 'bg-cyan-50 text-cyan-600' },
    { label: 'Jobs Done', value: totalJobsDone, icon: Briefcase, iconBox: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Enquiries', value: totalPendingCount, icon: Inbox, iconBox: 'bg-amber-50 text-amber-600' },
    { label: 'Low Stock Warnings', value: lowStockCount, icon: AlertTriangle, iconBox: 'bg-rose-50 text-rose-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, iconBox }) => (
        <div key={label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-3 ${iconBox}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-800">{value}</p>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
