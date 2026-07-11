import { motion } from 'framer-motion'
import { Award, Briefcase, UserCheck, Map } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'

const metrics = [
  { icon: Award, title: 'ISO Certified', desc: 'Quality Assurance' },
  { icon: Briefcase, title: '15+ Years', desc: 'Industry Experience' },
  { icon: UserCheck, title: 'Free Consultation', desc: 'Expert Guidance' },
  { icon: Map, title: 'Pan-Gujarat', desc: 'Service Network' },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-deep text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Edge"
          title="Why Choose Samarth Enterprises"
          subtitle="Delivering uncompromising quality, unmatched expertise, and end-to-end water solutions across Gujarat."
          align="center"
          light={true}
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-cyan/20 flex items-center justify-center mb-6">
                <metric.icon className="w-8 h-8 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-bold mb-2">{metric.title}</h3>
              <p className="text-white/60">{metric.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
