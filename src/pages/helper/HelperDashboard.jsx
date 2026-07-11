import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { CheckCircle2, Clock, LogOut, Wrench } from 'lucide-react'

export default function HelperDashboard() {
  const { services, currentUser, isAuthenticated, updateServiceStatus, logout } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated === false) navigate('/helper/login', { replace: true })
  }, [isAuthenticated, navigate])

  const myTasks = services.filter(
    (s) => s.assignedTechnicianId === currentUser?.uid
  )

  const handleToggleStatus = async (service) => {
    const next = service.status === 'Completed' ? 'Assigned' : 'Completed'
    await updateServiceStatus(service.id, next)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/helper/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-brand-deep text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-brand-cyan/20 p-2 rounded-lg">
            <Wrench className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <p className="font-bold text-sm">My Tasks</p>
            <p className="text-white/50 text-xs">{myTasks.length} assignment{myTasks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-white/60 hover:text-red-400 text-sm transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {myTasks.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-bold text-gray-400">No tasks assigned yet</p>
            <p className="text-sm text-gray-400 mt-1">Check back later or contact your admin.</p>
          </div>
        ) : (
          myTasks.map((task) => {
            const isDone = task.status === 'Completed'
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${isDone ? 'border-emerald-200' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <p className="font-bold text-brand-dark text-base">{task.name}</p>
                    {task.description && (
                      <p className="text-sm text-brand-muted mt-1 leading-relaxed">{task.description}</p>
                    )}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                    isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {isDone ? 'Completed' : 'Pending'}
                  </span>
                </div>

                {/* Large touch zone toggle */}
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                    isDone
                      ? 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {isDone ? (
                    <><Clock className="w-5 h-5" /> Mark as Pending</>
                  ) : (
                    <><CheckCircle2 className="w-5 h-5" /> Mark as Completed</>
                  )}
                </button>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
