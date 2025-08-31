"use client"

import { useState, useMemo, useCallback } from "react"
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
  AlertCircle,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
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
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { getRegionByOfficer } from "@/services/region"

// Report status type
type ReportStatus =
  | "PENDING"
  | "NEEDS_MORE_INFO"
  | "VERIFIED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"

// Severity level type
type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

// Dynamic import for the map to avoid SSR issues
const MapView = dynamic(() => import("@/components/official/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
      <MapPin className="h-8 w-8 text-muted-foreground" />
    </div>
  ),
})

// Types for our reports
interface Report {
  id: string
  title: string
  description: string
  status: ReportStatus
  category: string
  location: [number, number]
  assignedTo: string
  createdAt: string
  priority: SeverityLevel
  severity: SeverityLevel
  spamScore?: number
  confidenceScore?: number
  isPublic?: boolean
  toxicityScore?: number
  resolutionNote?: string
  resolvedAt?: string
  updatedAt?: string
  isAnonymous?: boolean
  tags?: string[]
  imageUrls?: string[]
  videoUrl?: string
}

export default function ReportDashboard() {
  const { user } = useSelector((store: RootState) => store.user)
  const { data: region, isLoading } = useQuery({
    queryKey: ["Region", user?.user?.id],
    queryFn: () => getRegionByOfficer(user?.user?.id),
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    assignedTo: "all",
    dateRange: "all",
    severity: "all",
  })
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  // Get reports from region data or empty array
  const reports: Report[] = region?.data?.reports || []

  // Derived value: officer is assigned if region data exists
  const isAssigned = !!region?.data

  // Calculate statistics
  const stats = {
    total: reports.length,
    resolved: reports.filter((r) => r.status === "RESOLVED").length,
    urgent: reports.filter((r) => r.status === "RESOLVED").length,
    pending: reports.filter(
      (r) => r.status === "PENDING" || r.status === "IN_PROGRESS"
    ).length,
  }

  // Filter and search logic
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )

      // Category filter
      const matchesCategory =
        filters.category === "all" ||
        report.category.toLowerCase() === filters.category.toLowerCase()

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        report.status.toLowerCase() === filters.status.toLowerCase()

      // Assigned to filter
      const matchesAssigned =
        filters.assignedTo === "all" ||
        report.assignedTo
          .toLowerCase()
          .includes(filters.assignedTo.toLowerCase())

      // Severity filter
      const matchesSeverity =
        filters.severity === "all" ||
        report.severity.toLowerCase() === filters.severity.toLowerCase()

      // Date range filter (simplified)
      const matchesDateRange = filters.dateRange === "all" // In a real app, you'd implement date logic

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesAssigned &&
        matchesSeverity &&
        matchesDateRange
      )
    })
  }, [searchQuery, filters, reports])

  const handleMarkerClick = useCallback((report: Report) => {
    setSelectedReport(report)
    setIsInfoPanelOpen(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-500"
      case "URGENT":
      case "CRITICAL":
        return "bg-red-500"
      case "PENDING":
        return "bg-yellow-500"
      case "IN_PROGRESS":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />
      case "URGENT":
      case "CRITICAL":
        return <AlertTriangle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "IN_PROGRESS":
        return <RotateCcw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "LOW":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const resetFilters = () => {
    setFilters({
      category: "all",
      status: "all",
      assignedTo: "all",
      dateRange: "all",
      severity: "all",
    })
    setSearchQuery("")
  }

  // Extract unique values for filter options from actual reports
  const categories = [...new Set(reports.map((report) => report.category))]
  const assignedOfficials = [
    ...new Set(reports.map((report) => report.assignedTo)),
  ]
  const statuses = [...new Set(reports.map((report) => report.status))]
  const severityLevels = [...new Set(reports.map((report) => report.severity))]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-9 w-9 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Overlay for unassigned region */}
      {!isAssigned && (
        <div className="fixed inset-0 w-full h-screen z-50 flex items-center justify-center p-4 pointer-events-none">
          <style jsx>{`
            .leaflet-container,
            .leaflet-map-pane,
            .leaflet-overlay-pane,
            .leaflet-marker-pane,
            .leaflet-popup-pane,
            .leaflet-shadow-pane,
            .leaflet-tile-pane {
              z-index: 10 !important;
            }
          `}</style>

          {/* Overlay that covers only the map area */}
          <div className="absolute left-0 top-0 right-0 bottom-0 bg-background/25 backdrop-blur-md pointer-events-auto flex items-center justify-center">
            <div className="bg-gradient-to-br from-card to-card/80 border-2 border-gray-200 rounded-2xl p-4 ml-32 max-w-md w-full backdrop-blur-sm">
              {/* Icon and Title */}
              <div className="text-center mb-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Awaiting Region Assignment
                </h2>
              </div>

              {/* Message */}
              <p className="text-muted-foreground text-center text-base leading-relaxed mb-6 font-jakarta">
                Your account is currently being processed for region assignment.
                You'll gain full access to the dashboard once an administrator
                completes this setup.
              </p>

              {/* Status Indicator */}
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-600">
                  Status: Pending Assignment
                </span>
              </div>

              {/* Contact Info */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Need immediate assistance?{" "}
                  <button
                    className="text-primary hover:text-primary/80 font-medium underline underline-offset-2 transition-colors"
                    onClick={() => {
                      /* Contact logic */
                    }}
                  >
                    Contact support
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Search and Stats */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-2 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                {isFiltersExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                Filters
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card className="bg-background">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.resolved}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.urgent}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Expandable Filters */}
      {isFiltersExpanded && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-2 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned Official */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Assigned To</span>
                </label>
                <Select
                  value={filters.assignedTo}
                  onValueChange={(value) =>
                    setFilters({ ...filters, assignedTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Officials" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Officials</SelectItem>
                    {assignedOfficials.map((official) => (
                      <SelectItem key={official} value={official.toLowerCase()}>
                        {official}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select
                  value={filters.severity}
                  onValueChange={(value) =>
                    setFilters({ ...filters, severity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    {severityLevels.map((severity) => (
                      <SelectItem key={severity} value={severity.toLowerCase()}>
                        {severity.charAt(0) + severity.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
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
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="container mx-auto px-2 py-3">
        <p className="text-sm text-muted-foreground">
          Showing {filteredReports.length} of {reports.length} reports
          {searchQuery && (
            <>
              {" "}
              for "<span className="font-medium">{searchQuery}</span>"
            </>
          )}
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)]">
          {/* Reports List */}
          <div className="lg:col-span-1 overflow-auto">
            <Card className="h-full border border-gray-100 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Reports List
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredReports.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No reports found matching your criteria
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredReports.map((report) => (
                      <Card
                        key={report.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedReport?.id === report.id
                            ? "border-primary bg-primary/5"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedReport(report)
                          setIsInfoPanelOpen(true)
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm line-clamp-1">
                              {report.title}
                            </h3>
                            <Badge
                              className={`${getStatusColor(
                                report.status
                              )} text-white text-xs`}
                            >
                              {report.status.charAt(0) +
                                report.status.slice(1).toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {report.description}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-medium">
                              {report.assignedTo}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Map View */}
          <div className="lg:col-span-3">
            <Card className="h-full border border-gray-100 shadow-sm">
              <CardContent className="p-0 h-full">
                <MapView
                  reports={filteredReports}
                  onMarkerClick={handleMarkerClick}
                  polygon={region?.data?.polygon?.coordinates}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Slide-out Info Panel */}
      <Sheet open={isInfoPanelOpen} onOpenChange={setIsInfoPanelOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex justify-between items-center">
              <SheetTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Report Details</span>
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsInfoPanelOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {selectedReport && (
            <div className="space-y-6 py-2">
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedReport.title}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {selectedReport.description}
                </p>
              </div>

              <Separator />

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
                      {selectedReport.status.charAt(0) +
                        selectedReport.status.slice(1).toLowerCase()}
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
                  <p className="mt-1 font-medium">
                    {new Date(selectedReport.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Priority
                  </label>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${getSeverityColor(
                      selectedReport.priority
                    )}`}
                  >
                    {selectedReport.priority.charAt(0) +
                      selectedReport.priority.slice(1).toLowerCase()}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Severity
                  </label>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${getSeverityColor(
                      selectedReport.severity
                    )}`}
                  >
                    {selectedReport.severity.charAt(0) +
                      selectedReport.severity.slice(1).toLowerCase()}
                  </Badge>
                </div>
              </div>

              {selectedReport.tags && selectedReport.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedReport.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedReport.resolutionNote && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Resolution Notes
                  </label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{selectedReport.resolutionNote}</p>
                    {selectedReport.resolvedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Resolved on:{" "}
                        {new Date(
                          selectedReport.resolvedAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <Button className="w-full">Update Status</Button>
                <Button variant="outline" className="w-full">
                  Assign to Me
                </Button>
                <Button variant="outline" className="w-full">
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
