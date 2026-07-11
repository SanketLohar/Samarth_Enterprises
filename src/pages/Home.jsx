import Hero from '../components/landing/Hero'
import CorporateAbout from '../components/landing/CorporateAbout'
import ExpertServices from '../components/landing/ExpertServices'
import CategoriesGrid from '../components/landing/CategoriesGrid'
import WhyChooseUs from '../components/landing/WhyChooseUs'
import CTASection from '../components/landing/CTASection'
import FeaturedProducts from '../components/landing/FeaturedProducts'

export default function Home() {
  return (
    <>
      <Hero />
      <CorporateAbout />
      <CategoriesGrid />
      <FeaturedProducts />
      <WhyChooseUs />
      <ExpertServices />
      <CTASection />
    </>
  )
}
