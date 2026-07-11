import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { categoryMeta } from '../../data/categories'
import { slugify } from '../../data/parseProducts'

export default function ProductForm({ product, onSave, onCancel }) {
  const { categories } = useApp()
  const [form, setForm] = useState({
    id: product?.id || `custom-${Date.now()}`,
    name: product?.name || '',
    category: product?.category || categories[0]?.id || 'water-purifiers',
    image: product?.image || '',
    description: product?.description || '',
    specifications: (product?.specifications || []).join('\n'),
    tag: product?.tag || '',
    featured: product?.featured || false,
    hidden: product?.hidden || false,
    warranty: product?.warranty || '',
    stock: product?.stock ?? '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const image = form.image || `${slugify(form.name)}.svg`
    onSave({
      ...form,
      image,
      tag: form.tag || null,
      specifications: form.specifications.split('\n').filter(Boolean),
      warranty: form.warranty !== '' ? Number(form.warranty) : null,
      stock: form.stock !== '' ? Number(form.stock) : null,
    })
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 mb-6 space-y-4">
      <h3 className="font-bold text-brand-dark">{product ? 'Edit Product' : 'Add New Product'}</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Product Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Category *</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {Object.entries(categoryMeta).map(([id, meta]) => (
              <option key={id} value={id}>{meta.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Image filename</label>
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="product-name.jpg" className={inputCls} />
        <p className="text-[11px] text-gray-400 mt-1">Path: /images/{form.category}/{form.image || 'filename.jpg'}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Description *</label>
        <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Specifications (one per line)</label>
        <textarea rows={4} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} className={`${inputCls} resize-none font-mono text-xs`} />
      </div>

      {/* Inventory Fields */}
      <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Warranty (Years)</label>
          <input
            type="number"
            min="0"
            value={form.warranty}
            onChange={(e) => setForm({ ...form, warranty: e.target.value })}
            placeholder="e.g. 2"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Stock (Units)</label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="e.g. 25"
            className={inputCls}
          />
          {form.stock !== '' && Number(form.stock) < 5 && (
            <p className="text-[11px] text-red-500 mt-1 font-semibold">⚠ Low stock warning will be triggered</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Tag</label>
          <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Premium, New..." className={inputCls} />
        </div>
        <label className="flex items-center gap-2 text-sm pt-6">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm pt-6">
          <input type="checkbox" checked={form.hidden} onChange={(e) => setForm({ ...form, hidden: e.target.checked })} />
          Hidden
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="px-5 py-2 bg-brand-deep text-white rounded-lg text-sm font-semibold hover:bg-brand-cyan transition">
          Save Product
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  )
}
