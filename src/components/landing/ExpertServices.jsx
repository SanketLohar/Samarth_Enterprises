import { motion } from 'framer-motion'
import { Wrench, ShieldCheck, Droplet, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from '../ui/SectionHeader'
import BlurText from '../react-bits/BlurText'
import SpotlightCard from '../react-bits/SpotlightCard'

const services = [
  {
    icon: ShieldCheck,
    title: 'Comprehensive RO AMC',
    description: 'Annual Maintenance Contracts for domestic and commercial RO systems ensuring zero downtime and 100% pure water.',
    color: 'bg-emerald-50 text-emerald-600',
    link: '/services'
  },
  {
    icon: Wrench,
    title: 'Expert RO Repair',
    description: 'Rapid-response troubleshooting and repair by certified technicians for all major water purifier brands.',
    color: 'bg-brand-light text-brand-cyan',
    link: '/services'
  },
  {
    icon: Droplet,
    title: 'Genuine Filter Replacement',
    description: 'Authentic sediment, carbon, and RO membrane replacements to maintain peak filtration efficiency.',
    color: 'bg-purple-50 text-purple-600',
    link: '/services'
  }
]

export default function ExpertServices() {
  return (
    <section
      className="relative overflow-hidden section-padding"
      style={{
        background: 'linear-gradient(160deg,#f0f9ff 0%,#e8f4fb 50%,#f8fafc 100%)',
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
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          eyebrow="Professional Support"
          title={<BlurText delay={0.2}>Expert Services &amp; Maintenance</BlurText>}
          subtitle="Beyond sales, our dedicated service network guarantees the longevity and performance of your water purification systems."
          align="center"
        />

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <SpotlightCard spotlightColor="rgba(14, 116, 144, 0.12)" className="bg-white rounded-3xl p-8 shadow-xl shadow-brand-deep/5 border border-gray-100 group hover:-translate-y-2 transition-transform duration-300 h-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.color}`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">
                  <BlurText delay={0.1}>{service.title}</BlurText>
                </h3>
                <p className="text-brand-muted leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link to={service.link} className="inline-flex items-center gap-2 text-sm font-bold text-brand-cyan group-hover:text-brand-deep transition-colors">
                  Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
