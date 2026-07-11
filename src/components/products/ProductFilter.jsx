import { Search } from 'lucide-react'

export default function ProductFilter({ categories, activeCategory, onCategoryChange, search, onSearchChange }) {
  return (
    <aside className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 focus:border-brand-cyan"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeCategory === 'all'
                ? 'bg-brand-deep text-white'
                : 'text-brand-dark hover:bg-brand-light'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex justify-between items-center ${
                activeCategory === cat.id
                  ? 'bg-brand-deep text-white font-medium'
                  : 'text-brand-dark hover:bg-brand-light'
              }`}
            >
              <span className="truncate">{cat.shortLabel}</span>
              <span className={`text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
