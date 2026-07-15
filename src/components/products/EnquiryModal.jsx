import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle } from 'lucide-react'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

export default function EnquiryModal({ product, open, onClose }) {
  const { addEnquiry } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', address: '' })
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
    if (!form.address || form.address.length < 15) {
      newErrors.address = 'Address must be at least 15 characters.'
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
        ...form,
        productId: product?.id || null,
        productName: product?.name || 'General Enquiry',
      }, 'product_inquiries')
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setForm({ name: '', phone: '', email: '', message: '', address: '' })
        setErrors({})
        onClose()
      }, 2200)
    } catch (err) {
      console.error("Enquiry failed:", err)
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
              <h3 className="font-bold text-brand-dark">Request a Quote</h3>
              {product && (
                <p className="text-xs text-brand-muted mt-0.5">{product.name}</p>
              )}
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-brand-dark">
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="p-10 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="font-bold text-brand-dark">Enquiry Submitted!</p>
              <p className="text-sm text-brand-muted mt-1">Our team will contact you shortly.</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1.5">Phone <span className="text-red-500 ml-1">*</span></label>
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
                  <label className="block text-xs font-semibold text-brand-muted mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    placeholder="email@..."
                  />
                </div>
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
                  placeholder="Your delivery / service address..."
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Message</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || Object.keys(errors).length > 0}>
                <Send className="w-4 h-4" />
                Submit Enquiry
              </Button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
