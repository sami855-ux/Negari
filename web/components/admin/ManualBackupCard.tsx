"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Database,
  Clock,
  HardDriveDownload,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function ManualBackupCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [lastBackupTimestamp, setLastBackupTimestamp] = useState<string | null>(
    new Date().toLocaleString()
  )
  const [backupSize, setBackupSize] = useState("2.4 GB")
  const [notification, setNotification] = useState<{
    show: boolean
    type: "success" | "error" | null
    message: string
  }>({ show: false, type: null, message: "" })

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: null, message: "" })
    }, 3000)
  }

  const handleBackupNow = async () => {
    setIsLoading(true)
    setProgress(0)

    try {
      // Simulate backup progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 300)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const newTimestamp = new Date().toLocaleString()
      setLastBackupTimestamp(newTimestamp)
      setBackupSize((Math.random() * 5 + 1).toFixed(1) + " GB")

      showNotification("success", `Backup completed at ${newTimestamp}`)
    } catch (error) {
      showNotification("error", "Failed to create backup")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50 relative overflow-hidden">
      {/* Notification */}
      {notification.show && (
        <div
          className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-md shadow-md z-10 animate-fade-in ${
            notification.type === "success"
              ? "bg-green-100 dark:bg-green-900/80 text-green-700 dark:text-green-200"
              : "bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 pb-1">
              Manual Backup
            </CardTitle>
            <CardDescription>
              Trigger a full backup of your data immediately
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        <div className="space-y-2 mb-12">
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Last backup:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {lastBackupTimestamp || "Never"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <HardDriveDownload className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Estimated size:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {backupSize}
              </span>
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-2">
            <Progress
              value={progress}
              className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-purple-500"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Creating backup... {progress}%
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleBackupNow}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Database className="mr-2 h-4 w-4" />
            )}
            Backup Now
          </Button>

          <Button variant="outline" disabled={isLoading}>
            <AlertCircle className="mr-2 h-4 w-4" />
            Backup Info
          </Button>
        </div>

        <div className="rounded-lg border px-3 py-2 bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
          <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            Backups are stored for 30 days. Critical data is encrypted during
            transfer.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
