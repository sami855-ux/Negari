"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileWarning,
  Bot,
  CheckCircle,
  User,
  Settings,
  Clock,
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Info,
  RefreshCw,
} from "lucide-react"
import { ActivityLog } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { LogDetailModal } from "@/components/admin/LogDetailModal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

// Mock data
const mockLogs: ActivityLog[] = [
  {
    id: "1",
    actorName: "John Doe",
    actorRole: "ADMIN",
    action: "REPORT_SUBMITTED",
    targetType: "REPORT",
    targetLabel: "Report #1234",
    description: "New report submitted by user",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "2",
    actorName: "System",
    actorRole: "SYSTEM",
    action: "BACKUP_CREATED",
    targetType: "SYSTEM",
    targetLabel: "Database",
    description: "Nightly backup completed",
    meta: { size: "2.5GB", duration: "15 minutes" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "3",
    actorName: "Jane Smith",
    actorRole: "OFFICIAL",
    action: "REPORT_RESOLVED",
    targetType: "REPORT",
    targetLabel: "Report #1234",
    description: "Report marked as resolved",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "4",
    actorName: "AI Moderation",
    actorRole: "SYSTEM",
    action: "AI_SPAM_DETECTED",
    targetType: "REPORT",
    targetLabel: "Report #1235",
    description: "Potential spam detected by AI",
    meta: { confidence: "92%", reason: "Pattern matching" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "5",
    actorName: "System",
    actorRole: "SYSTEM",
    action: "LOGIN",
    targetType: "USER",
    targetLabel: "Admin User",
    description: "Successful admin login",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "6",
    actorName: "Michael Brown",
    actorRole: "USER",
    action: "REPORT_SUBMITTED",
    targetType: "REPORT",
    targetLabel: "Report #1236",
    description: "Water pollution report submitted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
]

const actionIcons = {
  REPORT_SUBMITTED: <FileWarning className="w-4 h-4 text-indigo-600" />,
  STATUS_CHANGED: <Settings className="w-4 h-4 text-purple-600" />,
  AI_PRIORITY_SET: <Bot className="w-4 h-4 text-pink-600" />,
  AI_SPAM_DETECTED: <Bot className="w-4 h-4 text-red-600" />,
  REPORT_ASSIGNED: <User className="w-4 h-4 text-blue-600" />,
  REPORT_RESOLVED: <CheckCircle className="w-4 h-4 text-green-600" />,
  LOGIN: <User className="w-4 h-4 text-cyan-600" />,
  BACKUP_CREATED: <Settings className="w-4 h-4 text-gray-600" />,
}

const actionLabels = {
  REPORT_SUBMITTED: "Report Submitted",
  STATUS_CHANGED: "Status Changed",
  AI_PRIORITY_SET: "AI Priority Set",
  AI_SPAM_DETECTED: "AI Spam Detected",
  REPORT_ASSIGNED: "Report Assigned",
  REPORT_RESOLVED: "Report Resolved",
  LOGIN: "Login",
  BACKUP_CREATED: "Backup Created",
}

const roleColors = {
  ADMIN: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  USER: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  OFFICIAL: "bg-green-100 text-green-800 hover:bg-green-200",
  SYSTEM: "bg-purple-100 text-purple-800 hover:bg-purple-200",
}

export default function ActivityLogPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<ActivityLog>[] = [
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {actionIcons[row.original.action]}
          <span className="font-medium">
            {actionLabels[row.original.action]}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "actorName",
      header: "Actor",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.actorName || "System"}
          </span>
          {/* <Badge
            variant="outline"
            className={` w-fit  ${roleColors[row.original.actorRole]} text-sm`}
          >
            {row.original.actorRole}
          </Badge> */}
        </div>
      ),
    },
    {
      accessorKey: "targetLabel",
      header: "Target",
      cell: ({ row }) => (
        <div className="text-gray-700">
          {row.original.targetLabel || "System"}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-gray-600">{row.original.description}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Time",
      cell: ({ row }) => (
        <div className="text-gray-500">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
          })}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const log = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-indigo-600"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedLog(log)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Another action")}>
                Another Action
              </DropdownMenuItem>
              {/* Add more items as needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: mockLogs,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header Card */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg ">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Activity Logs
                </h1>
              </div>
              <p className="text-gray-600">
                Track all system activities, user actions, and automated
                processes. Monitor report submissions,
                <br /> system backups, and AI moderation events.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={() => table.reset()}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 bg-white">
          {/* Controls */}
          <div className="flex flex-col items-center justify-between gap-4 pb-4 bg-white rounded-lg md:flex-row">
            <div className="flex items-center w-full gap-2 md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-80">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <Input
                  placeholder="Search logs..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg ">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-gray-700"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-indigo-50/50"
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                      className="h-24 text-center text-gray-500"
                    >
                      No activity logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination and Summary */}
          <div className="flex flex-col items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row">
            <div className="text-sm text-gray-600">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} activities
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1 text-sm">
                <span>Page</span>
                <span className="font-medium">
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-8 h-8 p-0"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>

              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px] focus:ring-2 focus:ring-indigo-500">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  )
}
