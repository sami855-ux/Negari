"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
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
  MapPin,
  Calendar,
  Tag,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Loader2,
  RefreshCw,
  MessageCircle,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import useGetAssignedReports from "@/hooks/useGetAssignedReports"
import toast from "react-hot-toast"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ContactModal } from "@/components/official/ContactModal"

// Data type based on provided JSON
type Report = {
  id: string
  title: string
  description: string
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "REJECTED"
    | "NEEDS_MORE_INFO"
  severity: "HIGH" | "MEDIUM" | "LOW"
  createdAt: string
  resolvedAt: string | null
  location: {
    address: string
    city: string
    region: string
  }
  category: {
    name: string
  }
  reporter: {
    username: string
  }
  assignedTo: {
    username: string
  }
}

// Mock data based on provided JSON
// const data: Report[] = [
//   {
//     id: "71cb8dc1-e9b4-444c-8e81-51646c5478ab",
//     title: "Broken Water Pipe in District 3",
//     description:
//       "A pipe burst is flooding the street in District 3. Needs urgent attention.",
//     status: "PENDING",
//     severity: "HIGH",
//     createdAt: "2025-07-28T08:43:10.831Z",
//     resolvedAt: null,
//     location: {
//       address: "Near District 3 High School",
//       city: "Addis Ababa",
//       region: "Kirkos",
//     },
//     category: {
//       name: "INFRASTRUCTURE",
//     },
//     reporter: {
//       username: "Sami Tale",
//     },
//     assignedTo: {
//       username: "Samuel tale",
//     },
//   },
//   // Add more mock data as needed
//   {
//     id: "2",
//     title: "Pothole on Main Road",
//     description: "Large pothole causing traffic issues",
//     status: "IN_PROGRESS",
//     severity: "MEDIUM",
//     createdAt: "2025-07-27T10:15:00.000Z",
//     resolvedAt: null,
//     location: {
//       address: "Main Road near City Hall",
//       city: "Addis Ababa",
//       region: "Arada",
//     },
//     category: {
//       name: "INFRASTRUCTURE",
//     },
//     reporter: {
//       username: "User2",
//     },
//     assignedTo: {
//       username: "Admin1",
//     },
//   },
//   {
//     id: "3",
//     title: "Street Light Out",
//     description: "Street light not working for past 3 days",
//     status: "RESOLVED",
//     severity: "LOW",
//     createdAt: "2025-07-25T18:30:00.000Z",
//     resolvedAt: "2025-07-27T09:45:00.000Z",
//     location: {
//       address: "Bole Road",
//       city: "Addis Ababa",
//       region: "Bole",
//     },
//     category: {
//       name: "UTILITIES",
//     },
//     reporter: {
//       username: "User3",
//     },
//     assignedTo: {
//       username: "Admin2",
//     },
//   },
// ]

const severityColors = {
  HIGH: "bg-red-100 text-red-800 border-red-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LOW: "bg-green-100 text-green-800 border-green-200",
}

const statusColors = {
  VERIFIED: "bg-blue-100 text-blue-800 border-blue-200",
  IN_PROGRESS: "bg-orange-200 text-orange-800 border-orange-300 w-28",
  RESOLVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
}

