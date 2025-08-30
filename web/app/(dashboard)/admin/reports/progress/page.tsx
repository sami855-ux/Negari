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
  TrendingUp,
  Activity,
  CircleDashed,
} from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import useGetReports from "@/hooks/useGetReports"
import { motion } from "framer-motion"

export default function ProgressPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isLoading, refetch, reports } = useGetReports("IN_PROGRESS")

  const refreshUserData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      // Simulate progress update
      toast.success("Progress updated successfully!")
    } catch {
      toast.error("Error while updating progress!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  return (
    <div className="container px-4 py-6 mx-auto">
      {/* Animated Progress Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 border border-orange-200 rounded-md"
      >
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-orange-900/20 dark:to-amber-900/20">
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
                    <CircleDashed className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    Progress Tracking
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800"
                  >
                    <Activity className="h-3.5 w-3.5 mr-1.5" />
                    Active
                  </Badge>
                </div>

                <CardDescription className="text-amber-800/80 dark:text-amber-200/80">
                  Monitoring and managing in progress reports
                </CardDescription>
              </div>

              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={refreshUserData}
                  variant="outline"
                  size="sm"
                  disabled={isRefreshing}
                  className="flex items-center gap-2 text-gray-700 border-amber-400 bg-white/80 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30"
                >
                  <RefreshCw
                    className={`h-4 w-4 transition-transform duration-500 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Updating..." : "Update Progress"}
                </Button>
              </motion.div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Progress Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="overflow-hidden border rounded-lg border-amber-200/60 dark:border-amber-800/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <div className="p-3 border-b bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/30 dark:border-amber-800/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                In Progress Reports ({reports?.length || 0})
              </span>
            </div>
          </div>
          <ReportsTable reports={reports} isLoading={isLoading} />
        </div>
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3"
      >
        <Card className="bg-amber-50/30 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100/70 dark:bg-amber-900/20">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  Average Time
                </CardTitle>
                <CardDescription className="text-amber-800/80 dark:text-amber-200/80">
                  2.5 days pending
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-orange-50/30 dark:bg-orange-900/10 border-orange-200/50 dark:border-orange-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100/70 dark:bg-orange-900/20">
                <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-orange-900 dark:text-orange-100">
                  Completion Rate
                </CardTitle>
                <CardDescription className="text-orange-800/80 dark:text-orange-200/80">
                  {45}% this week
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-amber-50/30 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100/70 dark:bg-amber-900/20">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-amber-900 dark:text-amber-100">
                  Trend
                </CardTitle>
                <CardDescription className="text-amber-800/80 dark:text-amber-200/80">
                  +12% from last week
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}
