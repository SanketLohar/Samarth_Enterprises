import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Badge from '../ui/Badge'
import { ShieldCheck, X } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

const ALL_STATUSES = ['New', 'Contacted', 'Resolved', 'Deal Done', 'In Progress']

export default function EnquiriesTable() {
  const { enquiries, updateEnquiryStatus, updateProductStock, technicians } = useApp()

  // Deal Done confirmation modal state
  const [dealModal, setDealModal] = useState(null) // { enquiry }
  const [qty, setQty] = useState('')
  const [pendingStatus, setPendingStatus] = useState({}) // { [id]: prevStatus }

  const handleStatusChange = (enq, newStatus) => {
    if (newStatus === 'Deal Done') {
      setDealModal({ enquiry: enq })
      return
    }
    updateEnquiryStatus(enq.id, newStatus)
  }

  const handleDealConfirm = async () => {
    const parsedQty = parseInt(qty, 10)
    if (!parsedQty || parsedQty < 1) return

    const { enquiry } = dealModal
    await updateEnquiryStatus(enquiry.id, 'Deal Done')

    if (enquiry.productId) {
      await updateProductStock(enquiry.productId, parsedQty)
    }

    setDealModal(null)
    setQty('')
  }

  const handleDealCancel = () => {
    setDealModal(null)
    setQty('')
  }

  const handleAssignTechnician = async (enquiryId, techId) => {
    if (!techId) return
    const tech = technicians.find((t) => t.id === techId)
    if (!tech) return
    try {
      await updateDoc(doc(db, 'enquiries', enquiryId), {
        assignedToId: tech.uid || tech.id, // Support old and new schema
        assignedToName: tech.name,
        status: 'In Progress'
      })
    } catch (err) {
      console.error('Error assigning technician:', err)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return '—'
    const d = ts?.toDate?.() || new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-dark mb-6">Enquiries Inbox</h2>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          No enquiries yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto w-full block whitespace-nowrap scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Phone</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Product</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Address</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Message</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Assign Technician</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(e.createdAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-dark">{e.name}</p>
                      {e.email && <p className="text-xs text-gray-400 mt-0.5">{e.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{e.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] whitespace-normal">{e.productName || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[180px] whitespace-normal">{e.address || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[200px] whitespace-normal">{e.message || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={e.assignedToId || ''}
                        onChange={(ev) => handleAssignTechnician(e.id, ev.target.value)}
                        className="text-xs font-medium px-2 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 text-gray-700 max-w-[120px]"
                      >
                        <option value="">Unassigned</option>
                        {technicians.map((t) => (
                          <option key={t.id} value={t.uid || t.id}>{t.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => handleStatusChange(e, ev.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 ${
                          e.status === 'Deal Done' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          e.status === 'In Progress' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                          e.status === 'New' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                          'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deal Done Confirmation Modal */}
      {dealModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-brand-dark">Confirm Deal Done</h3>
              </div>
              <button onClick={handleDealCancel} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-brand-muted mb-1">
              Product: <span className="font-semibold text-brand-dark">{dealModal.enquiry.productName}</span>
            </p>
            <p className="text-sm text-brand-muted mb-4">
              Client: <span className="font-semibold text-brand-dark">{dealModal.enquiry.name}</span>
            </p>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Quantity Sold *</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 mb-4"
              placeholder="e.g. 2"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDealConfirm}
                disabled={!qty || parseInt(qty) < 1}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl py-2.5 text-sm transition disabled:opacity-50"
              >
                Confirm & Deduct Stock
              </button>
              <button
                onClick={handleDealCancel}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl py-2.5 text-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
