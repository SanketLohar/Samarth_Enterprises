import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Phone, Briefcase, X, UserCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AdminStaff() {
  const { technicians, addTechnician, deleteTechnician } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', expertise: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    await addTechnician(form)
    setForm({ name: '', phone: '', expertise: '' })
    setShowModal(false)
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
                <p className="font-bold text-brand-dark truncate">{tech.name}</p>
                <p className="text-sm text-brand-muted mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 shrink-0" /> {tech.phone}
                </p>
                {tech.expertise && (
                  <p className="text-xs text-brand-cyan mt-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 shrink-0" /> {tech.expertise}
                  </p>
                )}
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
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    placeholder="e.g. Ravi Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Area of Expertise</label>
                  <input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    placeholder="e.g. RO Installation, ETP Maintenance" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-brand-deep text-white font-semibold rounded-xl py-2.5 text-sm hover:bg-brand-cyan transition">
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
