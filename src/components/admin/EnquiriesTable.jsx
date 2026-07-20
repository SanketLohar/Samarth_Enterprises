import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Badge from '../ui/Badge'
import { ShieldCheck, X } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

const ALL_STATUSES = ['New', 'In Progress', 'Issue Reported', 'Pending Billing', 'Partially Paid', 'Warranty Service', 'Resolved']
const PRODUCT_STATUSES = ['New', 'In Discussion', 'Quotation Sent', 'Consultation Completed', 'No Response', 'Lost Lead', 'Converted to Client', 'Issue Reported']

export default function EnquiriesTable({ data = [], collectionName = 'enquiries', title = 'Enquiries Inbox', currentView = 'all' }) {
  const { updateProductStock, technicians, consultants } = useApp()

  // Deal Done confirmation modal state
  const [dealModal, setDealModal] = useState(null) // { enquiry }
  const [qty, setQty] = useState('')
  const [pendingStatus, setPendingStatus] = useState({}) // { [id]: prevStatus }

  const handleStatusChange = async (enq, newStatus) => {
    if (newStatus === 'Deal Done') {
      setDealModal({ enquiry: enq })
      return
    }
    try {
      await updateDoc(doc(db, collectionName, enq.id), { status: newStatus })
    } catch (e) { console.error(e) }
  }

  const handleDealConfirm = async () => {
    const parsedQty = parseInt(qty, 10)
    if (!parsedQty || parsedQty < 1) return

    const { enquiry } = dealModal
    try {
      await updateDoc(doc(db, collectionName, enquiry.id), { status: 'Deal Done' })
    } catch (e) { console.error(e) }

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

  const handleAssignStaff = async (enquiryId, staffId) => {
    if (!staffId) return;
    const isProduct = collectionName === 'product_inquiries';
    
    const currentItem = data.find(item => item.id === enquiryId);
    if (currentItem) {
      const protectedStatuses = isProduct 
        ? ['Converted to Client', 'Lost Lead', 'Consultation Completed', 'In Discussion', 'Quotation Sent', 'No Response']
        : ['Resolved', 'Pending Billing', 'Partially Paid', 'Warranty Service'];
        
      if (protectedStatuses.includes(currentItem.status)) {
        console.warn("Operation Denied: Finalized transactions cannot be modified.");
        return;
      }
    }

    const staffList = isProduct ? (consultants || []) : (technicians || []);
    const staff = staffList.find((s) => s.id === staffId || s.uid === staffId);
    if (!staff) return;
    
    try {
      const updatePayload = {
        assignedToId: staff.id, 
        assignedTo: staff.name,
        status: isProduct 
          ? 'In Discussion' 
          : (['In Progress', 'Issue Reported'].includes(currentItem?.status) ? currentItem.status : 'In Progress')
      };

      if (!isProduct) {
        updatePayload.technicianId = staff.id;
        updatePayload.assignedTechnicianId = staff.id;
        updatePayload.assignedTechnicianName = staff.name;
      }

      await updateDoc(doc(db, collectionName, enquiryId), updatePayload);
      console.log(`Successfully assigned ticket to ${staff.name}`);
      
    } catch (err) {
      console.error('Error assigning staff:', err);
    }
  }

  const formatDate = (ts) => {
    if (!ts) return '—'
    const d = ts?.toDate?.() || new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-brand-dark mb-6">{title}</h2>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400">
          No records found.
        </div>
      ) : (
        <>
          {/* ── MOBILE CARD LIST (< md) ── */}
          <div className="md:hidden space-y-3">
            {data.map((e) => {
              const staffList = collectionName === 'product_inquiries' ? (consultants || []) : (technicians || [])
              const statusList = collectionName === 'product_inquiries' ? PRODUCT_STATUSES : ALL_STATUSES
              const assignDisabled = collectionName === 'product_inquiries'
                ? ['Converted to Client', 'Lost Lead', 'Consultation Completed', 'In Discussion', 'Quotation Sent', 'No Response'].includes(e.status)
                : ['Resolved', 'Pending Billing', 'Partially Paid', 'Warranty Service'].includes(e.status)
              const statusDisabled = collectionName === 'product_inquiries'
                ? ['Converted to Client', 'Lost Lead'].includes(e.status)
                : ['Resolved', 'Pending Billing', 'Partially Paid', 'Warranty Service'].includes(e.status)

              return (
                <div key={e.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-brand-dark text-sm">{e.name}</p>
                      {e.email && <p className="text-xs text-gray-400">{e.email}</p>}
                      <p className="text-xs text-gray-500 mt-0.5">{e.phone || '—'}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatDate(e.createdAt)}</span>
                  </div>
                  {e.productName && <p className="text-xs text-gray-600"><span className="font-medium">Product:</span> {e.productName}</p>}
                  {e.address && <p className="text-xs text-gray-500"><span className="font-medium">Address:</span> {e.address}</p>}
                  {e.message && <p className="text-xs text-gray-500 line-clamp-2"><span className="font-medium">Message:</span> {e.message}</p>}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                        {collectionName === 'product_inquiries' ? 'Consultant' : 'Technician'}
                      </label>
                      <select
                        value={e.assignedToId || ''}
                        disabled={assignDisabled}
                        onChange={(ev) => handleAssignStaff(e.id, ev.target.value)}
                        className="w-full appearance-none rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Unassigned</option>
                        {staffList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Status</label>
                      <select
                        value={e.status}
                        disabled={statusDisabled}
                        onChange={(ev) => handleStatusChange(e, ev.target.value)}
                        className="w-full appearance-none rounded-md border px-2.5 py-1.5 text-xs font-semibold shadow-sm outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {statusList.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── DESKTOP TABLE (md+) ── */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-500">Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Phone</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Product</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Address</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Message</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Assign Staff</th>
                    <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((e) => (
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
                        <div className="relative min-w-[140px]">
                          <select
                            value={e.assignedToId || ''}
                            disabled={collectionName === 'product_inquiries' ? ['Converted to Client','Lost Lead','Consultation Completed','In Discussion','Quotation Sent','No Response'].includes(e.status) : ['Resolved','Pending Billing','Partially Paid','Warranty Service'].includes(e.status)}
                            onChange={(ev) => handleAssignStaff(e.id, ev.target.value)}
                            className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-gray-700 shadow-sm outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition:'right 0.5rem center', backgroundSize:'1.25em 1.25em', backgroundRepeat:'no-repeat' }}
                          >
                            <option value="">Unassigned</option>
                            {(collectionName === 'product_inquiries' ? (consultants || []) : (technicians || [])).map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative min-w-[140px]">
                          <select
                            value={e.status}
                            disabled={collectionName === 'product_inquiries' ? ['Converted to Client','Lost Lead'].includes(e.status) : ['Resolved','Pending Billing','Partially Paid','Warranty Service'].includes(e.status)}
                            onChange={(ev) => handleStatusChange(e, ev.target.value)}
                            className={`w-full appearance-none rounded-md border px-3 py-1.5 pr-8 text-xs font-semibold shadow-sm outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                              ['Converted to Client','Deal Done'].includes(e.status) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                              e.status === 'Warranty Service' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                              e.status === 'Quotation Sent' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              e.status === 'Consultation Completed' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                              e.status === 'Lost Lead' ? 'bg-red-50 text-red-700 border-red-200' :
                              ['No Response','Issue Reported'].includes(e.status) ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              e.status === 'Pending Billing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              e.status === 'Partially Paid' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              ['In Progress','In Discussion'].includes(e.status) ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              e.status === 'New' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                              'bg-white border-gray-200 text-gray-700'
                            }`}
                            style={{ backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundPosition:'right 0.5rem center', backgroundSize:'1.25em 1.25em', backgroundRepeat:'no-repeat' }}
                          >
                            {collectionName === 'product_inquiries'
                              ? PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)
                              : ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)
                            }
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
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
