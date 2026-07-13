import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react'
import { companyInfo } from '../data/categories'
import { collection, addDoc } from 'firebase/firestore'
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

  // Auto-update if navigating while already on page
  useEffect(() => {
    if (location.state?.chosenProduct) {
      setForm(prev => ({ ...prev, product: location.state.chosenProduct }))
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await addDoc(collection(db, "enquiries"), {
        name: form.name,
        email: form.email || "",
        phone: form.phone,
        productName: form.product || "General Inquiry",
        address: form.address,
        message: form.message,
        status: "New", // Default to "New" so it updates metrics instantly
        createdAt: new Date().toISOString()
      });
      
      setSubmitted(true)
      setForm({ name: '', phone: '', email: '', product: '', address: '', message: '' })
      setTimeout(() => setSubmitted(false), 4000)
    } catch (error) {
      console.error("Failed to submit inquiry:", error)
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
                    <label className="block text-xs font-semibold text-brand-muted mb-1.5">Full Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1.5">Phone *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-muted mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                    />
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
                  <label className="block text-xs font-semibold text-brand-muted mb-1.5">Full Address *</label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Enter your installation or service address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-muted mb-1.5">Your Requirements *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 resize-none"
                    placeholder="Tell us about your water quality concerns, product interest, or installation needs..."
                  />
                </div>
                <Button type="submit" size="lg">
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
