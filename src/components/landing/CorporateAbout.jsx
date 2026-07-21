import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'

const features = ['R.O. Systems', 'W.T.P.', 'E.T.P.', 'S.T.P.']

export default function CorporateAbout() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      ref={ref}
      className="section-padding relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #f0f9ff 0%, #e8f4fb 40%, #f8fafc 100%)',
      }}
    >
      {/* Pure CSS ambient radial glow — no canvas, guaranteed visible */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,116,144,0.10) 0%, transparent 70%)',
        }}
      />
      {/* Subtle dot-grid mesh */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right,#80808010 1px,transparent 1px),linear-gradient(to bottom,#80808010 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Elevated logo focus card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Tilted accent slab behind card */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl transform -rotate-2 scale-105"
              style={{ background: 'linear-gradient(135deg,rgba(14,116,144,0.12),rgba(186,230,253,0.35))', zIndex: 0 }}
            />

            {/* Focus card — high elevation, no inner white box */}
            <div
              className="relative rounded-3xl p-10 flex items-center justify-center"
              style={{
                zIndex: 1,
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(148,163,184,0.5)',
                boxShadow: '0 20px 50px rgba(8,112,184,0.10), 0 4px 16px rgba(0,0,0,0.04)',
                minHeight: '360px',
              }}
            >
              <img
                src="/images/company_logo.png"
                alt="Samarth Enterprises"
                className="max-h-64 w-full object-contain drop-shadow-md"
                style={{ mixBlendMode: 'multiply' }}
                onError={(e) => { e.target.onerror = null }}
              />
            </div>
          </motion.div>

          {/* Right: Corporate overview text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
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
