"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button" // shadcn button

const MobileAppPreview = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const screenshots = [
    "/screenshots/app-1.png", // Replace with your actual image paths
    "/screenshots/app-2.png",
    "/screenshots/app-3.png",
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold text-primary tracking-tight sm:text-3xl md:text-4xl">
            ZenaNet in Your Pocket
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant updates, report issues, and stay connected — anywhere.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* App Store Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 md:flex-col md:order-first"
          >
            <Button variant="outline" size="lg" className="gap-2">
              <img src="/icons/app-store.svg" alt="App Store" className="h-6" />
              App Store
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <img
                src="/icons/play-store.svg"
                alt="Play Store"
                className="h-6"
              />
              Google Play
            </Button>
          </motion.div>

          {/* Screenshot Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-md"
          >
            <div className="overflow-hidden relative rounded-xl shadow-2xl border border-gray-200 h-96">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={screenshots[currentSlide]}
                  alt={`App screenshot ${currentSlide + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-auto"
                />
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-sm"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-sm"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicators */}
            <div className="flex justify-center mt-4 gap-2">
              {screenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentSlide === index ? "bg-primary" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MobileAppPreview
