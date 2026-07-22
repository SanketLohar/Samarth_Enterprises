import { motion } from 'framer-motion'
import { Shield, Target, Users, Award, CheckCircle2, Factory } from 'lucide-react'
import { companyInfo } from '../data/categories'
import SectionHeader from '../components/ui/SectionHeader'
import CTASection from '../components/landing/CTASection'

const values = [
  { icon: Shield, title: 'Quality First', desc: 'Every product we distribute meets rigorous quality standards and comes with manufacturer warranty.' },
  { icon: Target, title: 'Customer Focus', desc: 'We listen to your water challenges and recommend solutions tailored to your specific needs.' },
  { icon: Users, title: 'Expert Team', desc: 'Our technicians and sales consultants bring decades of combined water treatment experience.' },
  { icon: Award, title: 'Trusted Partner', desc: 'Authorized dealer relationships with leading brands ensure genuine products and spare parts.' },
]

const capabilities = [
  'R.O. Systems',
  'W.T.P.',
  'E.T.P.',
  'S.T.P.'
]

export default function About() {
  return (
    <>
      <div className="bg-brand-deep text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(50,140,193,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-cyan text-xs font-bold tracking-[0.25em] uppercase">Corporate Overview</span>
            <h1 className="text-4xl lg:text-6xl font-extrabold mt-3 tracking-tight">Pioneering Purity for a Healthier World</h1>
            <p className="mt-6 text-lg text-white/70 max-w-3xl leading-relaxed">
              {companyInfo.name} has architected advanced water management infrastructure, scaling from premium domestic purification to massive industrial effluent treatment networks.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Narrative & Video Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-brand-muted leading-relaxed text-lg"
          >
            <h2 className="text-3xl font-extrabold text-brand-dark mb-8">Integrated Water Treatment Expertise</h2>
            <p>
              Samarth Enterprises is a premier Water Treatment Consultant and service provider specializing in end-to-end water management architectures across Domestic, Commercial, and Industrial sectors. Headquartered in Sangli.We are also a proud member of BNI. We deliver high-performance solutions tailored for absolute purity, safety, and compliance.
            </p>
            <div className="mt-8 p-6 bg-brand-light rounded-2xl border border-brand-cyan/20 relative">
              <p className="text-lg text-brand-dark italic font-medium relative z-10">
                "Our commitment goes beyond standard filtration. We design, engineer, and maintain robust treatment frameworks to secure water quality, optimize industrial processing lifecycle demands, and ensure absolute consumer health."
              </p>
              <p className="mt-4 text-sm font-bold text-brand-deep tracking-wide relative z-10">
                — Mr. Satish Panhalkar, Water Treatment Consultant
              </p>
            </div>
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capabilities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-brand-dark">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Corporate Footage */}
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-white relative pb-8 px-8">
              <video
                src="/videos/aboutus.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
                poster="/images/company_logo.png"
              />
              <div className="absolute inset-0 border border-black/5 rounded-[2rem] pointer-events-none" />
            </div>

          </motion.div>
        </div>
      </section>

      {/* Core Engineering Panel */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <SectionHeader
            eyebrow="Technical Superiority"
            title="Core Engineering: Advanced Multi-Stage Filtration Integrity"
            align="center"
          />
          <p className="text-lg text-brand-muted leading-relaxed mt-8">
            Every system deployed by Samarth Enterprises leverages best-in-class technological frameworks. We utilize high-rejection Thin-Film Composite (TFC) RO membranes capable of filtering dissolved solids at the microscopic level. Our commercial and industrial portfolios integrate robust activated carbon blocks, dynamic aeration bioreactors, and automated ion-exchange mechanisms to guarantee unparalleled purity and environmental compliance.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Our Values" title="What Drives Us" align="center" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-brand-deep/5 transition-all duration-300 group"
              >
                <div className="bg-brand-light w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-cyan transition-all duration-300 shadow-xs group-hover:shadow-md group-hover:shadow-brand-cyan/30">
                  <Icon className="w-7 h-7 text-brand-cyan group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-bold text-xl text-brand-dark mb-3">{title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
