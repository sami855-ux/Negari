"use client"

import type React from "react"

import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  Smartphone,
  Globe,
  Users,
  Shield,
  Zap,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface CTAButton {
  text: string
  icon: React.ReactNode
  variant: "primary" | "secondary"
  href?: string
  onClick?: () => void
}

const ctaButtons: CTAButton[] = [
  {
    text: "Launch Web App",
    icon: <Globe className="w-5 h-5" />,
    variant: "primary",
    href: "/app",
  },
  {
    text: "Get the App",
    icon: <Smartphone className="w-5 h-5" />,
    variant: "secondary",
    href: "/download",
  },
]

const stats = [
  { icon: Users, value: "50K+", label: "Active Users" },
  { icon: Shield, value: "99.9%", label: "Uptime" },
  { icon: Zap, value: "<30s", label: "Response Time" },
  { icon: Star, value: "4.9", label: "User Rating" },
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
      duration: 0.6,
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
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden md:py-24" id="about">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-green-900 to-blue-900">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute rounded-full top-20 left-20 w-96 h-96 bg-blue-400/20 mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-purple-400/20 mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 mix-blend-multiply filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Floating Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 right-20 text-white/20"
      >
        <Shield className="w-16 h-16" />
      </motion.div>
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute bottom-32 left-20 text-white/20"
      >
        <Users className="w-12 h-12" />
      </motion.div>
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "4s" }}
        className="absolute top-1/3 left-1/4 text-white/20"
      >
        <Zap className="w-10 h-10" />
      </motion.div>

      <div className="container relative max-w-6xl px-4 mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border rounded-full bg-white/10 backdrop-blur-sm border-white/20"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              Join Thousands of Active Users
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            variants={itemVariants}
            className="mb-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Start Reporting Now –{" "}
            <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text">
              Empower
            </span>
            <br />
            Your Neighborhood
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-12 text-lg leading-relaxed text-blue-100 md:text-xl"
          >
            Join thousands of citizens making their communities safer and
            smarter. Report issues, track progress, and create positive change
            with just a few taps.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-6 mb-16 sm:flex-row"
          >
            {ctaButtons.map((button, index) => (
              <motion.div
                key={index}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  size="lg"
                  className={`
                    px-8 py-6 text-lg font-semibold rounded-2xl shadow-2xl transition-all duration-300 min-w-[200px]
                    ${
                      button.variant === "primary"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black shadow-yellow-500/25"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                    }
                  `}
                  onClick={button.onClick}
                >
                  <div className="flex items-center gap-3">
                    {button.icon}
                    <span>{button.text}</span>
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
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid max-w-4xl grid-cols-2 gap-8 mx-auto md:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <motion.div
                      className="mb-1 text-2xl font-bold text-white md:text-3xl"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 opacity-60"
          >
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Users className="w-5 h-5" />
              <span className="text-sm">Community Driven</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </section>
  )
}

export default CTASection
