import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, UploadCloud, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ServicesTable() {
  const { services, addService, updateService, deleteService, toggleServiceVisibility } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [isAdding, setIsAdding] = useState(false)
  const [imageError, setImageError] = useState('')
  const [cleanFileName, setCleanFileName] = useState('')

  const handleEditClick = (service) => { 
    setEditingId(service.id); 
    setEditForm({ ...service });
    setIsAdding(false);
    setImageError('');
    setCleanFileName('');
  }
  
  const handleAddClick = () => { 
    setIsAdding(true); 
    setEditingId(null); 
    setEditForm({ name: '', description: '', price: '', imageUrl: '', hidden: false });
    setImageError('');
    setCleanFileName('');
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (isAdding) { 
        await addService(editForm); 
        setIsAdding(false);
    } else { 
        await updateService(editForm); 
        setEditingId(null);
    }
  }

  const handleCancel = () => { 
    setEditingId(null); 
    setIsAdding(false); 
    setImageError('');
    setCleanFileName('');
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageError('')
    setCleanFileName('')

    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image size must be under 2MB.')
      e.target.value = ''
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setImageError('Only .jpg, .jpeg, or .png formats are allowed.')
      e.target.value = ''
      return
    }

    const cleaned = file.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9.-]/g, '')
    setCleanFileName(cleaned)
    setEditForm({ ...editForm, imageUrl: cleaned })
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30'

  if (isAdding || editingId) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-extrabold text-brand-dark">{isAdding ? 'Add New Service' : 'Edit Service'}</h2>
          <button onClick={handleCancel} className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Service Name *</label>
              <input required value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputCls} placeholder="e.g. Filter Replacement" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Price (₹) *</label>
              <input required type="number" min="0" value={editForm.price || ''} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className={inputCls} placeholder="e.g. 1500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Service Image (Max 2MB, .jpg/.png)</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition focus-within:ring-2 focus-within:ring-brand-cyan/30 bg-gray-50/30">
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/jpg" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <UploadCloud className="w-6 h-6 text-brand-cyan" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {editForm.imageUrl ? `Selected Image: ${editForm.imageUrl}` : 'Drag & Drop or Click to Upload'}
                </p>
              </div>
            </div>
            {imageError && (
              <p className="flex items-center gap-1.5 text-red-500 text-xs mt-2 font-medium">
                <AlertCircle className="w-4 h-4" /> {imageError}
              </p>
            )}
            {cleanFileName && (
              <div className="mt-4 text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-4">
                <p className="font-semibold text-sm mb-1 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Action Required for Dev Environment Asset Alignment:</p>
                <p className="mt-1 opacity-90">Please ensure you manually paste this exact image file into your local project folder layout at:</p>
                <code className="block mt-2 font-mono bg-amber-100 p-2 rounded-lg text-gray-900 border border-amber-300 break-all select-all">
                  public\images\{cleanFileName}
                </code>
              </div>
            )}
            {!cleanFileName && editForm.imageUrl && (
              <p className="text-[11px] text-gray-400 mt-2 text-right">Current Assumed Path: /images/{editForm.imageUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description *</label>
            <textarea required rows={4} value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={`${inputCls} resize-none`} placeholder="Detailed explanation of the service operations and coverage..." />
          </div>
          
          <label className="flex items-center gap-3 text-sm text-gray-700 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition">
            <input type="checkbox" checked={editForm.hidden || false} onChange={(e) => setEditForm({ ...editForm, hidden: e.target.checked })} className="w-5 h-5 text-brand-cyan rounded border-gray-300 focus:ring-brand-cyan transition" />
            <span className="font-semibold">Hide this service from the public catalog</span>
          </label>

          <div className="flex gap-4 pt-6 border-t border-gray-100 mt-8">
            <button type="submit" className="px-6 py-2.5 bg-brand-deep text-white rounded-xl text-sm font-bold hover:bg-brand-cyan transition-colors shadow-lg shadow-brand-deep/20">
              {isAdding ? 'Create Service' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-wrap justify-between items-center gap-3 p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-brand-dark">Manage Services</h2>
        <button onClick={handleAddClick} disabled={isAdding}
          className="flex items-center gap-2 bg-brand-cyan text-brand-deep px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-light transition shadow-lg shadow-brand-cyan/20">
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
              {services.map((service) => (
                  <motion.tr key={service.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={service.hidden ? 'bg-gray-50/50 opacity-75 hover:bg-gray-50 transition' : 'hover:bg-gray-50 transition'}>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-brand-dark whitespace-normal">{service.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 whitespace-normal line-clamp-2">{service.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-brand-deep font-semibold">{service.price ? `₹${service.price}` : 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleServiceVisibility(service)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${service.hidden ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'}`}>
                        {service.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {service.hidden ? 'Hidden' : 'Visible'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleEditClick(service)} className="text-brand-muted hover:text-brand-cyan hover:bg-brand-light p-2 rounded-lg transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => { if (window.confirm('Delete this service?')) deleteService(service.id) }} className="text-brand-muted hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
