"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  Search,
  Calendar,
  Filter,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// Dynamic import for the map to avoid SSR issues
const MapView = dynamic(() => import("@/components/official/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <MapPin className="h-8 w-8 text-muted-foreground" />
    </div>
  ),
})

// Mock data for reports
const mockReports = [
  {
    id: 1,
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "urgent",
    category: "Infrastructure",
    location: [40.7128, -74.006],
    assignedTo: "John Smith",
    createdAt: "2024-01-15",
    priority: "high",
  },
  {
    id: 2,
    title: "Broken Street Light",
    description: "Street light not working on Oak Avenue",
    status: "pending",
    category: "Utilities",
    location: [40.7589, -73.9851],
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-14",
    priority: "medium",
  },
  {
    id: 3,
    title: "Graffiti Removal",
    description: "Graffiti on public building wall",
    status: "resolved",
    category: "Maintenance",
    location: [40.7505, -73.9934],
    assignedTo: "Mike Davis",
    createdAt: "2024-01-13",
    priority: "low",
  },
  {
    id: 4,
    title: "Noise Complaint",
    description: "Excessive noise from construction site",
    status: "pending",
    category: "Public Safety",
    location: [40.7282, -73.7949],
    assignedTo: "Lisa Wilson",
    createdAt: "2024-01-12",
    priority: "medium",
  },
]

export default function ReportDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    assignedTo: "all",
    dateRange: "all",
  })

  // Calculate statistics
  const stats = {
    total: mockReports.length,
    resolved: mockReports.filter((r) => r.status === "resolved").length,
    urgent: mockReports.filter((r) => r.status === "urgent").length,
    pending: mockReports.filter((r) => r.status === "pending").length,
  }

  const handleMarkerClick = (report: any) => {
    setSelectedReport(report)
    setIsInfoPanelOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500"
      case "urgent":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "urgent":
        return <AlertTriangle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <RotateCcw className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Search */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-2 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search address or report..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-[calc(100vh-280px)]">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full border border-gray-50 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" color="black" />
                  <span className="font-semibold text-gray-800">Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-2">
                {/* Date Range */}
                <div className="space-y-2 w-full">
                  <label className="text-sm font-medium flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Date Range</span>
                  </label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) =>
                      setFilters({ ...filters, dateRange: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="infrastructure">
                        Infrastructure
                      </SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="public-safety">
                        Public Safety
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Assigned Official */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Assigned Official</span>
                  </label>
                  <Select
                    value={filters.assignedTo}
                    onValueChange={(value) =>
                      setFilters({ ...filters, assignedTo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select official" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Officials</SelectItem>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">
                        Sarah Johnson
                      </SelectItem>
                      <SelectItem value="mike-davis">Mike Davis</SelectItem>
                      <SelectItem value="lisa-wilson">Lisa Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map View */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <MapView
                  reports={mockReports}
                  onMarkerClick={handleMarkerClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Slide-out Info Panel */}
      <Sheet open={isInfoPanelOpen} onOpenChange={setIsInfoPanelOpen}>
        <SheetContent className="w-[400px] sm:w-[640px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Report Details</span>
            </SheetTitle>
          </SheetHeader>

          {selectedReport && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedReport.title}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {selectedReport.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(selectedReport.status)}
                    <Badge
                      className={`${getStatusColor(
                        selectedReport.status
                      )} text-white`}
                    >
                      {selectedReport.status.charAt(0).toUpperCase() +
                        selectedReport.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Category
                  </label>
                  <p className="mt-1 font-medium">{selectedReport.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Assigned To
                  </label>
                  <p className="mt-1 font-medium">
                    {selectedReport.assignedTo}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created
                  </label>
                  <p className="mt-1 font-medium">{selectedReport.createdAt}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Priority
                </label>
                <Badge variant="outline" className="mt-1">
                  {selectedReport.priority.charAt(0).toUpperCase() +
                    selectedReport.priority.slice(1)}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button className="w-full">Update Status</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Assign to Me
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Add Comment
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
