import { MessageCircle } from 'lucide-react'
import { companyInfo } from '../../data/categories'

export default function WhatsAppButton() {
  const phoneNumber = companyInfo.phone.split(',')[0].replace(/\s/g, '').replace('+', '')
  const message = 'Hello Samarth Enterprises, I am interested in your water purification and environmental solutions. Please provide more details.'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
        <MessageCircle className="w-8 h-8" />
      </div>
    </a>
  )
}
