"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, CircleCheck, CircleX } from "lucide-react"
import { useState, useEffect } from "react"

// Mock data for system health and logs
const mockSystemHealth = () => ({
  cpu: (Math.random() * (80 - 20) + 20).toFixed(1), // 20-80%
  memory: (Math.random() * (70 - 30) + 30).toFixed(1), // 30-70%
  disk: (Math.random() * (90 - 40) + 40).toFixed(1), // 40-90%
})

const mockSystemErrors = [
  {
    id: 1,
    timestamp: "2025-07-24 10:00:00",
    message: "Database connection failed",
    level: "Error",
  },
  {
    id: 2,
    timestamp: "2025-07-24 09:45:15",
    message: "API endpoint /users returned 500",
    level: "Error",
  },
  {
    id: 3,
    timestamp: "2025-07-24 09:30:05",
    message: "Disk space low on server-01",
    level: "Warning",
  },
  {
    id: 4,
    timestamp: "2025-07-24 09:15:20",
    message: "Authentication service timeout",
    level: "Error",
  },
]

export function SystemLogs() {
  const [systemHealth, setSystemHealth] = useState(mockSystemHealth())
  const [apiUptimeStatus, setApiUptimeStatus] = useState<"online" | "offline">(
    Math.random() > 0.1 ? "online" : "offline"
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(mockSystemHealth())
      setApiUptimeStatus(Math.random() > 0.1 ? "online" : "offline") // Simulate occasional downtime
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleLogExport = () => {
    const logs = JSON.stringify(mockSystemErrors, null, 2)
    const blob = new Blob([logs], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system_logs_${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert("System logs exported!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs & Monitoring</CardTitle>
        <CardDescription>
          Monitor the health and activity of your platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Server Health */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Server Health</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="p-4 bg-white border rounded-md">
              {" "}
              {/* Changed bg-gray-50 to bg-white */}
              <p className="text-sm text-gray-600">CPU Usage</p>
              <p className="text-xl font-bold">{systemHealth.cpu}%</p>
            </div>
            <div className="p-4 bg-white border rounded-md">
              {" "}
              {/* Changed bg-gray-50 to bg-white */}
              <p className="text-sm text-gray-600">Memory Usage</p>
              <p className="text-xl font-bold">{systemHealth.memory}%</p>
            </div>
            <div className="p-4 bg-white border rounded-md">
              {" "}
              {/* Changed bg-gray-50 to bg-white */}
              <p className="text-sm text-gray-600">Disk Usage</p>
              <p className="text-xl font-bold">{systemHealth.disk}%</p>
            </div>
          </div>
        </div>

        {/* API Uptime Status */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">API Uptime Status</h3>
          <div className="flex items-center gap-2 p-4 bg-white border rounded-md">
            {" "}
            {/* Changed bg-gray-50 to bg-white */}
            {apiUptimeStatus === "online" ? (
              <CircleCheck className="w-5 h-5 text-green-500" />
            ) : (
              <CircleX className="w-5 h-5 text-red-500" />
            )}
            <span
              className={`font-medium ${
                apiUptimeStatus === "online" ? "text-green-700" : "text-red-700"
              }`}
            >
              API Status:{" "}
              {apiUptimeStatus.charAt(0).toUpperCase() +
                apiUptimeStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Recent System Errors */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recent System Errors</h3>
          <div className="overflow-hidden border rounded-md">
            {mockSystemErrors.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {mockSystemErrors.map((error) => (
                  <li key={error.id} className="p-4 text-sm">
                    <span className="mr-2 font-mono text-gray-500">
                      [{error.timestamp}]
                    </span>
                    <span
                      className={`font-semibold ${
                        error.level === "Error"
                          ? "text-red-600"
                          : "text-orange-500"
                      }`}
                    >
                      {error.level}:
                    </span>{" "}
                    {error.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-gray-500">No recent errors.</p>
            )}
          </div>
        </div>

        {/* Log Export */}
        <div className="flex justify-end">
          <Button onClick={handleLogExport} variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
