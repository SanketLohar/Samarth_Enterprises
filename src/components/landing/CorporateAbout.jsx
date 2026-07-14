import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'

const features = [
  'R.O. Systems',
  'W.T.P.',
  'E.T.P.',
  'S.T.P.'
]

export default function CorporateAbout() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Corporate Identity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-light/40 rounded-[2.5rem] transform -rotate-3 scale-105" />
            <div className="relative bg-white border border-gray-100 rounded-[2rem] p-10 lg:p-14 shadow-xl flex flex-col items-center justify-center min-h-[360px]">
              <img
                src="/images/company_logo.png"
                alt="Samarth Enterprises"
                className="w-full max-w-[280px] h-auto drop-shadow-sm"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/images/company_logo.png'
                }}
              />
            </div>
          </motion.div>

          {/* Right: Corporate Overview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              eyebrow="Corporate Overview"
              title="Pioneering Pure Water Solutions"
              subtitle="Samarth Enterprises is a premier Water Treatment Consultant and service provider specializing in end-to-end water management architectures across Domestic, Commercial, and Industrial sectors. Headquartered in Sangli, we deliver high-performance solutions tailored for absolute purity, safety, and compliance."
              align="left"
            />
            
            <div className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  <span className="text-brand-dark font-medium leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-brand-deep rounded-2xl text-white shadow-xl">
              <p className="text-lg font-medium italic">
                "Our commitment goes beyond standard filtration. We design, engineer, and maintain robust treatment frameworks to secure water quality, optimize industrial processing lifecycle demands, and ensure absolute consumer health."
              </p>
              <p className="mt-4 text-sm text-brand-cyan font-bold tracking-wide">
                — Mr. Satish Panhalkar, Water Treatment Consultant
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
