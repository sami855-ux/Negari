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
import { RefreshCw, XCircle, AlertTriangle, Ban, CircleOff } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import useGetReports from "@/hooks/useGetReports"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

export default function RejectedPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isLoading, refetch, reports } = useGetReports("REJECTED")
  const [rejectionRate, setRejectionRate] = useState(18) // Example rejection rate

  const refreshRejectedData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      // Simulate slight rejection rate fluctuation
      setRejectionRate((prev) =>
        Math.min(100, prev + (Math.random() > 0.5 ? 1 : -1))
      )
      toast.success("Rejected reports refreshed!")
    } catch {
      toast.error("Error refreshing data")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      {/* Main Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-6 border-0 shadow-sm bg-gradient-to-br from-red-200/80 to-orange-200/80 dark:from-red-900/20 dark:to-orange-900/20">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-red-900 dark:text-red-100">
                    Rejected Reports
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-red-800 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800"
                  >
                    <Ban className="h-3.5 w-3.5 mr-1.5" />
                    Rejected
                  </Badge>
                </div>

                <CardDescription className="text-red-800/80 dark:text-red-200/80">
                  Review rejected cases and quality control metrics
                </CardDescription>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                      Rejection Rate
                    </span>
                    <span className="px-2 py-1 text-xs rounded bg-red-200/50 dark:bg-red-800/30">
                      {rejectionRate}% of total
                    </span>
                  </div>
                  <Progress
                    value={rejectionRate}
                    className="h-2 bg-red-200/50 dark:bg-red-900/30"
                    indicatorClassName="bg-gradient-to-r from-red-500 to-orange-500"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={refreshRejectedData}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="flex items-center gap-2 text-red-700 border-red-300 bg-white/80 hover:bg-red-50 hover:text-red-800 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
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

      {/* Rejected Reports Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="overflow-hidden border rounded-lg border-red-200/60 dark:border-red-800/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <div className="p-3 border-b bg-red-50/50 dark:bg-red-900/10 border-red-200/30 dark:border-red-800/20">
            <div className="flex items-center gap-2">
              <CircleOff className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">
                Rejected Reports ({reports?.length || 0})
              </span>
            </div>
          </div>
          <ReportsTable reports={reports} isLoading={isLoading} />
        </div>
      </motion.div>

      {/* Rejection Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3"
      >
        <Card className="bg-red-50/30 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100/70 dark:bg-red-900/20">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-red-900 dark:text-red-100">
                  Rejected Today
                </CardTitle>
                <CardDescription className="text-red-800/80 dark:text-red-200/80">
                  12 cases rejected
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-orange-50/30 dark:bg-orange-900/10 border-orange-200/50 dark:border-orange-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100/70 dark:bg-orange-900/20">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-orange-900 dark:text-orange-100">
                  Common Issues
                </CardTitle>
                <CardDescription className="text-orange-800/80 dark:text-orange-200/80">
                  Mostly incomplete data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-red-50/30 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100/70 dark:bg-red-900/20">
                <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-red-900 dark:text-red-100">
                  Auto-Rejection
                </CardTitle>
                <CardDescription className="text-red-800/80 dark:text-red-200/80">
                  38% were auto-rejected
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}
