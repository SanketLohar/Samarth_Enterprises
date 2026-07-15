import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

export default function AdminLogin() {
  const { authReady, isAuthenticated, isTechnician, login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Navigate only after AppContext has resolved BOTH auth AND the Firestore role lookup
  useEffect(() => {
    if (authReady && isAuthenticated) {
      if (isTechnician) {
        navigate('/helper/dashboard', { replace: true });
      } else {
        navigate('/admin', { replace: true }); // Primary admin panel route
      }
    }
  }, [authReady, isAuthenticated, isTechnician, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      // On success: AppContext resolves state, authReady becomes true,
      // and the useEffect triggers the correct redirect.
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
      setLoading(false)
    }
  }

  // Show blank while auth state resolves on page load
  if (!authReady && isAuthenticated === null) return null

  return (
    <div className="min-h-screen bg-brand-deep flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block hover:opacity-80 transition">
            <img src="/images/company_logo.png" alt="Samarth Enterprises" className="h-12 mx-auto mb-4 object-contain" />
          </Link>
          <h1 className="text-xl font-bold text-brand-dark">Secure Portal Login</h1>
          <p className="text-sm text-gray-400 mt-1">Samarth Enterprises — Authorized Persons Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
            <input
              required type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
            <input
              required type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <Lock className="w-4 h-4" />
            {loading ? 'Verifying Role...' : 'Sign In'}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-4 mt-6">
          <p className="text-[10px] text-gray-300 text-center">
            Authorized personnel only.
          </p>
          <Link to="/" className="text-xs text-brand-cyan hover:text-brand-deep transition flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3 h-3" /> Return to Website
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
