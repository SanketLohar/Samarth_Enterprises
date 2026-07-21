import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import Particles from '../react-bits/Particles'
import BlurText from '../react-bits/BlurText'

const features = [
  'R.O. Systems',
  'W.T.P.',
  'E.T.P.',
  'S.T.P.'
]

export default function CorporateAbout() {
  return (
    <section
      className="section-padding bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
      style={{ position: 'relative' }}
    >
      {/* Particles canvas — must be absolute and fill this section */}
      <Particles
        particleCount={50}
        particleColors={['#00e5ff', '#8dbcd8', '#0e7490']}
        speed={0.4}
        moveParticlesOnHover={false}
        style={{ opacity: 0.3, zIndex: 0, pointerEvents: 'none' }}
      />

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Company Logo Card — glassmorphism, no harsh white box */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Tilted accent behind card */}
            <div className="absolute inset-0 bg-brand-light/40 rounded-[2.5rem] transform -rotate-3 scale-105" />

            {/* Outer card — glassmorphism */}
            <div className="relative bg-slate-100/80 border border-slate-200 rounded-2xl p-8 shadow-md flex items-center justify-center min-h-[360px]">
              {/* Inner logo wrapper — frosted, no jarring white box */}
              <div className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-inner flex justify-center items-center w-full">
                <img
                  src="/images/company_logo.png"
                  alt="Samarth Enterprises"
                  className="w-full max-w-[280px] h-auto"
                  style={{ mixBlendMode: 'multiply' }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/images/company_logo.png'
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Corporate Overview Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              eyebrow="Corporate Overview"
              title={<BlurText delay={0.2}>Pioneering Pure Water Solutions</BlurText>}
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
