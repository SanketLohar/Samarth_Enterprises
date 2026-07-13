import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ServicesTable() {
  const { services, addService, updateService, deleteService, toggleServiceVisibility } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [isAdding, setIsAdding] = useState(false)

  const handleEditClick = (service) => { setEditingId(service.id); setEditForm(service) }
  const handleSave = async (id) => {
    if (id === 'new') { await addService({ ...editForm, hidden: false }); setIsAdding(false) }
    else { await updateService(editForm); setEditingId(null) }
  }
  const handleCancel = () => { setEditingId(null); setIsAdding(false) }
  const handleAddClick = () => { setIsAdding(true); setEditingId('new'); setEditForm({ name: '', description: '', price: '' }) }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-wrap justify-between items-center gap-3 p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-brand-dark">Manage Services</h2>
        <button onClick={handleAddClick} disabled={isAdding}
          className="flex items-center gap-2 bg-brand-cyan text-brand-deep px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-light transition disabled:opacity-50">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="overflow-x-auto w-full block whitespace-nowrap scrollbar-thin">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4 w-1/5">Name</th>
              <th className="px-6 py-4 w-2/5">Description</th>
              <th className="px-6 py-4 w-1/8">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {isAdding && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-blue-50/30">
                  <td className="px-6 py-4">
                    <input type="text" placeholder="Service Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="text" placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="text" placeholder="e.g. 500" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                  </td>
                  <td className="px-6 py-4"><span className="text-xs font-semibold text-emerald-600">Visible</span></td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleSave('new')} className="text-emerald-600 bg-emerald-50 p-1.5 rounded" title="Save"><Save className="w-4 h-4" /></button>
                    <button onClick={handleCancel} className="text-red-600 bg-red-50 p-1.5 rounded" title="Cancel"><X className="w-4 h-4" /></button>
                  </td>
                </motion.tr>
              )}

              {services.map((service) => {
                const isEditing = editingId === service.id
                return (
                  <motion.tr key={service.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={service.hidden ? 'bg-gray-50/50 opacity-75' : ''}>
                    <td className="px-6 py-4">
                      {isEditing ? <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border-gray-300 rounded-md sm:text-sm" /> : <span className="font-semibold text-brand-dark whitespace-normal">{service.name}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? <input type="text" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full border-gray-300 rounded-md sm:text-sm" /> : <span className="text-gray-500 whitespace-normal line-clamp-2">{service.description}</span>}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? <input type="text" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full border-gray-300 rounded-md sm:text-sm" /> : <span className="text-brand-deep font-medium">{service.price ? `₹${service.price}` : 'N/A'}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => !isEditing && toggleServiceVisibility(service)} disabled={isEditing}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${service.hidden ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                        {service.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {service.hidden ? 'Hidden' : 'Visible'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {isEditing ? (
                        <>
                          <button onClick={() => handleSave(service.id)} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded" title="Save"><Save className="w-4 h-4" /></button>
                          <button onClick={handleCancel} className="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Cancel"><X className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(service)} className="text-brand-muted hover:text-brand-cyan hover:bg-brand-light p-1.5 rounded transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { if (window.confirm('Delete this service?')) deleteService(service.id) }} className="text-brand-muted hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
