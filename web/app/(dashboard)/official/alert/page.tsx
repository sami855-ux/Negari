"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  Eye,
  Search,
  AlertTriangle,
  MapPin,
  Clock,
  User,
  Phone,
  Zap,
  Flame,
  Siren,
  Shield,
  Activity,
  Bell,
  Users,
  Navigation,
  Send,
  CheckCircle2,
  PlayCircle,
  MoreHorizontal,
  RefreshCw,
  AlarmClock,
  Image as ImageIcon,
  Book,
  Loader2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { getCriticalReports } from "@/services/report"

// Urgent Alert type matching the API response
type UrgentAlert = {
  id: string
  title: string
  description: string
  imageUrls?: string[]
  videoUrl?: string | null
  status:
    | "PENDING"
    | "NEEDS_MORE_INFO"
    | "VERIFIED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "REJECTED"
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  spamScore: number
  confidenceScore: number
  isPublic: boolean
  toxicityScore: number
  resolutionNote: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
  isAnonymous: boolean
  tags?: string[]
  locationId: string
  reporterId: string
  assignedToId: string
  assignedToWorkerId: string
  rejectionReason: string | null
  rejectedAt: string | null
  categoryId: string
  regionId: string | null
  userId: string | null
  location: {
    id: string
    latitude: number
    longitude: number
    address: string
    city: string
    region: string
  }
  reporter: {
    id: string
    username: string
    email: string
    profilePicture: string | null
  }
  assignedTo: {
    id: string
    username: string
    email: string
  }
  AssignedReports_worker: {
    id: string
    username: string
    email: string
  }
  category: {
    id: string
    name: string
    description: string
  }
  priority: number // Added field for priority calculation
}

const severityColors = {
  CRITICAL: "bg-red-600 text-white border-red-700 animate-pulse",
  HIGH: "bg-orange-600 text-white border-orange-700",
  MEDIUM: "bg-yellow-600 text-white border-yellow-700",
  LOW: "bg-blue-600 text-white border-blue-700",
}

const statusColors = {
  PENDING:
    "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300",
  NEEDS_MORE_INFO:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300",
  VERIFIED:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300",
  IN_PROGRESS:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300",
  RESOLVED:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300",
  REJECTED:
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300",
}

const categoryIcons = {
  CRIME: Shield,
  Vandalism: Book,
  Fire: Flame,
  Medical: Activity,
  Security: Shield,
  Infrastructure: AlertTriangle,
  "Natural Disaster": Zap,
  "Public Safety": Siren,
}

const statusIcons = {
  PENDING: Bell,
  NEEDS_MORE_INFO: AlertTriangle,
  VERIFIED: CheckCircle2,
  IN_PROGRESS: PlayCircle,
  RESOLVED: CheckCircle2,
  REJECTED: AlertTriangle,
}

