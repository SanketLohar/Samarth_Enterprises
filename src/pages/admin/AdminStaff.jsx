import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Phone, Briefcase, X, UserCircle2, Mail, MapPin, CheckCircle, Activity, ClipboardList, Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { collection, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

export default function AdminStaff() {
  const { technicians, consultants, addTechnician, deleteTechnician, enquiries, productEnquiries, services, notifications } = useApp()
  
  const [activeTab, setActiveTab] = useState('technicians')
  
  // Technician State
  const [showTechModal, setShowTechModal] = useState(false)
  const [techForm, setTechForm] = useState({ name: '', phone: '', specialization: '', email: '', password: '', address: '', active: true })
  
  // Consultant State
  const [showConsultModal, setShowConsultModal] = useState(false)
  const [consultForm, setConsultForm] = useState({ name: '', phone: '', email: '', password: '', active: true })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateTechForm = () => {
    const newErrors = {}
    if (!techForm.name || techForm.name.length < 3) newErrors.name = 'Name must be at least 3 characters.'
    if (!techForm.phone || !/^[6-9]\d{9}$/.test(techForm.phone)) newErrors.phone = 'Strict 10-digit text match required.'
    if (!techForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(techForm.email)) newErrors.email = 'Valid unique email required.'
    if (!techForm.password || techForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters.'
    if (!techForm.address || techForm.address.length < 10) newErrors.address = 'Residential address must be at least 10 characters.'
    if (!techForm.specialization) newErrors.specialization = 'Expertise selection is required.'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateConsultForm = () => {
    const newErrors = {}
    if (!consultForm.name || consultForm.name.length < 3) newErrors.name = 'Name must be at least 3 characters.'
    if (!consultForm.phone || !/^[6-9]\d{9}$/.test(consultForm.phone)) newErrors.phone = 'Strict 10-digit text match required.'
    if (!consultForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consultForm.email)) newErrors.email = 'Valid unique email required.'
    if (!consultForm.password || consultForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters.'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCloseTechModal = () => {
    setShowTechModal(false)
    setTechForm({ name: '', phone: '', specialization: '', email: '', password: '', address: '', active: true })
    setErrors({})
  }

  const handleCloseConsultModal = () => {
    setShowConsultModal(false)
    setConsultForm({ name: '', phone: '', email: '', password: '', active: true })
    setErrors({})
  }

  const handleTechSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitting new technician data payload...", techForm);
    if (!validateTechForm()) {
      console.log("Technician validation failed:", errors);
      return;
    }
    
    setIsSubmitting(true)
    try {
      await addTechnician({ ...techForm, email: techForm.email.toLowerCase().trim() })
      console.log("Technician successfully added via context!");
      handleCloseTechModal()
    } catch (err) {
      console.error("CRITICAL TECHNICIAN CREATION FAILURE:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConsultSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitting new consultant data payload...", consultForm);
    if (!validateConsultForm()) {
      console.log("Consultant validation failed:", errors);
      return;
    }
    
    setIsSubmitting(true)
    try {
      await addDoc(collection(db, "consultants"), {
        name: consultForm.name,
        email: consultForm.email.toLowerCase().trim(),
        phone: consultForm.phone,
        password: consultForm.password,
        role: 'consultant',
        active: consultForm.active,
        status: consultForm.active ? 'Active' : 'Inactive',
        createdAt: serverTimestamp()
      });
      console.log("Consultant successfully added to Firestore!");
      handleCloseConsultModal()
    } catch (err) {
      console.error("CRITICAL CONSULTANT CREATION FAILURE:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConsultant = async (id) => {
    try {
      await deleteDoc(doc(db, "consultants", id))
    } catch (e) {
      console.error(e)
    }
  }

  const getTechMetrics = (techId) => {
    let assigned = 0, done = 0;
    enquiries.forEach(e => {
      if (e.assignedToId === techId || e.technicianId === techId) {
        if (['Resolved', 'Completed', 'Deal Done'].includes(e.status)) done++;
        else assigned++;
      }
    });
    (services || []).forEach(s => {
      if (s.assignedTechnicianId === techId) {
        if (['Resolved', 'Completed', 'Closed'].includes(s.status)) done++;
        else assigned++;
      }
    });
    return { assigned, done };
  }

  const getConsultantMetrics = (consultantId) => {
    let assigned = 0, done = 0;
    (productEnquiries || []).forEach(e => {
      if (e.assignedToId === consultantId) {
        if (['Consultation Completed', 'Converted to Client', 'Lost Lead', 'Completed'].includes(e.status)) done++;
        else assigned++;
      }
    });
    return { assigned, done };
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Staff</h1>
          <p className="text-xs text-slate-500 mt-1">Add and manage your workforce accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => activeTab === 'technicians' ? setShowTechModal(true) : setShowConsultModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add {activeTab === 'technicians' ? 'Technician' : 'Consultant'}
          </button>
        </div>
      </div>

      {/* Two-Tab Dashboard Engine */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-full max-w-sm">
        <button
          onClick={() => setActiveTab('technicians')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'technicians' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔧 Field Technicians
        </button>
        <button
          onClick={() => setActiveTab('consultants')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'consultants' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💼 Sales Consultants
        </button>
      </div>

      {activeTab === 'technicians' ? (
        <>
          {technicians.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <UserCircle2 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-bold text-brand-dark">No Technicians Yet</p>
              <p className="text-sm text-brand-muted mt-2">Add your first field technician to start assigning service tickets.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {technicians.map((tech) => (
                <motion.div
                  key={tech.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition w-full"
                >
                  <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center shrink-0">
                    <UserCircle2 className="w-7 h-7 text-brand-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-dark truncate">{tech.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tech.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {tech.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-brand-muted mt-0.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 shrink-0" /> {tech.phone}
                    </p>
                    <p className="text-sm text-brand-muted flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0" /> {tech.email}
                    </p>
                    {(tech.specialization || tech.expertise) && (
                      <p className="text-xs text-brand-cyan mt-1 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 shrink-0" /> {tech.specialization || tech.expertise}
                      </p>
                    )}
                    
                    {/* Dynamic Metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                      <div className="bg-amber-50 rounded-lg p-2 text-center">
                        <ClipboardList className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-amber-700">Assigned</p>
                        <p className="text-lg font-bold text-amber-800">{getTechMetrics(tech.id).assigned}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-2 text-center">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-emerald-700">Done</p>
                        <p className="text-lg font-bold text-emerald-800">{getTechMetrics(tech.id).done}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (window.confirm(`Remove ${tech.name}?`)) deleteTechnician(tech.id) }}
                    className="text-gray-300 hover:text-red-400 transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {(!consultants || consultants.length === 0) ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
              <UserCircle2 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-bold text-brand-dark">No Consultants Yet</p>
              <p className="text-sm text-brand-muted mt-2">Add your first sales consultant to start processing product inquiries.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {consultants.map((consult) => (
                <motion.div
                  key={consult.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition w-full"
                >
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                    <UserCircle2 className="w-7 h-7 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-brand-dark truncate">{consult.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${consult.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {consult.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-brand-muted mt-0.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 shrink-0" /> {consult.phone}
                    </p>
                    <p className="text-sm text-brand-muted flex items-center gap-1 mt-0.5 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0" /> {consult.email}
                    </p>
                    
                    {/* Dynamic Metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                      <div className="bg-amber-50 rounded-lg p-2 text-center">
                        <ClipboardList className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-amber-700">Assigned</p>
                        <p className="text-lg font-bold text-amber-800">{getConsultantMetrics(consult.id).assigned}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-2 text-center">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-emerald-700">Done</p>
                        <p className="text-lg font-bold text-emerald-800">{getConsultantMetrics(consult.id).done}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (window.confirm(`Remove ${consult.name}?`)) handleDeleteConsultant(consult.id) }}
                    className="text-gray-300 hover:text-red-400 transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Technician Modal */}
      <AnimatePresence>
        {showTechModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleCloseTechModal}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-brand-dark text-lg">Add New Technician</h3>
                <button onClick={handleCloseTechModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleTechSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name <span className="text-red-500 ml-1">*</span></label>
                  <input required value={techForm.name} onChange={(e) => { setTechForm({ ...techForm, name: e.target.value }); if(errors.name) setErrors({...errors, name: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="e.g. Ravi Sharma" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number <span className="text-red-500 ml-1">*</span></label>
                    <input required type="tel" value={techForm.phone} onChange={(e) => { setTechForm({ ...techForm, phone: e.target.value }); if(errors.phone) setErrors({...errors, phone: null}) }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                      placeholder="+91 XXXXX XXXXX" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address <span className="text-red-500 ml-1">*</span></label>
                    <input required type="email" value={techForm.email} onChange={(e) => { setTechForm({ ...techForm, email: e.target.value }); if(errors.email) setErrors({...errors, email: null}) }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                      placeholder="tech@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Portal Password <span className="text-red-500 ml-1">*</span></label>
                  <input required type="password" value={techForm.password} onChange={(e) => { setTechForm({ ...techForm, password: e.target.value }); if(errors.password) setErrors({...errors, password: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="Secure password" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Residential Address <span className="text-red-500 ml-1">*</span></label>
                  <textarea rows="2" value={techForm.address} onChange={(e) => { setTechForm({ ...techForm, address: e.target.value }); if(errors.address) setErrors({...errors, address: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none ${errors.address ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="Physical address" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Area of Specialization <span className="text-red-500 ml-1">*</span></label>
                    <select value={techForm.specialization} onChange={(e) => { setTechForm({ ...techForm, specialization: e.target.value }); if(errors.specialization) setErrors({...errors, specialization: null}) }}
                      className={`w-full min-w-[130px] px-2.5 py-1.5 text-xs font-medium rounded-md border ${errors.specialization ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-300'} bg-white text-gray-700 shadow-sm outline-none cursor-pointer focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none pr-8 relative bg-no-repeat`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1.25em 1.25em'
                      }}
                    >
                      <option value="">-- Select --</option>
                      <option value="RO Installation">RO Installation</option>
                      <option value="General Service">General Service</option>
                      <option value="Advanced Plumbing">Advanced Plumbing</option>
                    </select>
                    {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                    <button
                      type="button"
                      onClick={() => setTechForm({ ...techForm, active: !techForm.active })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition flex justify-center items-center ${
                        techForm.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {techForm.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSubmitting || Object.values(errors).some(Boolean)} className="flex-1 bg-brand-deep text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-brand-cyan transition">
                    Add Technician
                  </button>
                  <button type="button" onClick={handleCloseTechModal} className="flex-1 border border-gray-200 text-gray-600 font-semibold rounded-xl py-2.5 text-sm hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Consultant Modal */}
      <AnimatePresence>
        {showConsultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleCloseConsultModal}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-brand-dark text-lg">Add New Consultant</h3>
                <button onClick={handleCloseConsultModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleConsultSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name <span className="text-red-500 ml-1">*</span></label>
                  <input required value={consultForm.name} onChange={(e) => { setConsultForm({ ...consultForm, name: e.target.value }); if(errors.name) setErrors({...errors, name: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="e.g. Aditi Rao" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number <span className="text-red-500 ml-1">*</span></label>
                    <input required type="tel" value={consultForm.phone} onChange={(e) => { setConsultForm({ ...consultForm, phone: e.target.value }); if(errors.phone) setErrors({...errors, phone: null}) }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                      placeholder="+91 XXXXX XXXXX" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address <span className="text-red-500 ml-1">*</span></label>
                    <input required type="email" value={consultForm.email} onChange={(e) => { setConsultForm({ ...consultForm, email: e.target.value }); if(errors.email) setErrors({...errors, email: null}) }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                      placeholder="sales@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Portal Password <span className="text-red-500 ml-1">*</span></label>
                  <input required type="password" value={consultForm.password} onChange={(e) => { setConsultForm({ ...consultForm, password: e.target.value }); if(errors.password) setErrors({...errors, password: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="Secure password" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                  <button
                    type="button"
                    onClick={() => setConsultForm({ ...consultForm, active: !consultForm.active })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition flex justify-center items-center ${
                      consultForm.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {consultForm.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSubmitting || Object.values(errors).some(Boolean)} className="flex-1 bg-brand-deep text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-brand-cyan transition">
                    Add Consultant
                  </button>
                  <button type="button" onClick={handleCloseConsultModal} className="flex-1 border border-gray-200 text-gray-600 font-semibold rounded-xl py-2.5 text-sm hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
