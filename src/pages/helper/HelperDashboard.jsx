import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { CheckCircle2, LogOut, Wrench, MapPin, Package, User, Phone, Navigation, AlertTriangle } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

const PAYMENT_OPTIONS = [
  "UPI / QR Code",
  "Cash",
  "NetBanking",
  "Pending Admin Billing",
  "Warranty Claim"
]

export default function HelperDashboard() {
  const { currentUser, isAuthenticated, logout, technicians, consultants, enquiries, productEnquiries, addNotification } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState({}) 
  const [payments, setPayments] = useState({}) 
  const [amounts, setAmounts] = useState({}) 
  const [activeTab, setActiveTab] = useState('active') 
  const [errorToast, setErrorToast] = useState(null)
  const [successToast, setSuccessToast] = useState(null)

  // Resolve profile context mapping based on operational role
  const currentUserProfile = currentUser?.role === 'consultant' 
    ? (consultants || []).find(c => c.uid === currentUser?.uid || c.id === currentUser?.uid)
    : (technicians || []).find(t => t.uid === currentUser?.uid || t.id === currentUser?.uid)

  // Uniform filtering matrix capturing IDs, fallback strings, and technician handles
  const assignedTasks = currentUser?.role === 'consultant'
    ? (productEnquiries || []).filter(lead => 
        lead.assignedToId === currentUser?.uid || 
        lead.assignedTo === currentUser?.uid ||
        lead.assignedTo === currentUserProfile?.name ||
        lead.assignedTechnicianId === currentUser?.uid ||
        lead.assignedTechnician === currentUserProfile?.name
      )
    : (enquiries || []).filter(job => 
        job.assignedToId === currentUser?.uid || 
        job.technicianId === currentUser?.uid || 
        job.assignedTechnicianId === currentUser?.uid ||
        job.assignedTo === currentUserProfile?.name ||
        job.assignedTechnician === currentUserProfile?.name
      );

  const activeTasks = assignedTasks.filter(task => 
    ['New', 'In Progress', 'On Hold', 'Issue Reported', 'In Discussion', 'Quotation Sent', 'No Response'].includes(task.status)
  );
  
  const historyTasks = assignedTasks.filter(task => 
    ['Resolved', 'Pending Billing', 'Deal Done', 'Partially Paid', 'Warranty Service', 'Consultation Completed', 'Converted to Client', 'Lost Lead'].includes(task.status)
  ).sort((a, b) => {
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

    if (assignedTasks.length > 0) {
      assignedTasks.forEach(task => {
         setNotes(prev => ({ ...prev, [task.id]: prev[task.id] ?? (task.technicianNotes || task.remarks || '') }))
         setPayments(prev => ({ ...prev, [task.id]: prev[task.id] ?? (task.status || '') }))
         setAmounts(prev => ({ ...prev, [task.id]: prev[task.id] ?? (task.amountCollected || '') }))
      })
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, navigate, currentUser, enquiries, productEnquiries, currentUserProfile])

  const handleUpdateTask = async (task, actionType) => {
    console.log("handleUpdateTask click intercept triggered:", actionType, task.id);
    try {
      const closeoutNotesText = notes[task.id] || ""
      const currentSelectStatus = payments[task.id] || ""
      
      // ─── PIPELINE A: CONSULTANT SALES TRANSITIONS ───
      if (currentUser?.role === 'consultant' || actionType === 'Consultation Update') {
        if (!currentSelectStatus || currentSelectStatus === "") {
          setErrorToast('Please select a valid Follow-up Status.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }
        if (!closeoutNotesText.trim()) {
          setErrorToast('Consultation notes are required.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }

        const updateData = {
          remarks: closeoutNotesText,
          technicianNotes: closeoutNotesText,
          status: currentSelectStatus,
          updatedAt: new Date().toISOString()
        }

        const isTerminalState = ['Converted to Client', 'Lost Lead', 'Consultation Completed'].includes(currentSelectStatus);
        if (isTerminalState) {
          updateData.resolvedAt = new Date().toISOString()
        }

        // Fire target database transactional update
        await updateDoc(doc(db, 'product_inquiries', task.id), updateData)
        console.log("Firestore sales lead update pushed successfully.");

        // Push alert packet to admin notification bells
        await addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Consultant',
          type: 'consultation_update',
          title: `Lead Status: ${currentSelectStatus}`,
          message: `Consultant updated client ${task.name}: "${closeoutNotesText.substring(0, 55)}..."`,
          clientName: task.name,
          serviceName: task.productName || 'Product Lead',
          remarks: closeoutNotesText,
        })

        // Deploy standalone green success message feedback loops
        setSuccessToast('Consultation log updated successfully!');
        setTimeout(() => setSuccessToast(null), 4000);

        // Instantly force pipeline shifts out of active rows if resolved
        if (isTerminalState) {
          setActiveTab('history');
        }
        return;
      }

      // ─── PIPELINE B: MAINTENANCE FIELD TECHNICIAN SUBMISSIONS ───
      if (actionType === 'Resolved') {
        if (!PAYMENT_OPTIONS.includes(currentSelectStatus)) {
          setErrorToast('Please select a valid Payment Mode.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }
        if (amounts[task.id] === '' || Number(amounts[task.id]) < 0) {
          setErrorToast('Amount Collected must be 0 or greater.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }
        if (!closeoutNotesText.trim() || closeoutNotesText.trim().length < 10) {
          setErrorToast('Technical Remarks must be at least 10 characters.')
          setTimeout(() => setErrorToast(null), 4000)
          return
        }
      }

      const updateData = {
        technicianNotes: closeoutNotesText,
        paymentCollectionStatus: currentSelectStatus,
        amountCollected: amounts[task.id] || 0,
        updatedAt: new Date().toISOString()
      }

      if (actionType === 'Resolved') {
        const targetStatus = currentSelectStatus === "Pending Admin Billing" ? "Pending Billing" : "Resolved";
        updateData.status = targetStatus;
        updateData.resolvedAt = new Date().toISOString()
        await addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          type: targetStatus === "Pending Billing" ? "pending_billing" : "job_completed",
          title: targetStatus === "Pending Billing" ? "Billing Required" : "Job Completed",
          message: targetStatus === "Pending Billing" 
            ? `${currentUserProfile?.name || 'Technician'} finished service for ${task.name}. Awaiting admin invoicing.`
            : `${currentUserProfile?.name || 'Technician'} marked job as Resolved.`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: currentSelectStatus,
          amountCollected: Number(amounts[task.id]) || 0,
          remarks: closeoutNotesText,
        })
      } else if (actionType === 'Partially Paid') {
        updateData.status = 'Partially Paid'
        updateData.resolvedAt = new Date().toISOString()
        await addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          type: 'partial_payment',
          title: 'Partial Payment Collected',
          message: `${currentUserProfile?.name || 'Technician'} collected partial payment via ${currentSelectStatus}.`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: currentSelectStatus,
          amountCollected: Number(amounts[task.id]) || 0,
          remarks: closeoutNotesText,
        })
      } else if (actionType === 'Warranty Service') {
        updateData.status = 'Warranty Service'
        updateData.paymentCollectionStatus = 'Warranty Claim'
        updateData.amountCollected = 0
        updateData.resolvedAt = new Date().toISOString()
        await addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          type: 'warranty_job',
          title: 'Warranty Service Closed',
          message: `${currentUserProfile?.name || 'Technician'} finalized warranty repair for ${task.name}.`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: 'Warranty Claim',
          amountCollected: 0,
          remarks: closeoutNotesText,
        })
      } else if (actionType === 'Hold') {
        updateData.status = 'On Hold'
        await addNotification({
          technicianId: currentUser.uid,
          technicianName: currentUserProfile?.name || 'Technician',
          message: `${currentUserProfile?.name || 'Technician'} put job on HOLD for client ${task.name}`,
          clientName: task.name,
          serviceName: task.productName || 'General Service',
          paymentMode: currentSelectStatus,
          amountCollected: Number(amounts[task.id]) || 0,
          remarks: closeoutNotesText || 'No remarks provided',
        })
      }

      await updateDoc(doc(db, 'enquiries', task.id), updateData)
      setSuccessToast('Service report captured successfully!');
      setTimeout(() => setSuccessToast(null), 4000);
      setActiveTab('history');

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
      case 'In Discussion':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'Quotation Sent':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'Consultation Completed':
        return 'bg-teal-50 text-teal-700 border-teal-200'
      case 'On Hold':
      case 'Issue Reported':
      case 'No Response':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'New':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'Lost Lead':
        return 'bg-red-50 text-red-600 border-red-200'
      case 'Converted to Client':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
        
        {/* Isolated Error Vector Banner */}
        {errorToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl shadow-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold">{errorToast}</p>
          </div>
        )}

        {/* Clean Isolated Emerald Success Vector Banner */}
        {successToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
            <p className="text-sm font-semibold">{successToast}</p>
          </div>
        )}

        <header className="bg-brand-deep text-white px-4 py-6 sticky top-0 z-30 shadow-lg w-full box-border rounded-b-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-brand-cyan/20 p-3 rounded-xl border border-brand-cyan/30">
                <Wrench className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Welcome back, {currentUser?.role === 'consultant' ? 'Consultant' : (currentUserProfile?.name || 'Technician')}
                </h1>
                <p className="text-xs text-white/60 mt-0.5">
                  Specialization: {currentUser?.role === 'consultant' ? 'Sales & Quotations' : (currentUserProfile?.specialization || 'General Systems')}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center justify-center p-2 text-white/60 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="w-full py-6 space-y-4 box-border">
          <div className="flex p-1 bg-gray-200/50 rounded-xl mb-6 w-full box-border">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Active Jobs
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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

                      {/* Omnichannel Interaction Bar */}
                      {currentUser?.role === 'consultant' ? (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <a
                            href={`tel:${task.phone}`}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-semibold hover:bg-gray-50 text-slate-700"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call Client
                          </a>
                          <button
                            onClick={() => {
                              const cleanPhone = task.phone.replace(/\D/g, '');
                              const standardPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                              const defaultText = encodeURIComponent(`Hello ${task.name}, this is from Samarth Enterprises regarding your recent enquiry.`);
                              window.open(`https://wa.me/${standardPhone}?text=${defaultText}`, '_blank');
                            }}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-200 text-emerald-700 font-semibold text-xs hover:bg-emerald-50 transition"
                          >
                            <Phone className="w-3.5 h-3.5" /> WhatsApp Sync
                          </button>
                        </div>
                      ) : (
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
                      )}

                      {/* Form Fields Canvas */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5 space-y-4">
                        {currentUser?.role === 'consultant' ? (
                          <>
                            <div className="w-full">
                              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Follow-up Status <span className="text-red-500 ml-1">*</span></label>
                              <select
                                value={payments[task.id] || ''}
                                onChange={(e) => setPayments({ ...payments, [task.id]: e.target.value })}
                                className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 bg-white"
                              >
                                <option value="">Select Follow-up Status *</option>
                                <option value="In Discussion">In Discussion</option>
                                <option value="Quotation Sent">Quotation Sent</option>
                                <option value="Consultation Completed">Consultation Completed</option>
                                <option value="No Response">No Response</option>
                                <option value="Lost Lead">Lost Lead</option>
                                <option value="Converted to Client">Converted to Client</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Consultation Notes <span className="text-red-500 ml-1">*</span></label>
                              <textarea
                                rows="2"
                                placeholder="Enter details of conversation..."
                                value={notes[task.id] || ''}
                                onChange={(e) => setNotes({ ...notes, [task.id]: e.target.value })}
                                className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 resize-none bg-white"
                              ></textarea>
                            </div>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>

                      {/* Primary Trigger Buttons */}
                      <div className="flex flex-col gap-2">
                        {currentUser?.role === 'consultant' ? (
                          <button
                            type="button"
                            onClick={() => handleUpdateTask(task, 'Consultation Update')}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-brand-deep text-white hover:bg-brand-cyan transition-all duration-200 shadow-lg shadow-brand-deep/20"
                          >
                            💼 Submit Consultation Updates
                          </button>
                        ) : (
                          <>
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
                          </>
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
                <h2 className="font-bold text-gray-800 text-lg">Completed Tasks</h2>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  {historyTasks.length} Done
                </span>
              </div>

              {historyTasks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <CheckCircle2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-lg font-bold text-gray-400">No history files recorded</p>
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
                            Updated: {task.updatedAt ? new Date(task.updatedAt).toLocaleString('en-IN') : 'Recent'}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Item:</strong> {task.productName || 'Product Lead'}</p>
                        {(task.remarks || task.technicianNotes) && (
                          <p className="italic text-gray-500 bg-gray-50 p-2 rounded">
                            "{task.remarks || task.technicianNotes}"
                          </p>
                        )}
                      </div>
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