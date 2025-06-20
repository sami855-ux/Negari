import { FeaturesSection } from "@/components/landing/Features"
import Footer from "@/components/landing/Footer"
import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import HowItWorks from "@/components/landing/HowItWorks"
import MobileAppPreview from "@/components/landing/MobilePreview"

/*******  3beb5042-7fbe-4562-bf0e-fb32d202c5b4  *******/ const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <MobileAppPreview />
      <Footer />
    </>
  )
}

export default Home
