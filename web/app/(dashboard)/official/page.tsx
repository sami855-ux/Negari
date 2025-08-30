"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react"

export default function Page() {
  const assignedReports = [
    {
      id: "RPT-2024-001",
      title: "Traffic Violation - Main Street",
      priority: "High",
      status: "In Progress",
      location: "Main St & 5th Ave",
      time: "2 hours ago",
    },
    {
      id: "RPT-2024-002",
      title: "Noise Complaint - Residential",
      priority: "Medium",
      status: "Pending",
      location: "Oak Street 123",
      time: "4 hours ago",
    },
    {
      id: "RPT-2024-003",
      title: "Suspicious Activity",
      priority: "High",
      status: "Urgent",
      location: "Park Avenue",
      time: "30 minutes ago",
    },
  ]

  const stats = [
    {
      title: "Reports Resolved",
      value: "47",
      change: "+12%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Cases",
      value: "8",
      change: "-3",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Response Time",
      value: "12m",
      change: "-2m",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Citizen Feedback",
      value: "4.8",
      change: "+0.2",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-green-100 hover:bg-green-50 hover:border-green-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[15px] font-medium text-gray-700">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {stat.value}
              </div>
              <p className="text-sm font-grotesk text-green-600 font-medium">
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Reports */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <FileText className="h-5 w-5" />
              Assigned Reports
            </CardTitle>
            <CardDescription>Your current active assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignedReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg border border-green-100 hover:bg-blue-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800">
                      {report.title}
                    </h4>
                    <Badge
                      variant={
                        report.priority === "High"
                          ? "destructive"
                          : report.priority === "Medium"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        report.priority === "High"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : report.priority === "Medium"
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : ""
                      }
                    >
                      {report.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" color="green" />
                      {report.location}
                    </span>
                    <span className="text-orange-400 font-semibold font-jakarta">
                      {report.time}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-green-600 px-4 font-jakarta  text-white"
                >
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Interactive Map Preview */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <MapPin className="h-5 w-5" />
              Interactive Map
            </CardTitle>
            <CardDescription>
              Your patrol area and active incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center border border-blue-200">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto" />
                <p className="text-gray-700 font-medium">
                  Interactive Map View
                </p>
                <p className="text-sm text-gray-600">
                  3 active incidents in your area
                </p>
                <Button className="bg-gradient-to-r from-green-200 to-green-400 hover:from-green-300 hover:to-green-500 text-gray-800">
                  Open Full Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Statistics */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <TrendingUp className="h-5 w-5" />
              Personal Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Cases Resolved</span>
                <span className="font-medium text-gray-800">85%</span>
              </div>
              <Progress value={85} className="h-2 [&>div]:bg-green-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Response Time</span>
                <span className="font-medium text-gray-800">92%</span>
              </div>
              <Progress value={92} className="h-2 [&>div]:bg-green-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Citizen Satisfaction</span>
                <span className="font-medium text-gray-800">96%</span>
              </div>
              <Progress value={96} className="h-2 [&>div]:bg-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* High-Priority Queue */}
        <Card className="border-red-100 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              High-Priority Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-white rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Emergency Call</p>
                  <p className="text-sm text-gray-600">Downtown Plaza</p>
                </div>
                <Badge
                  variant="destructive"
                  className="bg-red-200 text-red-700"
                >
                  URGENT
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Traffic Accident</p>
                  <p className="text-sm text-gray-600">Highway 101</p>
                </div>
                <Badge
                  variant="destructive"
                  className="bg-red-200 text-red-700"
                >
                  HIGH
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages & Comments */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Dispatch</p>
                  <p className="text-sm text-gray-700">
                    New assignment available
                  </p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Citizen</p>
                  <p className="text-sm text-gray-700">
                    Thank you for your help!
                  </p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
