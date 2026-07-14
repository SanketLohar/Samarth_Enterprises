import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'

export default function JobHistory() {
  const { enquiries } = useApp()
  const history = enquiries.filter(e => e.status === 'Resolved' || e.status === 'Deal Done')
  const [expanded, setExpanded] = useState({}) // { [id]: boolean }

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const formatDate = (ts) => {
    if (!ts) return '—'
    const d = ts?.toDate?.() || new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-brand-dark">Job History</h1>
        <p className="text-sm text-brand-muted mt-1">
          A comprehensive ledger of all resolved field operations and payment collections.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-brand-muted font-medium">No completed jobs yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full scrollbar-thin">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-4 font-semibold text-gray-500 whitespace-nowrap">Job ID & Date</th>
                  <th className="px-4 py-4 font-semibold text-gray-500 whitespace-nowrap">Technician</th>
                  <th className="px-4 py-4 font-semibold text-gray-500">Client Details</th>
                  <th className="px-4 py-4 font-semibold text-gray-500">Service Rendered</th>
                  <th className="px-4 py-4 font-semibold text-gray-500 whitespace-nowrap">Financial Summary</th>
                  <th className="px-4 py-4 font-semibold text-gray-500 text-center">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 align-top">
                      <p className="font-mono text-xs text-brand-cyan mb-1 uppercase font-bold">#{job.id.slice(-6)}</p>
                      <p className="text-gray-400 text-[11px] whitespace-nowrap font-medium">{formatDate(job.resolvedAt || job.updatedAt)}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-gray-800">{job.assignedToName || 'Unknown'}</p>
                    </td>
                    <td className="px-4 py-4 align-top max-w-[200px]">
                      <p className="font-bold text-gray-800">{job.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{job.phone}</p>
                      <p className="text-gray-400 text-xs mt-1 truncate" title={job.address}>{job.address}</p>
                    </td>
                    <td className="px-4 py-4 align-top max-w-[150px]">
                      <p className="text-gray-700 font-medium whitespace-normal leading-relaxed">{job.productName || 'General Service'}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      {job.paymentCollectionStatus ? (
                        <div className="inline-flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">
                            {job.paymentCollectionStatus}
                          </span>
                          {job.amountCollected && (
                            <span className="text-emerald-600 font-extrabold">₹ {Number(job.amountCollected).toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">No Data</span>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                      {job.technicianNotes ? (
                        <div className="min-w-[200px]">
                          <button 
                            onClick={() => toggleExpand(job.id)}
                            className="flex items-center justify-center w-full gap-1.5 py-1.5 rounded bg-gray-50 border border-gray-200 text-brand-cyan hover:bg-white hover:border-brand-cyan hover:shadow-sm text-xs font-bold transition-all"
                          >
                            {expanded[job.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            {expanded[job.id] ? 'Hide Remarks' : 'View Remarks'}
                          </button>
                          {expanded[job.id] && (
                            <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-700 italic shadow-inner">
                              "{job.technicianNotes}"
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs text-center block w-full">None provided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
