import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Droplets, Sparkles, Waves, Building2, Factory, Filter,
  Sun, Gauge, Settings2, Package, ArrowUpRight,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import SectionHeader from '../ui/SectionHeader'
import SpotlightCard from '../react-bits/SpotlightCard'

const iconMap = {
  Droplets, Sparkles, Waves, Building2, Factory, Filter,
  Sun, Gauge, Settings2, Package,
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function CategoriesGrid() {
  const { categories } = useApp()

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#f8fafc 0%,#ffffff 100%)',
        position: 'relative',
      }}
    >
      {/* CSS mesh grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
        <SectionHeader
          eyebrow="Product Categories"
          title="Complete Water Treatment Solutions"
          subtitle="From residential purifiers to industrial RO plants — browse our full range of authorized products and components."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Package
            return (
              <motion.div key={cat.id} variants={item}>
                <SpotlightCard spotlightColor="rgba(14, 116, 144, 0.15)" className="h-full bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="group card-lift block h-full p-5 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-brand-cyan/0 to-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-brand-light group-hover:bg-brand-cyan/10 flex items-center justify-center mb-4 transition-colors">
                      <Icon className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <h3 className="font-bold text-brand-dark text-sm leading-snug pr-6">
                      {cat.shortLabel}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5 line-clamp-2">{cat.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-semibold text-brand-cyan">{cat.count} products</span>
                      <ArrowUpRight className="w-4 h-4 text-brand-muted group-hover:text-brand-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    </div>
                  </Link>
                </SpotlightCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
