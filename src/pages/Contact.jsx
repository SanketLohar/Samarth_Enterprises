import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { companyInfo } from '../data/categories'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import Button from '../components/ui/Button'

export default function Contact() {
  const location = useLocation()
  const [submitted, setSubmitted] = useState(false)
  
  // Smart prepopulate from Router State
  const initialProduct = location.state?.chosenProduct || ''
  
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    product: initialProduct,
    address: '',
    message: '' 
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-update if navigating while already on page
  useEffect(() => {
    if (location.state?.chosenProduct) {
      setForm(prev => ({ ...prev, product: location.state.chosenProduct }))
    }
  }, [location.state])

  const validateForm = () => {
    const newErrors = {}
    if (!form.name || form.name.length < 2 || !/^[a-zA-Z\s]+$/.test(form.name)) {
      newErrors.name = 'Name must be at least 2 characters (letters/spaces only).'
    }
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = 'Phone must be a valid 10-digit Indian number.'
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!form.address || form.address.length < 15) {
      newErrors.address = 'Address must be at least 15 characters for accurate routing.'
    }
    if (!form.message || form.message.length < 10) {
      newErrors.message = 'Requirements must be at least 10 characters.'
    }
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = document.getElementById(`field-${Object.keys(newErrors)[0]}`)
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
      await addDoc(collection(db, "enquiries"), {
        name: form.name,
        email: form.email || "",
        phone: form.phone,
        productName: form.product || "General Inquiry",
        address: form.address,
        message: form.message,
        status: "New", // Default to "New" so it updates metrics instantly
        enquirySource: 'contact',
        createdAt: new Date().toISOString()
      });

      // Secondary hook: Generate an administrative alert for the service inquiry
      await addDoc(collection(db, "notifications"), {
        type: "new_inquiry",
        title: "New Contact Message",
        message: `${form.name} contacted you for: ${form.message || form.product}`,
        clientPhone: form.phone,
        status: "unread",
        timestamp: serverTimestamp()
      });
      
      setSubmitted(true)
      setForm({ name: '', phone: '', email: '', product: '', address: '', message: '' })
      setErrors({})
      setTimeout(() => setSubmitted(false), 4000)
    } catch (error) {
      console.error("Failed to submit inquiry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg-brand-deep text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-cyan text-xs font-bold tracking-[0.25em] uppercase">Get in Touch</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold mt-2">Contact Us</h1>
            <p className="text-white/60 mt-3 max-w-lg">
              Have questions about our products or need a custom solution? Reach out — our team responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: MapPin, label: 'Address', value: companyInfo.address },
              { icon: Phone, label: 'Phone', value: companyInfo.phone, href: `tel:${companyInfo.phone.replace(/\s/g, '')}` },
              { icon: Mail, label: 'Email', value: companyInfo.email, href: `mailto:${companyInfo.email}` },
              { icon: Clock, label: 'Business Hours', value: companyInfo.hours },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">{label}</p>
                  {href ? (
                    <a href={href} className="text-brand-dark font-medium hover:text-brand-cyan transition mt-0.5 block">
                      {value}
                    </a>
                  ) : (
                    <p className="text-brand-dark font-medium mt-0.5">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Send Us a Message</h2>

            {submitted ? (
              <div className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-bold text-brand-dark">Thank you for reaching out!</p>
                <p className="text-sm text-brand-muted mt-1">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1.5">Full Name <span className="text-red-500 ml-1">*</span></label>
                    <input
                      id="field-name"
                      required
                      value={form.name}
                      onChange={(e) => { setForm({ ...form, name: e.target.value }); if(errors.name) setErrors({...errors, name: null}) }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1.5">Phone <span className="text-red-500 ml-1">*</span></label>
                    <input
                      id="field-phone"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => { setForm({ ...form, phone: e.target.value }); if(errors.phone) setErrors({...errors, phone: null}) }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1.5">Email</label>
                    <input
                      id="field-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); if(errors.email) setErrors({...errors, email: null}) }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1.5">Product / Service</label>
                    <input
                      type="text"
                      value={form.product}
                      onChange={(e) => setForm({ ...form, product: e.target.value })}
                      placeholder="e.g. Industrial RO Plant"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1.5">Full Address <span className="text-red-500 ml-1">*</span></label>
                  <input
                    id="field-address"
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => { setForm({ ...form, address: e.target.value }); if(errors.address) setErrors({...errors, address: null}) }}
                    placeholder="Enter your installation or service address"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1.5">Your Requirements <span className="text-red-500 ml-1">*</span></label>
                  <textarea
                    id="field-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => { setForm({ ...form, message: e.target.value }); if(errors.message) setErrors({...errors, message: null}) }}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none ${errors.message ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-200 focus:ring-brand-cyan/30'}`}
                    placeholder="Tell us about your water quality concerns, product interest, or installation needs..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>}
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting || Object.keys(errors).length > 0}>
                  <Send className="w-4 h-4" />
                  Submit Enquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
