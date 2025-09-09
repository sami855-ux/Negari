"use client"

import type React from "react"

import {
  CloudLightningIcon,
  CheckCircleIcon,
  BarChart2Icon,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
import { useRouter } from "next/navigation"

interface Feature {
  id: number
  icon: React.ReactNode
  title: string
  description: string
  position: string
  delay: number
}

const Hero: React.FC = () => {
  const router = useRouter()

  // Partner logos data with enhanced styling

  // Enhanced feature cards data
  const features: Feature[] = [
    {
      id: 1,
      icon: <CheckCircleIcon className="text-orange-600" size={24} />,
      title: "Real-time Reporting",
      description: "Instant submission and tracking",
      position: "top-2/3 right-10 md:right-44",
      delay: 0.8,
    },
    {
      id: 2,
      icon: <BarChart2Icon className="text-blue-800" size={24} />,
      title: "Powerful Analytics",
      description: "Data-driven insights",
      position: "bottom-1/4 left-5 md:left-10",
      delay: 1.0,
    },
    {
      id: 3,
      icon: <Shield className="text-green-800" size={24} />,
      title: "Fast Response",
      description: "Instant submission and tracking",
      position: "top-4 right-10 md:right-12",
      delay: 1.2,
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
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

  const floatingVariants: Variants = {
    animate: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      rotate: [0, 2, 0, -2, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div
      className="w-full mt-[75px] flex flex-col items-center justify-center min-h-[calc(100vh-74px)] relative overflow-hidden"
      id="hero"
    >
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute w-40 h-40 rounded-full top-20 left-20 bg-green-200/30 mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full top-60 right-32 bg-blue-200/30 mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute rounded-full bottom-20 left-1/2 w-52 h-52 bg-purple-200/30 mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Enhanced floating feature cards */}
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          className={`absolute ${feature.position} z-10 hidden lg:block`}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: feature.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          variants={floatingVariants}
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div
            className="p-6 transition-all duration-300 border shadow-xl bg-white/90 backdrop-blur-md rounded-2xl border-white/30 hover:shadow-2xl"
            whileHover={{
              scale: 1.05,
              y: -5,
              transition: { duration: 0.2 },
            }}
          >
            <div className="flex items-start space-x-4">
              <motion.div
                className="p-3 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {feature.icon}
              </motion.div>
              <div>
                <h4 className="mb-1 font-semibold text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-6xl px-4 -top-6 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Enhanced tagline with animation */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center mb-8 space-x-3"
          >
            <motion.div
              animate={{
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <CloudLightningIcon size={28} className="text-green-900" />
            </motion.div>
            <motion.span
              className="text-[15px] text-green-900 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200/50 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Created for the Ethiopian people
              </span>
            </motion.span>
          </motion.div>

          {/* Enhanced main headline */}
          <motion.h1
            variants={titleVariants}
            className="py-4 text-5xl font-extrabold leading-tight text-center text-transparent  md:text-7xl bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 bg-clip-text"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-grotesk"
            >
              Empowering Communities
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-grotesk"
            >
              Through Smart Connectivity
            </motion.span>
          </motion.h1>

          {/* Enhanced subheading */}
          <motion.p
            variants={itemVariants}
            className="max-w-4xl pt-3 mx-auto text-base md:text-lg leading-relaxed text-center text-gray-600 font-jakarta"
          >
            Streamline community reporting, enhance transparency, and empower
            decision-making with our all-in-one solution designed specifically
            for{" "}
            <span className="font-semibold text-green-700">
              Ethiopian communities
            </span>
            .
          </motion.p>

          {/* Enhanced CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-6 pt-10 sm:flex-row"
          >
            <motion.div
              variants={buttonVariants}
              whileTap="tap"
              onClick={() => router.push("/login")}
            >
              <Button className="bg-gradient-to-r from-green-700 to-green-600 text-white h-12 text-lg rounded-2xl font-geist px-10 hover:from-green-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[180px]">
                <span className="flex items-center gap-3">
                  Start For Free
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>

            <motion.div variants={buttonVariants} whileTap="tap">
              <Button className="bg-white/80 backdrop-blur-sm h-14 text-lg rounded-2xl text-green-900 font-geist px-10 hover:bg-white border-2 border-green-200 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[180px]">
                Get a Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-white/50 to-transparent" />
    </div>
  )
}

export default Hero
