import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Phone, Briefcase, X, UserCircle2, Mail, MapPin, CheckCircle, Activity, ClipboardList } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AdminStaff() {
  const { technicians, addTechnician, deleteTechnician, enquiries } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', specialization: '', email: '', password: '', address: '', active: true })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!form.name || form.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.'
    }
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = 'Strict 10-digit text match required.'
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid unique email required.'
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }
    if (!form.address || form.address.length < 10) {
      newErrors.address = 'Residential address must be at least 10 characters.'
    }
    if (!form.specialization) {
      newErrors.specialization = 'Expertise selection is required.'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = document.getElementById(`staff-${Object.keys(newErrors)[0]}`)
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      await addTechnician({ ...form, email: form.email.toLowerCase() })
      setForm({ name: '', phone: '', specialization: '', email: '', password: '', address: '', active: true })
      setErrors({})
      setShowModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMetrics = (techId) => {
    let assigned = 0, active = 0, done = 0;
    enquiries.forEach(e => {
      // Handle both UID or auto-id if present
      if (e.assignedToId === techId || e.technicianId === techId) {
        if (e.status === 'New' || e.status === 'Contacted') assigned++;
        else if (e.status === 'In Progress') active++;
        else if (e.status === 'Resolved' || e.status === 'Deal Done') done++;
      }
    });
    return { assigned, active, done };
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Manage Staff</h1>
          <p className="text-sm text-brand-muted mt-1">Add and manage your field technicians.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-deep text-white rounded-xl text-sm font-semibold hover:bg-brand-cyan transition"
        >
          <Plus className="w-4 h-4" /> Add Technician
        </button>
      </div>

      {technicians.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <UserCircle2 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-lg font-bold text-brand-dark">No Technicians Yet</p>
          <p className="text-sm text-brand-muted mt-2">Add your first field technician to start assigning service tickets.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition"
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
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-amber-50 rounded-lg p-2 text-center">
                    <ClipboardList className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-amber-700">Assigned</p>
                    <p className="text-lg font-bold text-amber-800">{getMetrics(tech.id).assigned}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <Activity className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-blue-700">Active</p>
                    <p className="text-lg font-bold text-blue-800">{getMetrics(tech.id).active}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-emerald-700">Done</p>
                    <p className="text-lg font-bold text-emerald-800">{getMetrics(tech.id).done}</p>
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

      {/* Add Technician Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
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
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name <span className="text-red-500 ml-1">*</span></label>
                  <input id="staff-name" required value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if(errors.name) setErrors({...errors, name: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="e.g. Ravi Sharma" />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number <span className="text-red-500 ml-1">*</span></label>
                    <input id="staff-phone" required type="tel" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); if(errors.phone) setErrors({...errors, phone: null}) }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                      placeholder="+91 XXXXX XXXXX" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address <span className="text-red-500 ml-1">*</span></label>
                    <input id="staff-email" required type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); if(errors.email) setErrors({...errors, email: null}) }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                      placeholder="tech@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Portal Password <span className="text-red-500 ml-1">*</span></label>
                  <input id="staff-password" required type="password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); if(errors.password) setErrors({...errors, password: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="Secure password" />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Residential Address <span className="text-red-500 ml-1">*</span></label>
                  <textarea id="staff-address" rows="2" value={form.address} onChange={(e) => { setForm({ ...form, address: e.target.value }); if(errors.address) setErrors({...errors, address: null}) }}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none ${errors.address ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="Physical address" />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Area of Specialization <span className="text-red-500 ml-1">*</span></label>
                    <select id="staff-specialization" value={form.specialization} onChange={(e) => { setForm({ ...form, specialization: e.target.value }); if(errors.specialization) setErrors({...errors, specialization: null}) }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.specialization ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'} bg-white`}
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
                      onClick={() => setForm({ ...form, active: !form.active })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition flex justify-center items-center ${
                        form.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {form.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0} className="flex-1 bg-brand-deep text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-brand-cyan transition">
                    Add Technician
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 font-semibold rounded-xl py-2.5 text-sm hover:bg-gray-50 transition">
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
