"use client"

import { useState, useMemo } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Eye,
  ChevronDown,
  CalendarIcon,
  Search,
  Filter,
  ArrowUpDown,
  Trash,
  User,
  Loader2,
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import type { Report, ReportCategory, ReportSeverity, status } from "@/lib/data"
import type { DateRange } from "react-day-picker"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { useRouter } from "next/navigation"
import { DeleteConfirmationModal } from "../DeleteModal"
import { deleteReport } from "@/services/report"
import { resolve } from "node:url"
import toast from "react-hot-toast"
import useDeleteReport from "@/hooks/useDeleteReport"

interface ReportsTableProps {
  reports: Report[]
  isLoading: boolean
}

export function ReportsTable({ reports, isLoading }: ReportsTableProps) {
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [reportIdToDelete, setReportIdToDelete] = useState<string>("")
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  const severityColors: Record<ReportSeverity, string> = {
    LOW: "bg-green-200 text-green-800 hover:bg-green-100",
    MEDIUM: "bg-yellow-200 text-yellow-800 hover:bg-yellow-100",
    HIGH: "bg-red-200 text-red-800 hover:bg-red-100 font-jakarta ",
  }

  const categoryColors: Record<ReportCategory, string> = {
    INFRASTRUCTURE: "bg-blue-200 text-blue-800 hover:bg-blue-100",
    SANITATION: "bg-purple-200 text-purple-800 hover:bg-purple-100",
    ENVIRONMENT: "bg-emerald-200 text-emerald-800 hover:bg-emerald-100",
    SAFETY: "bg-orange-200 text-orange-800 hover:bg-orange-100",
    MAINTENANCE: "bg-cyan-200 text-cyan-800 hover:bg-cyan-100",
    OTHER: "bg-gray-200 text-gray-800 hover:bg-gray-100",
  }
  const statusColors: Record<status, string> = {
    PENDING: "bg-blue-200 text-blue-800 hover:bg-blue-100 text-xs",
    IN_PROGRESS: "bg-purple-200 text-purple-800 hover:bg-purple-100",
    RESOLVED: "bg-emerald-200 text-emerald-800 hover:bg-emerald-100",
    REJECTED: "bg-red-200 text-red-800 hover:bg-red-100",
    VERIFIED: "bg-green-200 text-green-800 hover:bg-green-100",
    NEEDS_MORE_INFO: "bg-yellow-200 text-yellow-800 hover:bg-yellow-100",
  }

  const uniqueCategories = useMemo(() => {
    const categories = new Set<ReportCategory>()
    reports?.forEach((report) => categories.add(report.category))
    return Array.from(categories).sort()
  }, [reports])

  const uniqueReporters = useMemo(() => {
    const reporters = new Set<string>()
    reports?.forEach((report) => reporters.add(report.reporterName))
    return Array.from(reporters).sort()
  }, [reports])

  const columns: ColumnDef<Report>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="w-64 font-medium">{row.getValue("title")}</div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status: status = row.getValue("status")

          return (
            <Badge
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium w-fit",
                statusColors[status]
              )}
            >
              {status === "IN_PROGRESS"
                ? formatStatus(status)
                : `${status.charAt(0).toUpperCase()}${status
                    .slice(1)
                    .toLowerCase()}`}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return (value as string[]).includes(row.getValue(id))
        },
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ row }) => {
          const severity: ReportSeverity = row.getValue("severity")
          return (
            <Badge
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                severityColors[severity]
              )}
            >
              {`${severity.charAt(0).toUpperCase()}${severity
                .slice(1)
                .toLowerCase()} `}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return (value as string[]).includes(row.getValue(id))
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category: ReportCategory = row.getValue("category")
          return (
            <Badge
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                categoryColors[category]
              )}
            >
              {`${category.charAt(0).toUpperCase()}${category
                .slice(1)
                .toLowerCase()} `}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return (value as string[]).includes(row.getValue(id))
        },
      },

      {
        accessorFn: (row) => row.reporter?.username || "Anonymous",
        id: "reporter", // You can name this anything
        header: "Reporter",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("reporter")}</div>
        ),
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },

      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto px-0 py-0 text-text-secondary hover:bg-transparent"
          >
            Reported At
            <ArrowUpDown className="w-3 h-3 ml-2" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-text-secondary">
            {formatDate(new Date(row.getValue("createdAt")))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              {/* View Action */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => {
                        router.push(`/admin/reports/${row.original.id}`)
                      }}
                    >
                      <Eye className="w-6 h-6" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm">
                    <p>View report details</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        setReportIdToDelete(row.original.id)
                        setIsModalOpen(true)
                      }}
                    >
                      <Trash className="w-6 h-6" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-sm">
                    <p>Delete Report</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [severityColors, categoryColors]
  )

  const table = useReactTable({
    data: reports || [],
    columns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const getFilterValue = (id: string) => {
    return (table.getColumn(id)?.getFilterValue() || []) as string[]
  }

  const setFilterValue = (id: string, value: string) => {
    const currentFilters = getFilterValue(id)
    if (currentFilters.includes(value)) {
      table
        .getColumn(id)
        ?.setFilterValue(currentFilters.filter((item) => item !== value))
    } else {
      table.getColumn(id)?.setFilterValue([...currentFilters, value])
    }
  }

  const setDateFilter = (range: DateRange | undefined) => {
    setDateRange(range)
    table.getColumn("createdAt")?.setFilterValue(range)
  }

  const clearFilters = () => {
    setGlobalFilter("")
    setColumnFilters([])
    setDateRange(undefined)
    table.resetColumnFilters()
    table.resetGlobalFilter()
  }

  return (
    <>
      <div className="w-full p-6 border rounded-lg shadow-sm bg-card-background border-border-line">
        <div className="flex flex-col items-center gap-4 py-4 md:flex-row">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-full pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 md:ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Filter className="w-4 h-4" /> Severity{" "}
                  <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["Low", "Medium", "High"].map((severity) => (
                  <DropdownMenuCheckboxItem
                    key={severity}
                    checked={getFilterValue("severity").includes(severity)}
                    onCheckedChange={() => setFilterValue("severity", severity)}
                  >
                    {severity}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Filter className="w-4 h-4" /> Category{" "}
                  <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {uniqueCategories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={getFilterValue("category").includes(category)}
                    onCheckedChange={() => setFilterValue("category", category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Filter className="w-4 h-4" /> Reporter{" "}
                  <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {uniqueReporters.map((reporter) => (
                  <DropdownMenuCheckboxItem
                    key={reporter}
                    checked={getFilterValue("reporterName").includes(reporter)}
                    onCheckedChange={() =>
                      setFilterValue("reporterName", reporter)
                    }
                  >
                    {reporter}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-auto justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Filter by date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="flex flex-col p-2">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setDateFilter({
                        from: subDays(new Date(), 7),
                        to: new Date(),
                      })
                    }
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setDateFilter({
                        from: startOfMonth(new Date()),
                        to: endOfMonth(new Date()),
                      })
                    }
                  >
                    This Month
                  </Button>
                  <Separator className="my-2" />
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateFilter}
                    numberOfMonths={2}
                  />
                </div>
              </PopoverContent>
            </Popover>

            {(globalFilter || columnFilters.length > 0 || dateRange) && (
              <Button variant="ghost" onClick={clearFilters} className="ml-2">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
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
        <div className="flex items-center justify-end py-4 space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {reports?.length}{" "}
            row(s) displayed.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportId={reportIdToDelete}
        description="Are you sure you want to delete this report? This action cannot be undone."
      />
    </>
  )
}
function formatStatus(status) {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
