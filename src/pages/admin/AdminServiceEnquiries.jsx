import EnquiriesTable from '../../components/admin/EnquiriesTable'
import { useApp } from '../../context/AppContext'

export default function AdminServiceEnquiries() {
  const { enquiries } = useApp()
  // Master collection length
  const totalServiceEnquiries = enquiries.length;
  
  const counts = {
    total: totalServiceEnquiries,
    // 1. New Card: Counts only 'New'
    new: enquiries.filter(e => e.status === 'New').length,
    // 2. In Progress Card: Counts only 'In Progress' (Contacted is now part of this workflow)
    inProgress: enquiries.filter(e => e.status === 'In Progress').length,
    // 3. Pending Billing Card: Financial Consolidation (Combines standard billing + partial balances)
    pending: enquiries.filter(e => ['Pending Billing', 'Partially Paid'].includes(e.status)).length,
    // 4. Resolved Card: Final Resolution Consolidation (Combines fully paid resolutions + free warranty closeouts)
    resolved: enquiries.filter(e => ['Resolved', 'Warranty Service'].includes(e.status)).length,
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-brand-dark">Service Enquiries</h1>
        <p className="text-sm text-brand-muted mt-1">
          All inbound service requests and quotation leads from the Contact page. Update status to track assignments.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'All Enquiries', value: counts.total, bg: 'bg-gray-50', text: 'text-gray-800' },
          { label: 'New', value: counts.new, bg: 'bg-amber-50', text: 'text-amber-700' },
          { label: 'In Progress', value: counts.inProgress, bg: 'bg-blue-50', text: 'text-blue-700' },
          { label: 'Pending Billing', value: counts.pending, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600' },
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
          <div className="text-4xl mb-3">🛠️</div>
          <p className="text-brand-muted font-medium">No service enquiries yet.</p>
        </div>
      ) : (
        <EnquiriesTable data={enquiries} collectionName="enquiries" title="Service Enquiries" currentView="services" />
      )}
    </div>
  )
}
