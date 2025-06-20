"use client"

import { motion } from "framer-motion"
import {
  LayoutGrid,
  ShieldAlert,
  Megaphone,
  Users,
  BarChart4,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const features = [
  {
    icon: <LayoutGrid className="w-6 h-6" />,
    title: "Smart Reporting System",
    description: "AI-powered incident categorization and tracking",
    color: "text-blue-600",
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    title: "Real-time Security Alerts",
    description: "Instant notifications for safety incidents",
    color: "text-emerald-600",
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Urban Issue Tracker",
    description: "Infrastructure monitoring and resolution",
    color: "text-blue-600",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Collaboration",
    description: "Citizen-authority communication platform",
    color: "text-emerald-600",
  },
  {
    icon: <BarChart4 className="w-6 h-6" />,
    title: "Data Analytics Dashboard",
    description: "Actionable urban intelligence metrics",
    color: "text-blue-600",
  },
]

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Professional Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Core Features
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Enterprise-grade solutions for modern urban management
          </motion.p>
        </div>

        {/* Professional Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item} className="h-full">
              <Card className="h-full  border border-gray-200 dark:border-gray-800 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-colors">
                <CardHeader className="p-6  flex items-center justify-center">
                  <div
                    className={`mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 w-fit ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-center font-medium text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-center dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
