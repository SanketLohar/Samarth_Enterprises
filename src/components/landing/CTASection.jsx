import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import Button from '../ui/Button'
import { companyInfo } from '../../data/categories'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-brand-deep via-brand-deep to-brand-cyan" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready for Pure, Healthy Water?
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            Get a free consultation and customized solution for your home, institution, or industry. No pricing pressure — just expert guidance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="gold" size="lg">
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-brand-deep">
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
