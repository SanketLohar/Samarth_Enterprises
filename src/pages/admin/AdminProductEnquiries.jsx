import EnquiriesTable from '../../components/admin/EnquiriesTable'
import { useApp } from '../../context/AppContext'

export default function AdminProductEnquiries() {
  const { productEnquiries } = useApp()
  const totalLeads = productEnquiries.length;
  const openDiscussions = productEnquiries.filter(e => ['In Discussion', 'Quotation Sent', 'No Response'].includes(e.status)).length;
  const consultationCompleted = productEnquiries.filter(e => e.status === 'Consultation Completed').length;
  const issueReported = productEnquiries.filter(e => e.status === 'Issue Reported').length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-brand-dark">Product Enquiries</h1>
        <p className="text-sm text-brand-muted mt-1">
          All inbound product enquiries from the "Request a Quote" modal. Update status to track your sales pipeline.
        </p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-slate-800">{totalLeads}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Total Leads</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{openDiscussions}</p>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Active Discussions</p>
        </div>

        <div className="bg-teal-50 p-5 rounded-xl border border-teal-100 shadow-sm">
          <p className="text-2xl font-bold text-teal-700">{consultationCompleted}</p>
          <p className="text-xs font-semibold text-teal-500 mt-1 uppercase tracking-wider">Consultation Completed</p>
        </div>

        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 shadow-sm">
          <p className="text-2xl font-bold text-amber-700">{issueReported}</p>
          <p className="text-xs font-semibold text-amber-500 mt-1 uppercase tracking-wider">Issue Reported</p>
        </div>
      </div>

      {totalLeads === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-brand-muted font-medium">No product enquiries yet.</p>
        </div>
      ) : (
        <EnquiriesTable data={productEnquiries} collectionName="product_inquiries" title="Product Enquiries" currentView="products" />
      )}
    </div>
  )
}
