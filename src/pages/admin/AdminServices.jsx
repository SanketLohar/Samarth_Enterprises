import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'
import ServicesTable from '../../components/admin/ServicesTable'

export default function AdminServices() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 lg:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-500" />
            Service Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, edit, or toggle the visibility of your maintenance and repair services.
          </p>
        </div>
      </div>

      <ServicesTable />
    </motion.div>
  )
}
