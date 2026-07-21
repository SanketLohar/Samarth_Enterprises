import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import SectionHeader from '../ui/SectionHeader'
import ProductCard from '../products/ProductCard'
import EnquiryModal from '../products/EnquiryModal'

export default function FeaturedProducts() {
  const { visibleProducts } = useApp()
  const featured = visibleProducts.filter((p) => p.featured).slice(0, 12)
  const [enquiryProduct, setEnquiryProduct] = useState(null)

  if (!featured.length) return null

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f0f9ff 60%,#f8fafc 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeader
            eyebrow="Top Picks"
            title="Featured Products"
            subtitle="Handpicked solutions trusted by homeowners and industries alike."
            align="left"
          />
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-cyan hover:text-brand-deep transition shrink-0 sm:mb-16"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEnquire={setEnquiryProduct}
            />
          ))}
        </motion.div>
      </div>

      <EnquiryModal
        product={enquiryProduct}
        open={!!enquiryProduct}
        onClose={() => setEnquiryProduct(null)}
      />
    </section>
  )
}