export default function VerifiedReports() {
  const { isLoading, reports, refetch } = useGetAssignedReports(
    "31cb47d9-9184-43e3-8a72-8a721c5560fe"
  )

  const router = useRouter()

  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {`${status}`.charAt(0).toUpperCase() +
              `${status}`.slice(1).toLowerCase().replace("_", " ")}
          </Badge>
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
            className="h-8 px-2"
          >
            Title
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Location
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const location = row.original.location
        return (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-green-700" />
            {location.address}, {location.region}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Reported On
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return (
          <div className="flex items-center gap-1 w-36">
            <Calendar className="w-3 h-3 text-blue-500" />
            {formatDate(date)}
          </div>
        )
      },
    },
    {
      accessorKey: "severity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Severity
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const severity = row.getValue("severity") as keyof typeof severityColors
        return (
          <Badge variant="outline" className={severityColors[severity]}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {`${severity}`.charAt(0).toUpperCase() +
              `${severity}`.slice(1).toLowerCase()}
          </Badge>
        )
      },
    },
    {
      accessorKey: "category.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Category
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const category = row.original.category.name
        return (
          <div className="flex items-center gap-1 ">
            <Tag className="w-3 h-3 text-blue-500 " />
            {category}
          </div>
        )
      },
    },
    {
      accessorKey: "reporter.username",
      header: "Reporter",
      cell: ({ row }) => {
        return (
          <span className="capitalize">{row.original.reporter.username}</span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 text-blue-600 hover:bg-blue-50"
                    onClick={() =>
                      router.push(`/official/verified/${row.original.id}`)
                    }
                  >
                    <Eye className="w-4 h-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View Report</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <ContactModal
                    reportId={row.original.id}
                    reporterName={row.original.reporter.username}
                    workerName={row.original.assignedTo?.username}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-blue-600 hover:bg-blue-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="sr-only">Archive</span>
                      </Button>
                    }
                  />
                </TooltipTrigger>
                <TooltipContent>Connect with the reporter</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )
      },
    },
  ]

  const table = useReactTable({
    data: reports || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const stats = React.useMemo(() => {
    const pending = reports?.filter((item) => item.status === "PENDING").length
    const highSeverity = reports?.filter(
      (item) => item.severity === "HIGH"
    ).length
    const resolved = reports?.filter(
      (item) => item.status === "RESOLVED"
    ).length
    const inProgress = reports?.filter(
      (item) => item.status === "IN_PROGRESS"
    ).length

    return { pending, highSeverity, resolved, inProgress }
  }, [])

  const refreshUserData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      toast.success("Reports refreshed successfully!")
    } catch {
      toast.error("Error while refreshing reports!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500) // Optional delay to show the spin briefly
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card className="py-4 border-blue-100">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Verified Reports
              </CardTitle>
              <CardDescription className="text-gray-700">
                View and manage all community reports that have been officially
                verified by you
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={refreshUserData}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw
                  className={`h-4 w-4 transition-transform duration-500 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="w-full bg-white">
        <div className="flex items-center justify-between w-full px-5 py-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search reports..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-8 w-[300px] border-gray-200  outline-none focus:border-gray-100"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filters</span>

            <Select>
              <SelectTrigger className="w-[120px] h-8 border-gray-200">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <SelectValue placeholder="Date" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px] h-8 border-gray-200">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-blue-500" />
                  <SelectValue placeholder="Severity" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[120px] h-8 border-gray-200">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-blue-500" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="mx-3 my-0 border-gray-100">
          <CardContent className="p-0">
            <div className="border rounded-md border-blue-50">
              <Table>
                <TableHeader className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className="h-12 text-gray-800"
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <Loader2
                          className="mx-auto animate-spin text-muted-foreground"
                          size={27}
                        />
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-border-line hover:bg-muted/30"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-2.5">
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
                        className="h-24 text-center text-text-secondary"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-7">
          <div className="flex-1 text-sm text-gray-600">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-600">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px] border-gray-200">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium text-blue-600">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="w-8 h-8 p-0 text-blue-600 bg-transparent border-blue-200 hover:bg-blue-50"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                {"<<"}
              </Button>
              <Button
                variant="outline"
                className="w-8 h-8 p-0 text-blue-600 bg-transparent border-blue-200 hover:bg-blue-50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                {"<"}
              </Button>
              <Button
                variant="outline"
                className="w-8 h-8 p-0 text-blue-600 bg-transparent border-blue-200 hover:bg-blue-50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                {">"}
              </Button>
              <Button
                variant="outline"
                className="w-8 h-8 p-0 text-blue-600 bg-transparent border-blue-200 hover:bg-blue-50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Summary Statistics */}
      <Card className="border-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Summary:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-600">Pending:</span>
              <Badge
                variant="secondary"
                className="text-blue-800 bg-blue-100 hover:bg-blue-200"
              >
                {stats.pending}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-600">High Severity:</span>
              <Badge variant="destructive">{stats.highSeverity}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-600">Resolved:</span>
              <Badge className="text-green-800 bg-green-100 hover:bg-green-200">
                {stats.resolved}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-600">In Progress:</span>
              <Badge className="text-blue-800 bg-blue-200 hover:bg-blue-300">
                {stats.inProgress}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
