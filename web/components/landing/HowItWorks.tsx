"use client"

import type React from "react"

import { motion, type Variants } from "framer-motion"
import {
  Smartphone,
  Search,
  CheckCircle,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react"

interface Step {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgGradient: string
  number: string
}

const steps: Step[] = [
  {
    title: "Report",
    description:
      "Residents quickly report city issues right from their phones. potholes, broken lights, or anything urgent.",
    icon: Smartphone,
    color: "text-blue-600",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    number: "01",
  },
  {
    title: "Validate",
    description:
      "City officials review and verify each report in real time. no delays, no confusion.",
    icon: Search,
    color: "text-green-600",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    number: "02",
  },
  {
    title: "Resolve",
    description:
      "The issue is assigned, fixed, and everyone involved gets notified instantly. Transparent. Quick. Reliable.",
    icon: CheckCircle,
    color: "text-blue-600",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    number: "03",
  },
  {
    title: "Track",
    description:
      "Negari keeps tabs on all the data progress, trends, and performance, so nothing gets lost.",
    icon: BarChart3,
    color: "text-green-600",
    bgGradient: "from-green-500/10 to-teal-500/10",
    number: "04",
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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const cardVariants: Variants = {
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
  },
}

const iconVariants: Variants = {
  hover: {
    rotate: [0, -10, 10, 0],
    scale: 1.2,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

const arrowVariants: Variants = {
  animate: {
    x: [0, 10, 0],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const HowItWorks: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden md:py-32" id="how-it-works">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-cyan-50/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-green-950/20">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute rounded-full top-20 left-20 w-96 h-96 bg-blue-200/20 mix-blend-multiply filter blur-3xl"
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
          className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-green-200/20 mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      <div className="container relative px-6 mx-auto lg:px-24">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-gray-200 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Simple Process
            </span>
          </motion.div>

          <motion.h2
            className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl dark:text-white font-geist"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            How{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text ">
              Negari
            </span>{" "}
            Works
          </motion.h2>

          <motion.p
            className="max-w-3xl mx-auto mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-jakarta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            From reports to resolutions, Negari turns community action into real
            change through our streamlined four-step process.
          </motion.p>
        </motion.div>

        {/* Enhanced Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container relative px-4 mx-auto"
        >
          <div className="relative z-10 grid items-stretch justify-center w-full gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative flex justify-center w-64"
                >
                  {/* Arrow Between Cards */}
                  {index < steps.length - 1 && (
                    <motion.div
                      variants={arrowVariants}
                      animate="animate"
                      className="absolute z-20 hidden transform -translate-y-1/2 lg:block top-1/2 -right-4"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-lg dark:bg-gray-900 dark:border-gray-700">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className={`min-h-[20rem] w-full max-w-xs bg-gradient-to-br ${step.bgGradient} backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-white/20 dark:border-gray-700/20 cursor-pointer group overflow-hidden`}
                  >
                    {/* Hover Background Pattern */}
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-white/50 to-transparent group-hover:opacity-100" />

                    {/* Step Number */}
                    <motion.div
                      className="absolute flex items-center justify-center w-12 h-12 text-sm font-bold text-white shadow-lg top-4 right-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      className={`w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg ${step.color} group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="mb-4 text-2xl font-bold text-gray-800 transition-colors duration-300 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>

                    {/* Learn More */}
                    <motion.div
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 transition-all duration-300 opacity-0 dark:text-blue-400 group-hover:opacity-100"
                      whileHover={{ x: 5 }}
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-blue-500/5 to-green-500/5 group-hover:opacity-100 rounded-3xl" />
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
