import CTASection from "@/components/landing/Cta"
import { FeaturesSection } from "@/components/landing/Features"
import Footer from "@/components/landing/Footer"
import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import MobileAppPreview from "@/components/landing/MobilePreview"

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <MobileAppPreview />
      <CTASection />
      <Footer />
    </>
  )
}

export default Home
