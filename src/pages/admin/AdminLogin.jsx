import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'

export default function AdminLogin() {
  const { authReady, isAuthenticated, isTechnician, login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Navigate only after AppContext has resolved BOTH auth AND the Firestore role lookup
  useEffect(() => {
    if (!authReady || !isAuthenticated) return
    if (isTechnician) {
      navigate('/helper/dashboard', { replace: true })
    } else {
      navigate('/admin', { replace: true })
    }
  }, [authReady, isAuthenticated, isTechnician, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const user = await login(form.email, form.password)
    if (!user) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    }
    // On success: onAuthStateChanged fires in AppContext, resolves role,
    // sets authReady=true → useEffect above triggers the correct redirect.
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
          <img src="/images/company_logo.png" alt="Samarth Enterprises" className="h-12 mx-auto mb-4 object-contain" />
          <h1 className="text-xl font-bold text-brand-dark">Secure Portal Login</h1>
          <p className="text-sm text-gray-400 mt-1">Samarth Enterprises — Authorized Personnel Only</p>
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

        <p className="text-[10px] text-gray-300 text-center mt-6">
          Authorized personnel only.
        </p>
      </motion.div>
    </div>
  )
}
