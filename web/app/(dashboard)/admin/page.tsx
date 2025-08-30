"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Clock,
  Flag,
  Users,
  Shield,
  List,
  BarChart2,
  Activity,
  Settings,
  HardDriveUpload,
  Plus,
  UserCog,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { ReportsMap } from "@/components/admin/ReportMap"
import { CategoryPieChart } from "@/components/admin/CategoryPie"

export default function Dashboard() {
  const reportData = [
    { name: "Jan", reports: 400 },
    { name: "Feb", reports: 300 },
    { name: "Mar", reports: 600 },
    { name: "Apr", reports: 800 },
    { name: "May", reports: 500 },
    { name: "Jun", reports: 900 },
  ]

  const categoryData = [
    { name: "Road Damage", value: 400 },
    { name: "Water Issues", value: 300 },
    { name: "Electricity", value: 200 },
    { name: "Sanitation", value: 100 },
  ]

  return (
    <div className="w-full min-h-screen p-4 md:p-6 bg-gray-50">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900 md:text-2xl">
          <BarChart2 className="w-5 h-5 md:w-6 md:h-6" /> Overview
        </h1>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Verified Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 md:text-sm">
              Total Verified Reports
            </CardTitle>
            <CheckCircle2 className="w-5 h-5 text-green-500 md:w-6 md:h-6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-500 md:text-2xl">
              1,234
            </div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>

        {/* Pending Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 md:text-sm">
              Pending Reports
            </CardTitle>
            <Clock className="w-5 h-5 text-yellow-500 md:w-6 md:h-6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-yellow-500 md:text-2xl">
              567
            </div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>

        {/* Flagged Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 md:text-sm">
              Flagged Reports
            </CardTitle>
            <Flag className="w-5 h-5 text-red-500 md:w-6 md:h-6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-500 md:text-2xl">89</div>
            <p className="text-xs text-gray-500">+3% from last month</p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 md:text-sm">
              Total Users
            </CardTitle>
            <Users className="w-5 h-5 text-blue-500 md:w-6 md:h-6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold md:text-2xl">3,456</div>
            <p className="text-xs text-gray-500">+5.2% from last month</p>
          </CardContent>
        </Card>

        {/* Active Officials */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 md:text-sm">
              Active Officials
            </CardTitle>
            <Shield className="w-5 h-5 text-blue-500 md:w-6 md:h-6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold md:text-2xl">142</div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        {/* Issue Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 md:text-sm">
              Issue Categories
            </CardTitle>
            <List className="w-5 h-5 text-blue-500 md:w-6 md:h-6" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold md:text-2xl">12</div>
            <p className="text-xs text-gray-500">Active categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Distribution Map */}
      <div className="mb-6">
        <ReportsMap />
      </div>

      {/* Reports Over Time */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Activity className="w-4 h-4 md:w-5 md:h-5" /> Reports Submitted
            Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="reports"
                stroke="#3B82F6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <BarChart2 className="w-4 h-4 md:w-5 md:h-5" />
              Reports by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <CategoryPieChart />
      </div>

      {/* System Summary and Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Activity className="w-4 h-4 md:w-5 md:h-5" /> System Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm md:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="text-gray-500 w-36">Most Active Region:</div>
                <div className="font-medium">Addis Ababa</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="text-gray-500 w-36">Highest Category:</div>
                <div className="font-medium">Road Damage</div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="text-gray-500 w-36">System Health:</div>
                <div className="flex items-center text-green-500">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Good
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="text-gray-500 w-36">Backup Status:</div>
                <div className="font-medium">Last backup 1 hr ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Settings className="w-4 h-4 md:w-5 md:h-5" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2 text-sm md:text-base">
                <Plus className="w-4 h-4" /> Add Category
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <UserCog className="w-4 h-4" /> Manage Officials
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Settings className="w-4 h-4" /> Settings
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <HardDriveUpload className="w-4 h-4" /> Backup Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
