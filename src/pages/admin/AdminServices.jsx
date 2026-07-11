import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'
import ServicesTable from '../../components/admin/ServicesTable'

export default function AdminServices() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
          <Wrench className="w-6 h-6 text-brand-cyan" />
          Service Management
        </h1>
        <p className="text-brand-muted mt-1">
          Add, edit, or toggle the visibility of your maintenance and repair services.
        </p>
      </div>

      <ServicesTable />
    </motion.div>
  )
}
