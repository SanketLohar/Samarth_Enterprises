import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle } from 'lucide-react'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

export default function EnquiryModal({ product, open, onClose }) {
  const { addEnquiry } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', address: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    addEnquiry({
      ...form,
      productId: product?.id || null,
      productName: product?.name || 'General Enquiry',
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ name: '', phone: '', email: '', message: '', address: '' })
      onClose()
    }, 2200)
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
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                  placeholder="Your name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1.5">Phone *</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    placeholder="+91"
                  />
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
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 resize-none"
                  placeholder="Your delivery / service address..."
                />
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
              <Button type="submit" className="w-full">
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
