"use client"

import { motion } from "framer-motion"
import { Smartphone, Search, CheckCircle, BarChart3 } from "lucide-react"

const steps = [
  {
    title: "Report",
    description:
      "Residents quickly report city issues right from their phones — potholes, broken lights, or anything urgent.",
    icon: Smartphone,
  },
  {
    title: "Validate",
    description:
      "City officials review and verify each report in real time — no delays, no confusion.",
    icon: Search,
  },
  {
    title: "Resolve",
    description:
      "The issue is assigned, fixed, and everyone involved gets notified instantly. Transparent. Quick. Reliable.",
    icon: CheckCircle,
  },
  {
    title: "Track",
    description:
      "ZenaNet keeps tabs on all the data — progress, trends, and performance — so nothing gets lost.",
    icon: BarChart3,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950 px-6 lg:px-24">
      <div className="text-center mb-16">
        <motion.h2
          className="text-lg lg:text-4xl font-semibold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          How ZenaNet Works
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-xl mx-auto text-lg">
          From reports to resolutions — ZenaNet turns community action into real
          change.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border dark:border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
