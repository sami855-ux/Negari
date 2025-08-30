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
  Clock,
  AlertCircle,
  CircleDashed,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import useGetReports from "@/hooks/useGetReports"
import { motion } from "framer-motion"

export default function PendingReportsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isLoading, refetch, reports } = useGetReports("PENDING")
  const [avgPendingTime] = useState("1.8 days") // Example pending time

  const refreshPendingData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      toast.success("Pending reports refreshed successfully!")
    } catch {
      toast.error("Error while refreshing pending reports!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      {/* Pending Reports Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="mb-6 border-0 shadow-sm bg-gradient-to-br from-[#BFDBFE] to-blue-100/80 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <CircleDashed className="w-8 h-8 text-[#60A5FA] dark:text-blue-400" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    Pending Reports
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-blue-800 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800"
                  >
                    <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                    Under Review
                  </Badge>
                </div>

                <CardDescription className="text-blue-800/80 dark:text-blue-200/80">
                  Reports awaiting verification and processing
                </CardDescription>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  onClick={refreshPendingData}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="flex items-center gap-2 text-blue-700 border-blue-300 bg-white/80 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-slate-800/80 dark:text-blue-300 dark:hover:bg-blue-900/30"
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

      {/* Pending Reports Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="overflow-hidden border rounded-lg border-blue-200/60 dark:border-blue-800/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <div className="p-3 bg-[#BFDBFE]/50 dark:bg-blue-900/10 border-b border-blue-200/30 dark:border-blue-800/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-[#60A5FA] dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Pending Reports ({reports?.length || 0})
              </span>
            </div>
          </div>
          <ReportsTable reports={reports} isLoading={isLoading} />
        </div>
      </motion.div>

      {/* Pending Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3"
      >
        <Card className="bg-blue-50/30 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100/70 dark:bg-blue-900/20">
                <Clock className="h-5 w-5 text-[#60A5FA] dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Avg. Pending Time
                </CardTitle>
                <CardDescription className="text-blue-800/80 dark:text-blue-200/80">
                  {avgPendingTime}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-[#BFDBFE]/30 dark:bg-blue-800/10 border-blue-200/50 dark:border-blue-700/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100/70 dark:bg-blue-800/20">
                <AlertCircle className="h-5 w-5 text-[#60A5FA] dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Attention Needed
                </CardTitle>
                <CardDescription className="text-blue-800/80 dark:text-blue-200/80">
                  8 require immediate review
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-blue-50/30 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100/70 dark:bg-blue-900/20">
                <TrendingUp className="h-5 w-5 text-[#60A5FA] dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  Weekly Trend
                </CardTitle>
                <CardDescription className="text-blue-800/80 dark:text-blue-200/80">
                  +15% from last week
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}
