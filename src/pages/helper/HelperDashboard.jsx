import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { CheckCircle2, LogOut, Wrench, MapPin, Package, User, Phone, Navigation, Save, AlertTriangle } from 'lucide-react'
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

const PAYMENT_OPTIONS = [
  "UPI / QR Code",
  "Cash",
  "NetBanking",
  "Pending Admin Billing",
  "Warranty Claim"
]

export default function HelperDashboard() {
  const { currentUser, isAuthenticated, logout, technicians, addNotification } = useApp()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({}) // Store notes per task ID
  const [payments, setPayments] = useState({}) // Store payment status per task ID
  const [amounts, setAmounts] = useState({}) // Store amount collected per task ID
  const [activeTab, setActiveTab] = useState('active') // 'active' or 'history'
  const [errorToast, setErrorToast] = useState(null)

  // Find the technician profile for the dynamic header
  const currentUserProfile = technicians.find(t => t.uid === currentUser?.uid || t.id === currentUser?.uid)

  const activeTasks = tasks.filter(t => t.status === 'New' || t.status === 'In Progress' || t.status === 'On Hold' || t.status === 'Issue Reported')
  const historyTasks = tasks.filter(t => t.status === 'Resolved' || t.status === 'Pending Billing' || t.status === 'Deal Done' || t.status === 'Partially Paid' || t.status === 'Warranty Service')
    .sort((a, b) => {
      const timeA = a.resolvedAt?.seconds ? a.resolvedAt.seconds * 1000 : (a.resolvedAt?.toMillis?.() || new Date(a.resolvedAt || 0).getTime());
      const timeB = b.resolvedAt?.seconds ? b.resolvedAt.seconds * 1000 : (b.resolvedAt?.toMillis?.() || new Date(b.resolvedAt || 0).getTime());
      return timeB - timeA;
    });

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login', { replace: true })
      return
    }

    if (!currentUser) return

    let tasksData = { enquiries: [], productInquiries: [] }
    
    const mergeTasks = () => {
       const merged = [...tasksData.enquiries, ...tasksData.productInquiries]
       merged.sort((a, b) => {
         const da = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
         const db2 = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
         return db2 - da
       })
       setTasks(merged)
       setLoading(false)
       
       merged.forEach(task => {
         setNotes(prev => ({ ...prev, [task.id]: prev[task.id] ?? (task.technicianNotes || '') }))
         setPayments(prev => ({ ...prev, [task.id]: prev[task.id] ?? (task.paymentCollectionStatus || '') }))
         setAmounts(prev => ({ ...prev, [task.id]: prev[task.id] ?? (task.amountCollected || '') }))
       })
    }

    const qEnquiries = query(
      collection(db, "enquiries"),
      where("assignedToId", "==", currentUser.uid)
    )
    const unsubEnquiries = onSnapshot(qEnquiries, (snapshot) => {
      tasksData.enquiries = snapshot.docs.map(doc => ({ id: doc.id, _collection: 'enquiries', ...doc.data() }))
      mergeTasks()
    })

    const qProducts = query(
      collection(db, "product_inquiries"),
      where("assignedToId", "==", currentUser.uid)
    )
    const unsubProducts = onSnapshot(qProducts, (snapshot) => {
      tasksData.productInquiries = snapshot.docs.map(doc => ({ id: doc.id, _collection: 'product_inquiries', ...doc.data() }))
      mergeTasks()
    })

    return () => {
      unsubEnquiries()
      unsubProducts()
    }
  }, [isAuthenticated, navigate, currentUser])

  const handleUpdateTask = async (task, actionType) => {
    try {
      const closeoutNotesText = notes[task.id] || ""
      const paymentStatus = payments[task.id] || ""
      const collectedAmount = amounts[task.id] || ""
      
      if (actionType === 'Resolved') {
        if (!PAYMENT_OPTIONS.includes(paymentStatus)) {
          setErrorToast('Please select a valid Payment Mode.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }
        if (collectedAmount === '' || Number(collectedAmount) < 0) {
          setErrorToast('Amount Collected must be 0 or greater.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }
        if (!closeoutNotesText.trim() || closeoutNotesText.trim().length < 10) {
          setErrorToast('Technical Remarks must be at least 10 characters describing the work.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }
      }

      const updateData = {
        technicianNotes: closeoutNotesText,
        paymentCollectionStatus: paymentStatus,
        amountCollected: collectedAmount,
        updatedAt: new Date().toISOString()
      }

      if (actionType === 'Resolved') {
        const targetStatus = paymentStatus === "Pending Admin Billing" ? "Pending Billing" : "Resolved";
        updateData.status = targetStatus;
        updateData.resolvedAt = new Date().toISOString()
        addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          type: targetStatus === "Pending Billing" ? "pending_billing" : "job_completed",
          title: targetStatus === "Pending Billing" ? "Billing Required" : "Job Completed",
          message: targetStatus === "Pending Billing" 
            ? `${currentUserProfile?.name || 'Technician'} finished service for ${task.name}. Awaiting admin invoicing.`
            : `${currentUserProfile?.name || 'Technician'} marked job for ${task.name} as: Resolved`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: paymentStatus,
          amountCollected: Number(collectedAmount),
          remarks: closeoutNotesText,
        })
      } else if (actionType === 'Partially Paid') {
        updateData.status = 'Partially Paid'
        updateData.resolvedAt = new Date().toISOString()
        addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          type: 'partial_payment',
          title: 'Partial Payment Collected',
          message: `${currentUserProfile?.name || 'Technician'} collected a partial payment of ₹${collectedAmount} via ${paymentStatus}.`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: paymentStatus,
          amountCollected: Number(collectedAmount),
          remarks: closeoutNotesText,
        })
      } else if (actionType === 'Warranty Service') {
        updateData.status = 'Warranty Service'
        updateData.paymentCollectionStatus = 'Warranty Claim'
        updateData.amountCollected = 0
        updateData.resolvedAt = new Date().toISOString()
        addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          type: 'warranty_job',
          title: 'Warranty Service Closed',
          message: `${currentUserProfile?.name || 'Technician'} finalized a free warranty repair for client ${task.name}.`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: 'Warranty Claim',
          amountCollected: 0,
          remarks: closeoutNotesText,
        })
      } else if (actionType === 'Hold') {
        updateData.status = 'On Hold'
        addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          message: `${currentUserProfile?.name || 'Technician'} put job on HOLD for client ${task.name}`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: paymentStatus,
          amountCollected: Number(collectedAmount) || 0,
          remarks: closeoutNotesText || 'No remarks provided',
        })
      }
      // If actionType === 'Save', we only update the notes and payment status, keeping current status

      await updateDoc(doc(db, task._collection || "enquiries", task.id), updateData)
      
      // Optional: show a small success toast here in a real app
    } catch (err) {
      console.error(`Failed to execute ${actionType} on task:`, err)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'On Hold':
      case 'Issue Reported':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'New':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <div className="w-full max-w-md mx-auto px-4 box-border pb-10">
      {errorToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl shadow-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold">{errorToast}</p>
        </div>
      )}

      {/* Personalized Header */}
      <header className="bg-brand-deep text-white px-4 py-6 sticky top-0 z-30 shadow-lg w-full box-border rounded-b-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-brand-cyan/20 p-3 rounded-xl border border-brand-cyan/30">
              <Wrench className="w-6 h-6 text-brand-cyan" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Welcome back, {currentUserProfile?.name || 'Technician'}
              </h1>
              <p className="text-xs text-white/60 mt-0.5">
                Specialization: {currentUserProfile?.expertise || 'General Systems'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center p-2 text-white/60 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition" title="Sign Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="w-full py-6 space-y-4 box-border">
        {/* Tab Navigation */}
        <div className="flex p-1 bg-gray-200/50 rounded-xl mb-6 w-full box-border">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'active' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Jobs
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Job History
          </button>
        </div>

        {activeTab === 'active' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">Current Assignments</h2>
              <span className="text-xs font-bold bg-brand-cyan/10 text-brand-cyan px-3 py-1 rounded-full">
                {activeTasks.length} Assigned
              </span>
            </div>

            {activeTasks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-lg font-bold text-gray-400">No tasks assigned yet</p>
                <p className="text-sm text-gray-400 mt-1">Check back later or contact your admin.</p>
              </div>
            ) : (
              activeTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-brand-dark">
                    <User className="w-4 h-4 text-brand-cyan" />
                    <h3 className="font-bold text-base">{task.name}</h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getStatusBadge(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3">
                    <Package className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 font-medium">{task.productName || 'General Service'}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 leading-relaxed">{task.address || 'No address provided'}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 font-medium">{task.phone || 'No phone provided'}</p>
                  </div>
                  {task.message && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wider">Client Message</p>
                      <p className="text-sm text-gray-700 italic">"{task.message}"</p>
                    </div>
                  )}
                </div>

                {/* Communication Action Bar */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <a
                    href={`tel:${task.phone}`}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Client
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </a>
                </div>

                {/* Field Operational Inputs */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3 w-full box-border">
                    <div className="w-full">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Payment Mode <span className="text-red-500 ml-1">*</span></label>
                      <select
                        value={payments[task.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPayments({ ...payments, [task.id]: val });
                          if (val === 'Pending Admin Billing' || val === 'Warranty Claim') {
                            setAmounts({ ...amounts, [task.id]: '0' });
                          }
                        }}
                        className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 bg-white"
                      >
                        <option value="">-- Select --</option>
                        {PAYMENT_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Amt Collected <span className="text-red-500 ml-1">*</span></label>
                      <input
                        type="number"
                        min="0"
                        placeholder="₹ 0"
                        value={amounts[task.id] || ''}
                        disabled={payments[task.id] === 'Pending Admin Billing' || payments[task.id] === 'Warranty Claim'}
                        onChange={(e) => setAmounts({ ...amounts, [task.id]: e.target.value })}
                        className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 disabled:bg-gray-100 disabled:text-gray-400 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Technical Remarks <span className="text-red-500 ml-1">*</span></label>
                    <textarea
                      rows="2"
                      placeholder="Enter work summary..."
                      value={notes[task.id] || ''}
                      onChange={(e) => setNotes({ ...notes, [task.id]: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 resize-none bg-white"
                    ></textarea>
                  </div>
                </div>

                {/* Multi-State Action Footer */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleUpdateTask(task, 'Hold')}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors mb-1"
                  >
                    <AlertTriangle className="w-4 h-4" /> Report Issue / Hold
                  </button>
                  
                  {payments[task.id] === 'Warranty Claim' ? (
                    <button
                      onClick={() => handleUpdateTask(task, 'Warranty Service')}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-cyan-600 text-white hover:bg-cyan-700 transition-all duration-200 shadow-lg shadow-cyan-600/20"
                    >
                      🛠️ Submit Warranty Closeout
                    </button>
                  ) : payments[task.id] === 'Pending Admin Billing' ? (
                    <button
                      onClick={() => handleUpdateTask(task, 'Resolved')}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-brand-deep text-white hover:bg-brand-cyan transition-all duration-200 shadow-lg shadow-brand-deep/20"
                    >
                      ⏳ Submit for Admin Billing
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateTask(task, 'Partially Paid')}
                        className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-bold text-[11px] border-2 border-amber-400 text-purple-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                      >
                        🌗 Submit as Partial Payment
                      </button>
                      <button
                        onClick={() => handleUpdateTask(task, 'Resolved')}
                        className="flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-bold text-[11px] bg-brand-deep text-white hover:bg-brand-cyan transition-colors shadow-lg shadow-brand-deep/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Job Resolved
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        </>
        )}

        {activeTab === 'history' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 text-lg">Completed Jobs</h2>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                {historyTasks.length} Done
              </span>
            </div>

            {historyTasks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <CheckCircle2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-lg font-bold text-gray-400">No completed jobs yet</p>
              </div>
            ) : (
              historyTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between pb-3 border-b border-gray-100 mb-3">
                      <div>
                        <h3 className="font-bold text-base text-brand-dark">{task.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Completed: {task.resolvedAt || task.updatedAt ? new Date(task.resolvedAt?.seconds ? task.resolvedAt.seconds * 1000 : (task.resolvedAt?.toMillis?.() || task.resolvedAt || task.updatedAt)).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          }) : 'Recent'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-200">
                        {task.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Package className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{task.productName || 'General Service'}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">{task.phone}</p>
                      </div>
                    </div>

                    {(task.technicianNotes || task.paymentCollectionStatus) && (
                      <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                        {(task.paymentCollectionStatus || task.amountCollected) && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-500 uppercase tracking-wider">Payment:</span>
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <span className="font-semibold">{task.paymentCollectionStatus}</span>
                              {task.amountCollected && <span className="bg-white px-2 border rounded font-bold text-emerald-600">₹{task.amountCollected}</span>}
                            </div>
                          </div>
                        )}
                        {task.technicianNotes && (
                          <div className="text-xs">
                            <span className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Technical Remarks:</span>
                            <span className="text-slate-700 italic">"{task.technicianNotes}"</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </>
        )}
      </div>
    </div>
    </div>
  )
}
