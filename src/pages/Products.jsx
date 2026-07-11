import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { filterProducts } from '../data/parseProducts'
import ProductFilter from '../components/products/ProductFilter'
import ProductCard from '../components/products/ProductCard'
import EnquiryModal from '../components/products/EnquiryModal'

const container = {
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
}

export default function Products() {
  const { visibleProducts, categories } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [enquiryProduct, setEnquiryProduct] = useState(null)

  // Decode the category param — it may include spaces (e.g. "Ro purifiers")
  const activeCategory = searchParams.get('category')
    ? decodeURIComponent(searchParams.get('category'))
    : 'all'

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    const results = filterProducts(visibleProducts, { category: activeCategory, search })
    // Prioritize valid local photography (.jpg, .png) over vector fallbacks or missing assets
    return results.sort((a, b) => {
      const aHasPhoto = a.image && (a.image.endsWith('.jpg') || a.image.endsWith('.png') || a.image.endsWith('.jpeg'))
      const bHasPhoto = b.image && (b.image.endsWith('.jpg') || b.image.endsWith('.png') || b.image.endsWith('.jpeg'))
      
      if (aHasPhoto && !bHasPhoto) return -1
      if (!aHasPhoto && bHasPhoto) return 1
      return 0
    })
  }, [visibleProducts, activeCategory, search])

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams)
    if (cat === 'all') params.delete('category')
    else params.set('category', encodeURIComponent(cat))
    setSearchParams(params)
  }

  const activeCategoryLabel = categories.find((c) => c.id === activeCategory)?.label

  return (
    <div className="bg-brand-light/30 min-h-screen">
      {/* Page header */}
      <div className="bg-brand-deep text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(50,140,193,0.2)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-brand-cyan text-xs font-bold tracking-[0.25em] uppercase">Catalog</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2">
              {activeCategoryLabel || 'Product Range'}
            </h1>
            <p className="text-white/60 mt-3 max-w-xl">
              Browse our complete lineup of authorized water purification, softening, and treatment systems.
              Request a quote for pricing and professional installation.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          {/* Sidebar filter */}
          <div className="lg:sticky lg:top-24 lg:self-start overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar pr-2">
            <ProductFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              search={search}
              onSearchChange={setSearch}
            />
          </div>

          {/* Product grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-brand-muted">
                Showing{' '}
                <span className="font-semibold text-brand-dark">{filtered.length}</span> products
                {activeCategory !== 'all' && activeCategoryLabel && (
                  <>
                    {' '}in{' '}
                    <span className="font-semibold text-brand-cyan">{activeCategoryLabel}</span>
                  </>
                )}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs text-brand-muted hover:text-brand-deep underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-4xl mb-4">💧</div>
                <p className="text-brand-muted font-medium">No products match your search.</p>
                <p className="text-sm text-gray-400 mt-1">Try a different category or clear your search.</p>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filtered.map((product) => (
                  <motion.div key={product.id} variants={item} layout>
                    <ProductCard product={product} onEnquire={setEnquiryProduct} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <EnquiryModal
        product={enquiryProduct}
        open={!!enquiryProduct}
        onClose={() => setEnquiryProduct(null)}
      />
    </div>
  )
}
