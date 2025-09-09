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
import { useRouter } from "next/navigation"
import { getTimeElapsed } from "@/lib/utils"
import useOfficialData from "@/hooks/useOfficialData"
import { Skeleton } from "@/components/ui/skeleton"
import InteractiveMapCard from "@/components/official/InteractiveMap"

export default function Page() {
  const router = useRouter()

  const { data, isLoading } = useOfficialData()

  const stats = [
    {
      title: "Reports Resolved",
      value: data?.totalAssigned || 0,
      change: "+12%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "In Progress Reports",
      value: data?.inProgressCount || 0,
      change: "-3",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Resolved Reports ",
      value: data?.resolvedCount || 0,
      change: "-2m",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Citizen Feedback",
      value: data?.avgRating || 0,
      change: "+0.2",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="p-2 space-y-6 sm:p-2">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 min-h-fit">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="p-4 space-y-3">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-12 h-12 rounded-md" />
                <Skeleton className="w-32 h-6" />
                <Skeleton className="w-20 h-3" />
              </Card>
            ))
          : stats.map((stat) => (
              <Card
                key={stat.title}
                className="transition-colors border-green-100 hover:bg-green-50 hover:border-green-200"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-700 sm:text-base">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900 sm:text-3xl">
                    {stat.value}
                  </div>
                  <p className="text-xs font-medium text-green-600 sm:text-sm">
                    {stat.change} from last week
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Reports + Map */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assigned Reports */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-700 sm:text-lg">
              <FileText className="w-5 h-5" />
              Assigned Reports
            </CardTitle>
            <CardDescription className="text-sm">
              Your current active assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading
              ? // 🔹 Skeleton placeholder while loading
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-3 p-4 border border-green-100 rounded-lg sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-32 h-4 rounded" />
                        <Skeleton className="w-16 h-5 rounded" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-40 h-3 rounded" />
                        <Skeleton className="w-20 h-3 rounded" />
                      </div>
                    </div>
                    <Skeleton className="w-20 h-8 rounded" />
                  </div>
                ))
              : // 🔹 Real content when data is ready
                data?.recentReports?.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col gap-3 p-4 transition-colors border border-green-100 rounded-lg sm:flex-row sm:items-center sm:justify-between hover:bg-blue-50"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-gray-800">
                          {report.title}
                        </h4>
                        <Badge
                          variant={
                            report.severity === "CRITICAL"
                              ? "destructive"
                              : report.severity === "HIGH"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            report.severity === "CRITICAL"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : report.severity === "HIGH"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : ""
                          }
                        >
                          {report.severity}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 sm:text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-green-600" />
                          {report.location.address} {report.location.city},{" "}
                        </span>
                        <span className="font-semibold text-orange-500">
                          {getTimeElapsed(report.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="px-4 text-white bg-gradient-to-r from-green-500 to-green-600"
                    >
                      View
                    </Button>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Interactive Map Preview */}
        <InteractiveMapCard />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Statistics */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-700 sm:text-lg">
              <TrendingUp className="w-5 h-5" />
              Personal Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Cases Resolved", value: 85 },
              { label: "Response Time", value: 92 },
              { label: "Citizen Satisfaction", value: 96 },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-700">{stat.label}</span>
                  <span className="font-medium text-gray-800">
                    {stat.value}%
                  </span>
                </div>
                <Progress
                  value={stat.value}
                  className="h-2 [&>div]:bg-green-400"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* High-Priority Queue */}
        <Card className="border-red-100 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-700 sm:text-lg">
              <AlertTriangle className="w-5 h-5" />
              High-Priority Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: "Emergency Call",
                location: "Downtown Plaza",
                level: "URGENT",
              },
              {
                title: "Traffic Accident",
                location: "Highway 101",
                level: "HIGH",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-3 bg-white border border-red-200 rounded-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      {item.location}
                    </p>
                  </div>
                  <Badge className="text-red-700 bg-red-200">
                    {item.level}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-green-900 sm:text-lg">
              <MessageSquare className="w-5 h-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                sender: "Dispatch",
                text: "New assignment available",
                time: "5 minutes ago",
                color: "bg-blue-50",
                iconBg: "bg-blue-200",
                iconColor: "text-blue-600",
              },
              {
                sender: "Citizen",
                text: "Thank you for your help!",
                time: "1 hour ago",
                color: "bg-green-50",
                iconBg: "bg-green-200",
                iconColor: "text-gray-600",
              },
            ].map((msg) => (
              <div key={msg.sender} className={`p-3 rounded-lg ${msg.color}`}>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 ${msg.iconBg} rounded-full flex items-center justify-center`}
                  >
                    <Users className={`h-4 w-4 ${msg.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {msg.sender}
                    </p>
                    <p className="text-xs text-gray-700 sm:text-sm">
                      {msg.text}
                    </p>
                    <p className="text-xs text-gray-500">{msg.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
