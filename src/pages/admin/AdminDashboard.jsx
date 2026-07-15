import { useApp } from '../../context/AppContext'
import AnalyticsCards from '../../components/admin/AnalyticsCards'
import EnquiriesTable from '../../components/admin/EnquiriesTable'
import { AlertTriangle, Bell } from 'lucide-react'

export default function AdminDashboard() {
  const { products, enquiries, productEnquiries } = useApp()

  const pendingServiceEnquiries = enquiries.filter((e) => e.status === 'New')
  const pendingProductEnquiries = (productEnquiries || []).filter((e) => e.status === 'New')
  const totalPending = pendingServiceEnquiries.length + pendingProductEnquiries.length

  const getEnquiryTag = (item) => {
    // 1. Explicitly check if it belongs to the product collection stream
    if (item.productName || item._collection === 'product_inquiries') {
      return { label: 'PRODUCT', className: 'bg-blue-50 text-blue-600 border border-blue-200' };
    }
    
    // 2. Strict explicit verification for service modal source
    if (item.enquirySource === 'service' || item.serviceType) {
      return { label: 'SERVICE', className: 'bg-emerald-50 text-emerald-600 border border-emerald-200' };
    }
    
    // 3. Strict explicit verification for contact form source
    if (item.enquirySource === 'contact') {
      return { label: 'CONTACT', className: 'bg-indigo-50 text-indigo-600 border border-indigo-200' };
    }
    
    // 4. Fallback safe check for legacy historical documents
    return { label: 'SERVICE', className: 'bg-emerald-50 text-emerald-600 border border-emerald-200' };
  };

  const combinedEnquiries = [
    ...enquiries,
    ...(productEnquiries || [])
  ].sort((a, b) => {
    const da = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
    const db2 = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
    return db2 - da
  })

  const lowStockProducts = products.filter((p) => typeof p.stock === 'number' && p.stock < 5)

  const alerts = [
    ...lowStockProducts.map((p) => ({
      type: 'warning',
      msg: `Warning: "${p.name}" has only ${p.stock} unit${p.stock !== 1 ? 's' : ''} remaining!`,
    })),
    ...(totalPending > 0
      ? [{ type: 'info', msg: `Alert: ${totalPending} unhandled enquir${totalPending > 1 ? 'ies' : 'y'} remain in queue.` }]
      : []),
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-brand-dark">Dashboard Overview</h1>
        <p className="text-sm text-brand-muted mt-1">
          Welcome back. Here's a live snapshot of your inventory and leads.
        </p>
      </div>

      {/* Operational Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
                alert.type === 'warning'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              {alert.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <Bell className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              {alert.msg}
            </div>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <AnalyticsCards />

      {/* Recent enquiries */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-dark">Recent Enquiries</h2>
          {totalPending > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {totalPending} new
            </span>
          )}
        </div>
        {/* Dashboard shows only name + message snippet */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {combinedEnquiries.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {combinedEnquiries.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0 font-bold text-brand-cyan text-sm">
                    {e.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-dark text-sm truncate flex items-center">
                      {e.name}
                      <span className={`ml-2 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${getEnquiryTag(e).className}`}>
                        [{getEnquiryTag(e).label}]
                      </span>
                    </p>
                    <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">{e.message || 'No message provided.'}</p>
                  </div>
                  <span className={`ml-auto shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    e.status === 'New' ? 'bg-amber-100 text-amber-700' :
                    e.status === 'Deal Done' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{e.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
