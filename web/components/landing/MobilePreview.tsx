"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  Users,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Screenshot {
  src: string
  alt: string
  title: string
  description: string
}

const MobileAppPreview: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  const screenshots: Screenshot[] = [
    {
      src: "/placeholder.svg?height=600&width=300",
      alt: "Dashboard view",
      title: "Smart Dashboard",
      description: "Get real-time insights at a glance",
    },
    {
      src: "/placeholder.svg?height=600&width=300",
      alt: "Reports interface",
      title: "Instant Reports",
      description: "Report issues with one tap",
    },
    {
      src: "/placeholder.svg?height=600&width=300",
      alt: "Notifications screen",
      title: "Stay Connected",
      description: "Never miss important updates",
    },
  ]

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users" },
    { icon: Star, value: "4.9", label: "App Rating" },
    { icon: Download, value: "100K+", label: "Downloads" },
  ]

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const phoneVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  const buttonVariants: Variants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <section className="relative w-full py-16 overflow-hidden md:py-24 lg:py-32">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          className="absolute bg-blue-200 rounded-full top-20 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bg-purple-200 rounded-full top-40 right-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative px-4 mx-auto md:px-6 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-gray-200 rounded-full bg-white/80 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Now Available
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Negari in Your{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Pocket
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="max-w-3xl mx-auto mt-6 text-lg leading-relaxed text-gray-600 md:text-xl font-jakarta"
          >
            Get instant updates, report issues, and stay connected — anywhere,
            anytime. Experience the power of seamless connectivity.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-12 lg:flex-row lg:gap-16">
          {/* App Store Buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-6 lg:order-first"
          >
            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  size="lg"
                  className="w-full px-8 py-7 text-white transition-all duration-300 bg-black  sm:w-auto hover:bg-gray-800 rounded-2xl hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
                      <span className="text-lg font-bold text-black">📱</span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300 font-geist">
                        Download on the
                      </div>
                      <div className="text-lg font-semibold font-jakarta">
                        App Store
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  size="lg"
                  className="w-full px-8 py-7 text-white transition-all duration-300 bg-green-600  sm:w-auto hover:bg-green-700 rounded-2xl hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
                      <span className="text-3xl font-bold text-green-600 mb-1">
                        ▶
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-green-100">Get it on</div>
                      <div className="text-lg font-semibold font-jakarta">
                        Google Play
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-4 text-center lg:text-left"
            >
              <p className="text-sm text-gray-500">
                Free download • No subscription required
              </p>
            </motion.div>
          </motion.div>

          {/* Screenshot Carousel */}
          <motion.div
            variants={phoneVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Phone Frame */}
            <div className="relative w-80 h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 z-10 w-32 h-6 transform -translate-x-1/2 bg-black left-1/2 rounded-b-2xl"></div>

                {/* Screen Content */}
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  <AnimatePresence mode="wait" custom={currentSlide}>
                    <motion.div
                      key={currentSlide}
                      custom={currentSlide}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                      }}
                      className="absolute inset-0 flex flex-col"
                    >
                      <img
                        src={
                          screenshots[currentSlide].src || "/placeholder.svg"
                        }
                        alt={screenshots[currentSlide].alt}
                        className="object-cover w-full h-full"
                      />

                      {/* Overlay with info */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mb-1 text-lg font-semibold text-white"
                        >
                          {screenshots[currentSlide].title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-sm text-white/80"
                        >
                          {screenshots[currentSlide].description}
                        </motion.p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute z-20 -translate-y-1/2 left-4 top-1/2"
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={prevSlide}
                className="w-12 h-12 border-0 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute z-20 -translate-y-1/2 right-4 top-1/2"
            >
              <Button
                variant="secondary"
                size="icon"
                onClick={nextSlide}
                className="w-12 h-12 border-0 rounded-full shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {screenshots.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-blue-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
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
