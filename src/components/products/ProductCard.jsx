import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquare } from 'lucide-react'
import { categoryMeta } from '../../data/categories'
import ProductImage from '../ui/ProductImage'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

export default function ProductCard({ product, onEnquire }) {
  const cat = categoryMeta[product.category]

  return (
    <article className="group card-lift bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-brand-light overflow-hidden">
        <ProductImage
          product={product}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        {product.tag && (
          <div className="absolute top-3 left-3">
            <Badge variant="gold">{product.tag}</Badge>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] font-bold text-brand-cyan uppercase tracking-wider mb-1.5">
          {cat?.shortLabel || product.category}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-brand-dark group-hover:text-brand-cyan transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-brand-muted mt-2 line-clamp-2 flex-1">{product.description}</p>

        <div className="mt-5 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onEnquire?.(product)}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Enquire Now
          </Button>
          <Link to={`/products/${product.id}`}>
            <Button variant="ghost" size="sm" className="px-3">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
