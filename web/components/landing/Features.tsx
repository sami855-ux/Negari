"use client"

import type React from "react"

import { motion, type Variants } from "framer-motion"
import {
  LayoutGrid,
  ShieldAlert,
  Megaphone,
  Users,
  BarChart4,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  bgGradient: string
  stats?: string
  highlight?: boolean
}

const features: Feature[] = [
  {
    icon: <LayoutGrid className="w-7 h-7" />,
    title: "Smart Reporting System",
    description:
      "AI-powered incident categorization and tracking with machine learning algorithms",
    color: "text-blue-600",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    stats: "99.2% Accuracy",
    highlight: true,
  },
  {
    icon: <ShieldAlert className="w-7 h-7" />,
    title: "Real-time Security Alerts",
    description:
      "Instant notifications for safety incidents with automated response protocols",
    color: "text-emerald-600",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    stats: "<30s Response",
  },
  {
    icon: <Megaphone className="w-7 h-7" />,
    title: "Urban Issue Tracker",
    description:
      "Infrastructure monitoring and resolution with predictive maintenance insights",
    color: "text-purple-600",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    stats: "24/7 Monitoring",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Community Collaboration",
    description:
      "Citizen-authority communication platform with integrated feedback loops",
    color: "text-orange-600",
    bgGradient: "from-orange-500/10 to-red-500/10",
    stats: "50K+ Users",
  },
  {
    icon: <BarChart4 className="w-7 h-7" />,
    title: "Data Analytics Dashboard",
    description:
      "Actionable urban intelligence metrics with real-time visualization tools",
    color: "text-indigo-600",
    bgGradient: "from-indigo-500/10 to-blue-500/10",
    stats: "Live Insights",
    highlight: true,
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
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
    y: -8,
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
    scale: 1.1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden md:py-32" id="features">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute rounded-full top-20 left-20 w-96 h-96 bg-blue-200/20 mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-purple-200/20 mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container relative px-4 mx-auto max-w-7xl">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-gray-200 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm dark:border-gray-700"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enterprise Solutions
            </span>
          </motion.div>

          <motion.h2
            className="mb-6 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Core{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text">
              Features
            </span>
          </motion.h2>

          <motion.p
            className="text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Enterprise-grade solutions for modern urban management with
            cutting-edge technology and seamless integration
          </motion.p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`h-full ${
                feature.highlight ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="h-full cursor-pointer group"
              >
                <Card
                  className={`h-full relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm`}
                >
                  {/* Highlight Badge */}
                  {feature.highlight && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="absolute px-2 py-1 text-xs font-bold text-white rounded-full top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500"
                    >
                      Popular
                    </motion.div>
                  )}

                  {/* Animated Border */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 group-hover:opacity-100" />

                  <CardHeader className="relative p-8 text-center">
                    {/* Icon Container */}
                    <motion.div
                      variants={iconVariants}
                      whileHover="hover"
                      className={`mb-6 mx-auto p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm w-fit shadow-lg ${feature.color} group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      {feature.icon}
                    </motion.div>

                    {/* Stats Badge */}
                    {feature.stats && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-gray-700 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm dark:text-gray-300"
                      >
                        {feature.stats}
                      </motion.div>
                    )}

                    <CardTitle className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {feature.title}
                    </CardTitle>

                    <CardDescription className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </CardDescription>

                    {/* Learn More Link */}
                    <motion.div
                      className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 transition-all duration-300 opacity-0 dark:text-blue-400 group-hover:opacity-100"
                      whileHover={{ x: 5 }}
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </CardHeader>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-blue-500/5 to-transparent group-hover:opacity-100" />
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export { FeaturesSection }
