import EnquiriesTable from '../../components/admin/EnquiriesTable'
import { useApp } from '../../context/AppContext'

export default function AdminProductEnquiries() {
  const { productEnquiries } = useApp()
  const counts = {
    total: productEnquiries.length,
    new: productEnquiries.filter((e) => e.status === 'New').length,
    inProgress: productEnquiries.filter((e) => e.status === 'In Progress').length,
    resolved: productEnquiries.filter((e) => e.status === 'Resolved').length,
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-brand-dark">Product Enquiries</h1>
        <p className="text-sm text-brand-muted mt-1">
          All inbound product enquiries from the "Request a Quote" modal. Update status to track your sales pipeline.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'All Enquiries', value: counts.total, bg: 'bg-gray-50', text: 'text-gray-800' },
          { label: 'New', value: counts.new, bg: 'bg-amber-50', text: 'text-amber-700' },
          { label: 'In Progress', value: counts.inProgress, bg: 'bg-blue-50', text: 'text-blue-700' },
          { label: 'Resolved', value: counts.resolved, bg: 'bg-green-50', text: 'text-green-700' },
        ].map(({ label, value, bg, text }) => (
          <div key={label} className={`${bg} rounded-xl border border-gray-100 p-4`}>
            <p className={`text-2xl font-extrabold ${text}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {counts.total === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-brand-muted font-medium">No product enquiries yet.</p>
        </div>
      ) : (
        <EnquiriesTable data={productEnquiries} collectionName="product_inquiries" title="Product Enquiries" />
      )}
    </div>
  )
}
