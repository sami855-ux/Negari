"use client"

import { ReportsTable } from "@/components/admin/reportTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  RefreshCw,
  CheckCircle2,
  Shield,
  Sparkles,
  BarChart2,
  Clock,
  TrendingUp,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import useGetReports from "@/hooks/useGetReports"
import toast from "react-hot-toast"

export default function VerifiedReportsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isLoading, refetch, reports } = useGetReports("VERIFIED")
  const [verificationScore] = useState(98) // Example verification score

  const refreshReportData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      toast.success("Verified reports refreshed successfully!")
    } catch {
      toast.error("Error while refreshing verified reports!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      {/* Premium Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="mb-6 border border-teal-200 shadow-sm bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <div className="relative">
                      <CheckCircle2 className="relative z-10 w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-md"></div>
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    Verified Reports
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    AI Verified
                  </Badge>
                </div>

                <CardDescription className="text-emerald-700/80 dark:text-emerald-300/80">
                  Certified reports with {verificationScore}% accuracy guarantee
                </CardDescription>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={refreshReportData}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="flex items-center gap-2 border-emerald-300 bg-white/80 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-700 dark:bg-slate-800/80 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                >
                  <RefreshCw
                    className={`h-4 w-4 transition-transform duration-500 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </Button>
              </motion.div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Verified Reports Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="border border-emerald-200/60 dark:border-emerald-800/30 rounded-lg overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border-b border-emerald-200/30 dark:border-emerald-800/20">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Verified Reports ({reports?.length || 0})
              </span>
            </div>
          </div>
          <ReportsTable reports={reports} isLoading={isLoading} />
        </div>
      </motion.div>

      {/* Verification Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100/70 dark:bg-emerald-900/20">
                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-emerald-900 dark:text-emerald-100">
                  Avg. Time
                </CardTitle>
                <CardDescription className="text-emerald-800/80 dark:text-emerald-200/80">
                  1.2 hours per report
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-teal-50/30 dark:bg-teal-900/10 border-teal-200/50 dark:border-teal-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-teal-100/70 dark:bg-teal-900/20">
                <BarChart2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-teal-900 dark:text-teal-100">
                  Weekly Trend
                </CardTitle>
                <CardDescription className="text-teal-800/80 dark:text-teal-200/80">
                  +15% from last week
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100/70 dark:bg-emerald-900/20">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-emerald-900 dark:text-emerald-100">
                  Accuracy
                </CardTitle>
                <CardDescription className="text-emerald-800/80 dark:text-emerald-200/80">
                  {verificationScore}% success rate
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}
