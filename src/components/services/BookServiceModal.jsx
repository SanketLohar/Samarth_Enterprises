import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle } from 'lucide-react'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

const SERVICE_OPTIONS = [
  'Alkaline Purifier Servicing',
  'Water Softener Maintenance',
  'Automatic Water Level Controller Check',
  'General Maintenance & Repair',
  'Filter Replacement',
  'System Installation',
  'Other'
]

export default function BookServiceModal({ open, onClose }) {
  const { addEnquiry } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    serviceType: '', 
    preferredDate: '', 
    address: '',
    message: '' 
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!form.name || form.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.'
    }
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian number.'
    }
    if (!form.serviceType) {
      newErrors.serviceType = 'Please select a service type.'
    }
    if (!form.preferredDate) {
      newErrors.preferredDate = 'Please select a preferred date.'
    }
    if (!form.address || form.address.length < 10) {
      newErrors.address = 'Please provide a complete address (minimum 10 characters).'
    }
    if (!form.message || form.message.length < 10) {
      newErrors.message = 'Please provide details (minimum 10 characters).'
    }
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = document.getElementById(`modal-${Object.keys(newErrors)[0]}`)
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
      await addEnquiry({
        name: form.name,
        phone: form.phone,
        serviceType: form.serviceType,
        preferredDate: form.preferredDate,
        address: form.address,
        message: form.message,
      }, 'enquiries') // Route to the enquiries collection
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setForm({ name: '', phone: '', serviceType: '', preferredDate: '', address: '', message: '' })
        setErrors({})
        onClose()
      }, 2200)
    } catch (err) {
      console.error("Booking failed:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-brand-dark/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-brand-dark">Book a Service</h3>
              <p className="text-xs text-brand-muted mt-0.5">Schedule maintenance instantly</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-brand-dark">
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-10 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="font-bold text-brand-dark">Service Booked!</p>
              <p className="text-sm text-brand-muted mt-1">Our team will contact you to confirm.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Full Name <span className="text-red-500 ml-1">*</span></label>
                <input
                  id="modal-name"
                  required
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); if(errors.name) setErrors({...errors, name: null}) }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Mobile Number <span className="text-red-500 ml-1">*</span></label>
                <input
                  id="modal-phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); if(errors.phone) setErrors({...errors, phone: null}) }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                  placeholder="+91"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Service Required <span className="text-red-500 ml-1">*</span></label>
                <select
                  id="modal-serviceType"
                  required
                  value={form.serviceType}
                  onChange={(e) => { setForm({ ...form, serviceType: e.target.value }); if(errors.serviceType) setErrors({...errors, serviceType: null}) }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.serviceType ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'} bg-white`}
                >
                  <option value="" disabled>Select a service</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.serviceType && <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Preferred Date <span className="text-red-500 ml-1">*</span></label>
                <input
                  id="modal-preferredDate"
                  type="date"
                  required
                  value={form.preferredDate}
                  onChange={(e) => { setForm({ ...form, preferredDate: e.target.value }); if(errors.preferredDate) setErrors({...errors, preferredDate: null}) }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.preferredDate ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                />
                {errors.preferredDate && <p className="text-red-500 text-xs mt-1">{errors.preferredDate}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Address <span className="text-red-500 ml-1">*</span></label>
                <textarea
                  id="modal-address"
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => { setForm({ ...form, address: e.target.value }); if(errors.address) setErrors({...errors, address: null}) }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none ${errors.address ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                  placeholder="Enter your full address..."
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Specific Problem Details <span className="text-red-500 ml-1">*</span></label>
                <textarea
                  id="modal-message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => { setForm({ ...form, message: e.target.value }); if(errors.message) setErrors({...errors, message: null}) }}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none ${errors.message ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                  placeholder="Describe the issue you're experiencing..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || Object.keys(errors).length > 0}>
                <Send className="w-4 h-4" />
                Book Service
              </Button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
