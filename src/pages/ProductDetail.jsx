import { useState, useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, MessageSquare } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getProductById } from '../data/parseProducts'
import { categoryMeta } from '../data/categories'
import ProductImage from '../components/ui/ProductImage'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function ProductDetail() {
  const { id } = useParams()
  const { visibleProducts } = useApp()
  const navigate = useNavigate()
  const product = getProductById(visibleProducts, id)

  if (!product) return <Navigate to="/products" replace />

  const cat = categoryMeta[product.category]
  const related = visibleProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Samarth Enterprises`
    }
  }, [product])

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/products?category=${encodeURIComponent(product.category)}`}
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-cyan transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {cat?.shortLabel || 'Products'}
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-brand-light rounded-3xl p-8 lg:p-12 aspect-square flex items-center justify-center"
          >
            <ProductImage product={product} className="max-w-full max-h-full object-contain" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
                {cat?.label}
              </span>
              {product.tag && <Badge variant="gold">{product.tag}</Badge>}
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-brand-dark tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-brand-muted leading-relaxed text-lg">{product.description}</p>

            {product.specifications?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-brand-dark mb-4">Specifications</h3>
                <ul className="space-y-2.5">
                  {product.specifications.map((spec) => (
                    <li key={spec} className="flex items-start gap-2.5 text-sm text-brand-dark">
                      <Check className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.warranty && (
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-semibold">
                <Check className="w-4 h-4 shrink-0" />
                {product.warranty} Year{product.warranty > 1 ? 's' : ''} Warranty
              </div>
            )}

            <div className="mt-10 p-6 rounded-2xl bg-brand-light border border-brand-cyan/10">
              <p className="text-sm text-brand-muted mb-4">
                Get personalized pricing, installation guidance, and AMC options from our water treatment experts.
              </p>
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/contact', { state: { chosenProduct: product.name } })}>
                <MessageSquare className="w-4 h-4" />
                Enquire Now
              </Button>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-14">
            <h2 className="text-xl font-bold text-brand-dark mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-cyan/30 card-lift"
                >
                  <div className="w-16 h-16 rounded-lg bg-brand-light overflow-hidden shrink-0">
                    <ProductImage product={p} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-brand-dark line-clamp-2">{p.name}</p>
                    <p className="text-xs text-brand-cyan mt-0.5">View details →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
