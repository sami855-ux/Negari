"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle,
  Settings2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Frequency = "daily" | "weekly" | "monthly"

export function AutomaticBackupSettings() {
  const [frequency, setFrequency] = useState<Frequency>("weekly")
  const [time, setTime] = useState("03:00")
  const [isEnabled, setIsEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
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

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1500))
      showNotification("success", "Backup schedule updated successfully")
    } catch (error) {
      showNotification("error", "Failed to update backup settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-gray-800/50 relative overflow-hidden">
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
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2 pb-1">
              Automatic Backups
            </CardTitle>
            <CardDescription>
              Configure when and how often automatic backups should occur
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="frequency"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Calendar className="h-4 w-4" />
              Backup Frequency
            </Label>
            <Select
              value={frequency}
              onValueChange={(value: Frequency) => setFrequency(value)}
            >
              <SelectTrigger id="frequency" className="[&>span]:line-clamp-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  Weekly
                </SelectItem>
                <SelectItem value="monthly" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                  Monthly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="time"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Clock className="h-4 w-4" />
              Backup Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Label htmlFor="enable-toggle" className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Automatic Backups
          </Label>
          <Switch
            id="enable-toggle"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Settings2 className="mr-2 h-4 w-4" />
            )}
            Save Settings
          </Button>
        </div>

        <div className="rounded-lg border px-3 py-2 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            Next backup scheduled for {new Date().toLocaleDateString()} at{" "}
            {time}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
