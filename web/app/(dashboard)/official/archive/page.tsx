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
  ChevronDown,
  Eye,
  Filter,
  Search,
  Archive,
  MapPin,
  Tag,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Download,
  Clock,
  User,
  MoreVertical,
  RefreshCw,
  Loader2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useGetOfficerReports from "@/hooks/useOfficerReports"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

type ArchiveReport = {
  id: string
  title: string
  description: string
  location: string
  reportedOn: string
  archivedOn: string | null
  urgency: "HIGH" | "MEDIUM" | "LOW"
  status:
    | "PENDING"
    | "VERIFIED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "REJECTED"
    | "NEEDS_MORE_INFO"
  category: string
  reportedBy: string
  assignedTo?: string
  reason?: string
  resolution?: string
}

const urgencyColors = {
  HIGH: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  MEDIUM:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
}

const statusColors = {
  VERIFIED:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  IN_PROGRESS:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  PENDING:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  RESOLVED:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  REJECTED:
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300",
  NEEDS_MORE_INFO:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
}

const statusIcons = {
  VERIFIED: Eye,
  IN_PROGRESS: Clock,
  PENDING: AlertTriangle,
  RESOLVED: RotateCcw,
  REJECTED: Trash2,
  NEEDS_MORE_INFO: User,
}

const formatCategory = (category: string) => {
  return category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function ReportArchive() {
  const router = useRouter()
  const { user } = useSelector((store: RootState) => store.user)

  const {
    isLoading,
    reports: archivedData,
    refetch,
  } = useGetOfficerReports(user?.user?.id)

  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [reports, setReports] = React.useState<ArchiveReport[]>([])
  const [activeTab, setActiveTab] = React.useState("all")

  const refreshReport = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      toast.success("Report refreshed successfully!")
    } catch {
      toast.error("Error while refreshing report!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  React.useEffect(() => {
    if (!isLoading && archivedData) {
      setReports(archivedData)
    }
  }, [archivedData, isLoading])

  const columns: ColumnDef<ArchiveReport>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <Badge className="px-2 py-1 text-xs text-gray-700 rounded bg-slate-200 dark:bg-slate-800 hover:bg-gray-300">
          {`${row.getValue("id")}.`.slice(0, 8)}...
        </Badge>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Report Title
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <div className="font-medium truncate text-slate-900 dark:text-slate-100">
            {row.getValue("title")}
          </div>
          <div className="text-xs truncate text-slate-500 dark:text-slate-400">
            {row.original.description.substring(0, 50)}...
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Location
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span className="text-sm">{row.getValue("location")}</span>
        </div>
      ),
    },
    {
      accessorKey: "urgency",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Priority
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const urgency = row.getValue("urgency") as keyof typeof urgencyColors
        return (
          <Badge variant="outline" className={urgencyColors[urgency]}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {urgency}
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
            className="h-8 px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Status
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        const StatusIcon = statusIcons[status]
        return (
          <Badge variant="outline" className={statusColors[status]}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {formatStatus(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Tag className="w-3 h-3 text-slate-400" />
          <span className="text-sm">
            {formatCategory(row.getValue("category"))}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const report = row.original

        const handleRestore = () => {
          // In a real app, this would move the report back to active reports
          setReports((prev) => prev.filter((r) => r.id !== report.id))
        }

        const handlePermanentDelete = () => {
          setReports((prev) => prev.filter((r) => r.id !== report.id))
        }

        const handleExport = () => {
          // Mock export functionality
        }

        return (
          <div className="flex items-center gap-1">
            {/* View Details Dialog */}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => {
                if (
                  row.original.status === "PENDING" ||
                  row.original.status === "NEEDS_MORE_INFO"
                ) {
                  router.push(`/official/archive/${report.id}`)
                }
                if (row.original.status !== "PENDING") {
                  router.push(`/official/verified/${report.id}`)
                }
              }}
            >
              <Eye className="w-4 h-4" />
              <span className="sr-only">View Details</span>
            </Button>

            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MoreVertical className="w-4 h-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={handleRestore}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Draft Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handlePermanentDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return reports

    return reports.filter((report) => {
      const statusForComparison = report.status.toLowerCase().replace(/_/g, "-")
      return statusForComparison === activeTab
    })
  }, [reports, activeTab])

  const table = useReactTable({
    data: filteredData || [],
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
        pageSize: 10,
      },
    },
  })

  const stats = React.useMemo(() => {
    const pending = reports.filter(
      (item) => item.status === "PENDING" || item.status === "NEEDS_MORE_INFO"
    ).length
    const resolved = reports.filter((item) => item.status === "RESOLVED").length
    const rejected = reports.filter((item) => item.status === "REJECTED").length
    const inProgress = reports.filter(
      (item) => item.status === "IN_PROGRESS"
    ).length
    const verified = reports.filter((item) => item.status === "VERIFIED").length

    return {
      pending,
      resolved,
      rejected,
      inProgress,
      verified,
      total: reports.length,
    }
  }, [reports])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="w-full min-h-screen space-y-6 bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <Card className="bg-white border-slate-200 dark:border-slate-700 dark:bg-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 dark:text-slate-100">
                  <Archive className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  Report Archive
                  <Badge variant="secondary" className="ml-2">
                    {stats.total} Reports
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  View and manage archived community reports across all statuses
                </CardDescription>
              </div>
              <div className="flex items-center">
                <Button
                  onClick={refreshReport}
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

        {/* Status Tabs */}
        <Card className="bg-white border-slate-200 dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 bg-slate-100 dark:bg-slate-700">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="in-progress">
                  In Progress ({stats.inProgress})
                </TabsTrigger>
                <TabsTrigger value="resolved">
                  Resolved ({stats.resolved})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({stats.rejected})
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {/* Search and Filter */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search archived reports..."
                        value={globalFilter ?? ""}
                        onChange={(event) =>
                          setGlobalFilter(String(event.target.value))
                        }
                        className="pl-8 w-[300px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-[140px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <SelectValue placeholder="Location" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                        <SelectItem value="debre-birhan">
                          Debre Birhan
                        </SelectItem>
                        <SelectItem value="bahir-dar">Bahir Dar</SelectItem>
                        <SelectItem value="mekelle">Mekelle</SelectItem>
                        <SelectItem value="hawassa">Hawassa</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[130px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <SelectValue placeholder="Category" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infrastructure">
                          Infrastructure
                        </SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      >
                        <Filter className="w-4 h-4" />
                        Columns
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          )
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Table */}
                <div className="bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                          key={headerGroup.id}
                          className="border-slate-200 dark:border-slate-700"
                        >
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead
                                key={header.id}
                                className="h-12 text-slate-700 dark:text-slate-300"
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
                            className="hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
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
                            className="h-24 text-center text-slate-500 dark:text-slate-400"
                          >
                            No archived reports found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex-1 text-sm text-slate-500 dark:text-slate-400">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </div>
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Rows per page
                      </p>
                      <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                          table.setPageSize(Number(value))
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-300">
                      Page {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="w-8 h-8 p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to first page</span>
                        {"<<"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-8 h-8 p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to previous page</span>
                        {"<"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-8 h-8 p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Go to next page</span>
                        {">"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-8 h-8 p-0 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="bg-white border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.pending}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Resolved
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.resolved}
                  </p>
                </div>
                <RotateCcw className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Rejected
                  </p>
                  <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {stats.rejected}
                  </p>
                </div>
                <Trash2 className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 dark:border-slate-700 dark:bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.inProgress}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