export default function UrgentAlerts() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [alerts, setAlerts] = React.useState<UrgentAlert[]>([])
  const [selectedAlert, setSelectedAlert] = React.useState<UrgentAlert | null>(
    null
  )
  const [activeTab, setActiveTab] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(false)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await getCriticalReports(
          "31cb47d9-9184-43e3-8a72-8a721c5560fe"
        )

        // Map the API response to our table format
        const mappedAlerts = res.map((alert: any) => ({
          ...alert,
          // Calculate priority based on severity
          priority:
            alert.severity === "CRITICAL"
              ? 1
              : alert.severity === "HIGH"
              ? 2
              : 3,
          // Add contact number if available
          contactNumber: alert.reporter?.phone || "+251-XXX-XXXXXX",
          // Add assigned team
          assignedTeam: alert.assignedTo?.username || "Unassigned",
          // Add estimated response time (mock for now)
          estimatedResponse: "2 hours",
          // Add affected people (mock for now)
          affectedPeople: 0,
        }))

        setAlerts(mappedAlerts)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const columns: ColumnDef<UrgentAlert>[] = [
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return <AlarmClock className="w-4 h-4 ml-2" size={25} />
      },
      cell: ({ row }) => {
        const priority = row.getValue("priority") as number
        return (
          <div className="flex justify-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                priority === 1
                  ? "bg-red-500 animate-pulse"
                  : priority === 2
                  ? "bg-orange-500"
                  : "bg-yellow-500"
              }`}
            >
              {priority}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 text-gray-900 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Emergency Alert
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const CategoryIcon =
          categoryIcons[
            row.original.category?.name as keyof typeof categoryIcons
          ] || AlertTriangle
        return (
          <div className="max-w-[250px]">
            <div className="flex items-center gap-2 font-medium text-red-900 dark:text-red-100">
              <CategoryIcon className="w-4 h-4 text-red-600" />
              <span className="text-gray-900 truncate">
                {row.getValue("title")}
              </span>
            </div>
            <div className="mt-1 text-xs text-red-600 truncate dark:text-red-400">
              {row.original.description.substring(0, 60)}...
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 text-gray-900 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Location
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-500" />
          <span className="text-sm">{row.original.location?.address}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 text-gray-900 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Reported
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-red-500" />
          <span className="text-sm font-medium text-red-700 dark:text-red-300">
            {formatTimeAgo(row.getValue("createdAt"))}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "severity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 text-gray-900 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Severity
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const severity = row.getValue("severity") as keyof typeof severityColors
        return (
          <Badge className={severityColors[severity]}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {severity}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 text-gray-900 hover:bg-red-50 dark:hover:bg-red-950"
          >
            Status
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        const StatusIcon = statusIcons[status] || Bell
        return (
          <Badge variant="outline" className={statusColors[status]}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {status.replace("_", " ")}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Emergency Actions",
      cell: ({ row }) => {
        const alert = row.original

        const handleDispatch = () => {
          setAlerts((prev) =>
            prev.map((a) =>
              a.id === alert.id ? { ...a, status: "IN_PROGRESS" } : a
            )
          )
        }

        const handleResolve = () => {
          setAlerts((prev) =>
            prev.map((a) =>
              a.id === alert.id ? { ...a, status: "RESOLVED" } : a
            )
          )
        }

        // const handleEscalate = () => {
        //   setAlerts((prev) =>
        //     prev.map((a) => (a.id === alert.id ? { ...a, priority: 1 } : a))
        //   )
        // }

        return (
          <div className="flex items-center gap-1">
            {/* View Details Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <Eye className="w-4 h-4 text-red-600" />
                  <span className="sr-only">View Details</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
                <DialogHeader className="pb-4 border-b border-red-200 dark:border-red-800">
                  <DialogTitle className="flex items-center gap-2 text-xl text-red-900 dark:text-red-100">
                    <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
                    {alert.title}
                    <Badge
                      className={severityColors[alert.severity]}
                      variant="outline"
                    >
                      {alert.severity}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-red-700 dark:text-red-300">
                    Alert ID: {alert.id} • Reported{" "}
                    {formatTimeAgo(alert.createdAt)} • Priority {alert.priority}
                  </DialogDescription>
                </DialogHeader>

                <div className="pt-4 space-y-6">
                  {/* Critical Info Banner */}
                  <div className="p-4 text-white bg-red-600 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Siren className="w-5 h-5 animate-pulse" />
                      <h3 className="font-bold">EMERGENCY SITUATION</h3>
                    </div>
                    <p className="text-sm">{alert.description}</p>
                  </div>

                  {/* Media Gallery */}
                  {(alert.imageUrls || alert.videoUrl) && (
                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm text-red-900 dark:text-red-100">
                          <ImageIcon className="w-4 h-4" />
                          Incident Media
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {alert.imageUrls?.map((url, index) => (
                            <div
                              key={index}
                              className="overflow-hidden rounded-lg"
                            >
                              <Image
                                src={url}
                                alt={`Incident image ${index + 1}`}
                                width={300}
                                height={200}
                                className="object-cover w-full h-40"
                              />
                            </div>
                          ))}
                          {alert.videoUrl && (
                            <div className="overflow-hidden rounded-lg">
                              <video
                                controls
                                className="w-full h-40"
                                poster={alert.imageUrls?.[0]}
                              >
                                <source src={alert.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Response Status */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-red-900 dark:text-red-100">
                          Response Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-700 dark:text-red-300">
                            Current Status:
                          </span>
                          <Badge
                            variant="outline"
                            className={statusColors[alert.status]}
                          >
                            {React.createElement(statusIcons[alert.status], {
                              className: "h-3 w-3 mr-1",
                            })}
                            {alert.status.replace("_", " ")}
                          </Badge>
                        </div>
                        {alert.assignedTo && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-700 dark:text-red-300">
                              Assigned Team:
                            </span>
                            <span className="text-sm font-medium">
                              {alert.assignedTo.username}
                            </span>
                          </div>
                        )}
                        {/* {alert.estimatedResponse && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-700 dark:text-red-300">
                              ETA:
                            </span>
                            <span className="text-sm font-medium text-red-600">
                              {alert.estimatedResponse}
                            </span>
                          </div>
                        )} */}
                        <div className="pt-2">
                          <div className="flex justify-between mb-1 text-xs text-red-600 dark:text-red-400">
                            <span>Response Progress</span>
                            <span>
                              {alert.status === "RESOLVED" ||
                              alert.status === "VERIFIED"
                                ? "100%"
                                : alert.status === "IN_PROGRESS"
                                ? "60%"
                                : "20%"}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              alert.status === "RESOLVED" ||
                              alert.status === "VERIFIED"
                                ? 100
                                : alert.status === "IN_PROGRESS"
                                ? 60
                                : 20
                            }
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-red-900 dark:text-red-100">
                          Location & Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-xs font-medium tracking-wide text-red-600 uppercase dark:text-red-400">
                            Location
                          </label>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-sm">
                              {alert.location?.address}
                            </span>
                          </div>
                          {alert.location && (
                            <div className="mt-1 font-mono text-xs text-red-500 dark:text-red-400">
                              {alert.location.latitude.toFixed(5)}°N,{" "}
                              {alert.location.longitude.toFixed(5)}°E
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-medium tracking-wide text-red-600 uppercase dark:text-red-400">
                            Reported By
                          </label>
                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-4 h-4 text-red-500" />
                            <span className="text-sm">
                              {alert.reporter?.username || "Anonymous"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Impact Assessment */}
                  <Card className="border-red-200 dark:border-red-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-red-900 dark:text-red-100">
                        Impact Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xs text-red-500 dark:text-red-400">
                            People Affected
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {alert.priority}
                          </div>
                          <div className="text-xs text-orange-500 dark:text-orange-400">
                            Priority Level
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {React.createElement(
                              categoryIcons[
                                alert.category
                                  ?.name as keyof typeof categoryIcons
                              ] || AlertTriangle,
                              {
                                className: "h-8 w-8 mx-auto",
                              }
                            )}
                          </div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-400">
                            {alert.category?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  {alert.tags && alert.tags.length > 0 && (
                    <Card className="border-red-200 dark:border-red-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-red-900 dark:text-red-100">
                          Tags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {alert.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-red-700 bg-red-50 dark:bg-red-900 dark:text-red-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Emergency Actions */}
                  <div className="pt-4 border-t border-red-200 dark:border-red-800">
                    <h4 className="flex items-center gap-2 mb-3 font-semibold text-red-900 dark:text-red-100">
                      <Siren className="w-4 h-4" />
                      Emergency Actions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {alert.status === "VERIFIED" && (
                        <Button
                          onClick={handleDispatch}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Dispatch Response Team
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="text-red-700 bg-transparent border-red-300 hover:bg-red-50"
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        View on Map
                      </Button>

                      <Button
                        variant="outline"
                        className="text-red-700 bg-transparent border-red-300 hover:bg-red-50"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Contact Reporter
                      </Button>

                      {alert.status !== "RESOLVED" && (
                        <Button
                          onClick={handleResolve}
                          variant="outline"
                          className="text-green-700 bg-transparent border-green-300 hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Quick Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <MoreHorizontal className="w-4 h-4 text-red-600" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                {alert.status === "VERIFIED" && (
                  <DropdownMenuItem onClick={handleDispatch}>
                    <Send className="w-4 h-4 mr-2" />
                    Dispatch Team
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Navigation className="w-4 h-4 mr-2" />
                  View on Map
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Reporter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {alert.status !== "RESOLVED" && (
                  <DropdownMenuItem
                    onClick={handleResolve}
                    className="text-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Resolved
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return alerts
    if (activeTab === "critical")
      return alerts.filter((alert) => alert.severity === "CRITICAL")
    if (activeTab === "vandalism")
      return alerts.filter(
        (alert) =>
          alert.category?.name === "CRIME" || alert.tags?.includes("vandalism")
      )
    return alerts.filter(
      (alert) =>
        alert.category?.name.toLowerCase().replace(" ", "-") === activeTab
    )
  }, [alerts, activeTab])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  })

  const stats = React.useMemo(() => {
    const active = alerts.filter((item) => item.status === "VERIFIED").length
    const responding = alerts.filter(
      (item) => item.status === "IN_PROGRESS"
    ).length
    const critical = alerts.filter(
      (item) => item.severity === "CRITICAL"
    ).length

    return { active, responding, critical, total: alerts.length }
  }, [alerts])

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen space-y-6 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950">
      {/* Header */}
      <Card className="py-2 text-white border-red-300 dark:border-red-700 bg-gradient-to-r from-red-400 to-orange-400">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Siren className="w-6 h-6 animate-pulse" />
                Critical Reports
                <Badge
                  variant="secondary"
                  className="ml-2 text-sm text-red-600 bg-white"
                >
                  {stats.active} ACTIVE
                </Badge>
              </CardTitle>
              <CardDescription className="text-red-100">
                Real-time emergency response and critical incident management
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 text-red-600 bg-white hover:bg-red-50"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alert Categories Tabs */}
      <Card className="p-0 bg-white border-gray-100 shadow-none dark:border-red-800 dark:bg-red-950">
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-8 bg-red-100 dark:bg-red-900">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger
                value="critical"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Critical ({stats.critical})
              </TabsTrigger>
              <TabsTrigger
                value="crime"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Crime
              </TabsTrigger>
              <TabsTrigger
                value="vandalism"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Vandalism
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="infrastructure"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Infrastructure
              </TabsTrigger>
              <TabsTrigger
                value="public-safety"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Public Safety
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {/* Search and Filter */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-800" />
                    <Input
                      placeholder="Search urgent alerts..."
                      value={globalFilter ?? ""}
                      onChange={(event) =>
                        setGlobalFilter(String(event.target.value))
                      }
                      className="pl-8 w-[300px] border-gray-200 dark:border-gray-800 "
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[140px] border-gray-200 dark:border-red-800">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <SelectValue placeholder="Location" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                      <SelectItem value="debre-birhan">Debre Birhan</SelectItem>
                      <SelectItem value="bahir-dar">Bahir Dar</SelectItem>
                      <SelectItem value="mekelle">Mekelle</SelectItem>
                      <SelectItem value="hawassa">Hawassa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[120px] border-gray-200 dark:border-red-800">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-gray-800" />
                        <SelectValue placeholder="Severity" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Emergency Table */}
              <div className="bg-white border-2 border-gray-200 rounded-lg dark:border-red-800 dark:bg-red-950">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border-gray-100 dark:border-red-800 bg-red-50 dark:bg-red-900"
                      >
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              key={header.id}
                              className="h-12 font-semibold text-red-800 dark:text-red-200"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className={`hover:bg-red-50 dark:hover:bg-red-900 border-red-100 dark:border-red-800 ${
                            row.original.priority === 1
                              ? "bg-red-25 dark:bg-red-975"
                              : ""
                          }`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-4">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center text-red-500 dark:text-red-400"
                        >
                          No urgent alerts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex-1 text-sm text-red-600 dark:text-red-400">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} alert(s) selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      Rows per page
                    </p>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value))
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px] border-red-200 dark:border-red-800">
                        <SelectValue
                          placeholder={table.getState().pagination.pageSize}
                        />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 15, 20, 30, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium text-red-700 dark:text-red-300">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="w-8 h-8 p-0 text-red-700 bg-transparent border-red-200 dark:border-red-800"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to first page</span>
                      {"<<"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-8 h-8 p-0 text-red-700 bg-transparent border-red-200 dark:border-red-800"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      {"<"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-8 h-8 p-0 text-red-700 bg-transparent border-red-200 dark:border-red-800"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to next page</span>
                      {">"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-8 h-8 p-0 text-red-700 bg-transparent border-red-200 dark:border-red-800"
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to last page</span>
                      {">>"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Emergency Stats */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <Card className="text-white bg-red-600 border-red-300 dark:border-red-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-100">
                  Active Alerts
                </p>
                <p className="text-3xl font-bold animate-pulse">
                  {stats.active}
                </p>
              </div>
              <Bell className="w-8 h-8 text-red-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white bg-orange-600 border-orange-300 dark:border-orange-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-100">
                  Responding
                </p>
                <p className="text-3xl font-bold">{stats.responding}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white bg-yellow-600 border-yellow-300 dark:border-yellow-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-100">
                  Critical Priority
                </p>
                <p className="text-3xl font-bold">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="text-white bg-red-700 border-red-300 dark:border-red-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-100">
                  People Affected
                </p>
                <p className="text-3xl font-bold">{stats.totalAffected}</p>
              </div>
              <Users className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
