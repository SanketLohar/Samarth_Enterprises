import { motion } from 'framer-motion'
import { ShieldCheck, CheckCircle2, PhoneCall, ArrowRight, Settings, Users, PenTool, ClipboardCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'

const steps = [
  { step: '01', title: 'Service Request', desc: 'Book a service online or call us directly.', icon: PhoneCall },
  { step: '02', title: 'Expert Assignment', desc: 'A certified technician is assigned to your site.', icon: Users },
  { step: '03', title: 'Precision Audit & Repair', desc: 'Thorough inspection and genuine parts replacement.', icon: PenTool },
  { step: '04', title: 'Post-Service Verification', desc: 'Ensuring 100% efficiency and pure water delivery.', icon: ClipboardCheck },
]

const features = [
  { icon: ShieldCheck, title: 'Certified Technicians', desc: 'Highly trained professionals for all major systems.' },
  { icon: Settings, title: 'Genuine Spare Parts', desc: 'Authentic membranes, filters, and electrical components.' },
  { icon: CheckCircle2, title: 'Quick Resolution', desc: 'Rapid response times.' },
]

const hardcodedServices = [
  { id: 1, name: 'Installation Service', description: 'Professional setup and calibration for all domestic and commercial water purifiers, softeners, and treatment plants.', image: 'ro installation.png' },
  { id: 2, name: 'Filter & Membrane Replacement', description: 'Genuine replacement of RO membranes, carbon filters, and UV lamps to ensure optimal water quality.', image: 'filter and membrane replacement 1.png' },
  { id: 3, name: 'Annual Maintenance Contract (AMC)', description: 'Comprehensive yearly maintenance packages covering regular service visits and spare part replacements.', image: 'Annual Maintenance Contract (AMC).png' },
  { id: 4, name: 'Specialized Repair & Diagnostics', description: 'Expert troubleshooting and rapid repair for all major water purification and treatment systems.', image: 'specialized repair and dignostic (1).png' },
  { id: 5, name: 'STP Operations & Overhauls', description: 'End-to-end management, maintenance, and periodic overhauls for Sewage Treatment Plants.', image: 'STP Operations & Overhauls.jpg' },
  { id: 6, name: 'ETP Management Solutions', description: 'Advanced operational support and compliance management for Industrial Effluent Treatment Plants.', image: 'ETP Management Solutions.jpg' },
]

export default function Services() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-brand-deep text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(50,140,193,0.2)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-brand-cyan text-xs font-bold tracking-[0.25em] uppercase">Professional Support</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold mt-3 tracking-tight">
              Enterprise Service Solutions
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
              Authorized installation, comprehensive maintenance, and expert repairs for domestic, commercial, and industrial water treatment systems.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Services Grid */}
        <div className="mb-24">
          <SectionHeader
            eyebrow="Our Offerings"
            title="Comprehensive Water Management"
            subtitle="Explore our range of operational and maintenance services dedicated to keeping your systems in peak condition."
            align="center"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {hardcodedServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img
                    src={`/images/${service.image}`}
                    alt={service.name.replace(/nexapure/gi, 'Samarth Enterprises')}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/images/company_logo.png'
                      e.target.className = 'w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-8 flex flex-col flex-1 relative bg-white">
                  <h3 className="text-xl font-bold text-brand-dark mb-3">
                    {service.name.replace(/nexapure/gi, 'Samarth Enterprises')}
                  </h3>
                  <p className="text-brand-muted leading-relaxed mb-8 flex-1">
                    {service.description.replace(/nexapure/gi, 'Samarth Enterprises')}
                  </p>
                  
                  <Link to="/contact">
                    <Button variant="outline" className="w-full justify-center group-hover:bg-brand-cyan group-hover:text-brand-deep group-hover:border-brand-cyan transition-colors">
                      Book Service
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4-Step Service Execution */}
        <div className="mb-24 py-16 bg-white rounded-[3rem] shadow-xl shadow-brand-deep/5 border border-gray-100 px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-brand-dark">Our Seamless 4-Step Execution</h2>
            <p className="text-brand-muted mt-4">A proven operational workflow ensuring minimal downtime.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100" />
            
            {steps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative text-center"
              >
                <div className="w-24 h-24 mx-auto bg-white border-[6px] border-gray-50 rounded-full flex items-center justify-center shadow-md relative z-10 mb-6">
                  <step.icon className="w-8 h-8 text-brand-cyan" />
                </div>
                <div className="text-sm font-black text-brand-cyan mb-2 tracking-widest">{step.step}</div>
                <h4 className="text-lg font-bold text-brand-dark mb-2">{step.title}</h4>
                <p className="text-sm text-brand-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Feature Block */}
        <div className="mb-24">
          <SectionHeader
            eyebrow="The Samarth Standard"
            title="Why Choose Our Service?"
            align="center"
          />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-brand-deep p-8 rounded-3xl text-center border border-white/10 hover:border-brand-cyan/30 transition-colors"
              >
                <div className="w-16 h-16 mx-auto bg-brand-cyan/20 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-brand-cyan" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {feature.title.replace(/nexapure/gi, 'Samarth Enterprises')}
                </h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.desc.replace(/nexapure/gi, 'Samarth Enterprises')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand-cyan to-brand-deep rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.svg')] opacity-10 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">Need Immediate Assistance?</h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
              Our technical support team is ready to dispatch experts to your location for emergency repairs or scheduled maintenance.
            </p>
            <Link to="/contact">
              <Button size="xl" className="!bg-white !text-brand-deep hover:!bg-gray-100 border-none shadow-xl shadow-brand-deep/20">
                Contact Support Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
