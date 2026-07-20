import { useState } from 'react'
import { Pencil, EyeOff, Eye, Plus, AlertTriangle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { categoryMeta } from '../../data/categories'
import { normalizeProduct } from '../../data/parseProducts'
import ProductForm from './ProductForm'
import Badge from '../ui/Badge'

export default function ProductsTable() {
  const { products, updateProduct, toggleProductVisibility } = useApp()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(query)) ||
      (product.category && product.category.toLowerCase().includes(query)) ||
      (product.tag && product.tag.toLowerCase().includes(query))
    );
  });

  const handleUpdateProduct = (updated) => {
    const normalized = normalizeProduct(updated)
    updateProduct(normalized)
    setEditing(null)
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full mb-6">
        <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search product name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
            />
          </div>
          <button
            onClick={() => { setShowForm(true); setEditing(null) }}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2 bg-brand-deep text-white rounded-lg text-sm font-semibold hover:bg-brand-cyan transition"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {(showForm || editing) && (
        <ProductForm
          product={editing}
          onSave={handleUpdateProduct}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full block whitespace-nowrap scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-500">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Stock</th>
                <th className="px-4 py-3 font-semibold text-gray-500">Tag</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const lowStock = typeof p.stock === 'number' && p.stock < 5
                return (
                  <tr key={p.id} className={p.hidden ? 'opacity-50' : ''}>
                    <td className="px-4 py-3 font-medium text-brand-dark whitespace-normal max-w-[220px]">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{categoryMeta[p.category]?.shortLabel || p.category}</td>
                    <td className="px-4 py-3">
                      {p.hidden ? <Badge variant="resolved">Hidden</Badge> : <Badge variant="new">Visible</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      {typeof p.stock === 'number' ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          lowStock ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {lowStock && <AlertTriangle className="w-3 h-3" />}
                          {p.stock} units
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.tag ? <Badge variant="gold">{p.tag}</Badge> : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => { setEditing(p); setShowForm(false) }} className="p-2 text-gray-400 hover:text-brand-cyan rounded-lg hover:bg-gray-50" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleProductVisibility(p)} className="p-2 text-gray-400 hover:text-orange-500 rounded-lg hover:bg-gray-50" title={p.hidden ? 'Show' : 'Hide'}>
                          {p.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
