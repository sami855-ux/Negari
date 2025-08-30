"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import {
  CalendarIcon,
  RefreshCw,
  Search,
  Star,
  Filter,
  ChevronDown,
  ChevronUp,
  Trash,
} from "lucide-react"

import { cn, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteFeedback, getFeedbackByOfficial } from "@/services/feedback"
import { DeleteModal } from "@/components/admin/Modal"
import toast from "react-hot-toast"

type Status = "New" | "Reviewed" | "Resolved"

interface FeedbackEntry {
  id: string
  rating: number
  comment: string
  createdAt: string
  report: {
    id: string
    title: string
    reporter: {
      id: string
      username: string
      profilePicture: string
    }
  }
}

// const mockData: FeedbackEntry[] = [
//   {
//     id: "uuid-feedback-1",
//     rating: 4,
//     comment: "Resolved quickly",
//     createdAt: "2025-07-30T06:42:00.000Z",
//     report: {
//       id: "uuid-report-1",
//       title: "Broken streetlight",
//       reporter: {
//         id: "uuid-user-1",
//         username: "John Doe",
//         profilePicture: "",
//       },
//     },
//   },
//   {
//     id: "uuid-feedback-2",
//     rating: 5,
//     comment: "Excellent service! The pothole was fixed within 24 hours.",
//     createdAt: "2025-07-29T14:15:00.000Z",
//     report: {
//       id: "uuid-report-2",
//       title: "Pothole on Main Street",
//       reporter: {
//         id: "uuid-user-2",
//         username: "Sarah Johnson",
//         profilePicture: "",
//       },
//     },
//   },
//   {
//     id: "uuid-feedback-3",
//     rating: 2,
//     comment: "Still waiting for the trash to be collected after 3 days",
//     createdAt: "2025-07-28T09:30:00.000Z",
//     report: {
//       id: "uuid-report-3",
//       title: "Overflowing trash bin",
//       reporter: {
//         id: "uuid-user-3",
//         username: "Michael Chen",
//         profilePicture: "",
//       },
//     },
//   },
//   {
//     id: "uuid-feedback-4",
//     rating: 3,
//     comment: "The graffiti was partially removed but some remains",
//     createdAt: "2025-07-27T16:45:00.000Z",
//     report: {
//       id: "uuid-report-4",
//       title: "Graffiti in city park",
//       reporter: {
//         id: "uuid-user-4",
//         username: "Emily Rodriguez",
//         profilePicture: "",
//       },
//     },
//   },
//   {
//     id: "uuid-feedback-5",
//     rating: 5,
//     comment: "Thank you for fixing the streetlight so quickly!",
//     createdAt: "2025-07-26T11:20:00.000Z",
//     report: {
//       id: "uuid-report-5",
//       title: "Streetlight outage",
//       reporter: {
//         id: "uuid-user-5",
//         username: "David Kim",
//         profilePicture: "",
//       },
//     },
//   },
//   {
//     id: "uuid-feedback-6",
//     rating: 1,
//     comment: "No action taken on my noise complaint after a week",
//     createdAt: "2025-07-25T19:10:00.000Z",
//     report: {
//       id: "uuid-report-6",
//       title: "Noisy construction at night",
//       reporter: {
//         id: "uuid-user-6",
//         username: "Lisa Wong",
//         profilePicture: "",
//       },
//     },
//   },
// ]

export default function FeedbackDashboard() {
  const { isLoading, data: feedbacks } = useQuery({
    queryKey: ["Citizen_Feedback"],
    queryFn: () =>
      getFeedbackByOfficial("31cb47d9-9184-43e3-8a72-8a721c5560fe"),
  })
  const queryClient = useQueryClient()

  const [data, setData] = React.useState<FeedbackEntry[]>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<Status | "All">("All")
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>()
  const [dateTo, setDateTo] = React.useState<Date | undefined>()
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [itemId, setItemId] = React.useState("")

  const columns: ColumnDef<FeedbackEntry>[] = [
    {
      accessorKey: "report.reporter.name",
      header: "Citizen",
      cell: ({ row }) => {
        const name = row.original.report.reporter.username
        const profilePicture = row.original.report.reporter.profilePicture
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
        return (
          <div className="flex items-center gap-3">
            <Avatar className="border h-9 w-9 border-border-line">
              <AvatarImage
                src={profilePicture || undefined}
                alt={`${name}'s profile`}
              />
              <AvatarFallback className="text-white bg-green-500">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="font-medium">{name}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "report.title",
      header: "Report",
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[200px] truncate font-medium hover:text-primary cursor-default">
              {row.original.report.title}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.report.title}</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: "comment",
      header: "Feedback",
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[250px] truncate text-muted-foreground hover:text-primary cursor-default">
              {row.original.comment}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px]">
            <p>{row.original.comment}</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => (
            <Star
              key={rating}
              className={cn(
                "h-4 w-4",
                rating <= row.original.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted-foreground"
              )}
            />
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            ({row.original.rating}/5)
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(new Date(row.original.createdAt))}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right text-text-secondary">Actions</div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setItemId(row.original.id)
                setIsDeleteModalOpen(true)
              }}
              className="text-red-700 bg-white hover:text-red-700/90 hover:bg-red-100"
              aria-label={`Delete ${user.report.reporter.username}`}
            >
              <Trash className="w-4 h-4 " />
            </Button>
          </div>
        )
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ]

  // Simulate data fetching
  React.useEffect(() => {
    if (feedbacks?.length) {
      setData(feedbacks)
    }
  }, [isLoading, feedbacks])

  const filteredData = React.useMemo(() => {
    return data
      .filter((entry) => {
        // Date range filter
        const entryDate = new Date(entry.createdAt).getTime()
        const from = dateFrom ? dateFrom.getTime() : Number.NEGATIVE_INFINITY
        const to = dateTo ? dateTo.getTime() : Number.POSITIVE_INFINITY
        if (entryDate < from || entryDate > to) return false

        // Global search
        if (globalFilter.trim()) {
          const term = globalFilter.toLowerCase()
          return (
            entry.report.reporter.username.toLowerCase().includes(term) ||
            entry.report.title.toLowerCase().includes(term) ||
            entry.comment.toLowerCase().includes(term)
          )
        }

        return true
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [data, globalFilter, statusFilter, dateFrom, dateTo])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  })

  const resetFilters = () => {
    setGlobalFilter("")
    setStatusFilter("All")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const deleteItem = async (id: string) => {
    setIsDeleting(true)

    try {
      const res = await deleteFeedback(id)

      if (res.success) {
        setIsSuccess(true)
        toast.success("Feedback deleted successfully!")

        queryClient.invalidateQueries({ queryKey: ["Citizen_Feedback"] })

        // Close modal after 1 second
        setTimeout(() => {
          setIsDeleteModalOpen(false)
          setIsSuccess(false)
          setItemId("")
        }, 1000)
      } else {
        toast.error("Failed to delete feedback")
        return
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full ">
        <Card className="mx-auto w-full max-w-6xl border-0">
          <CardHeader className="flex flex-col space-y-4 pb-4 mb-4 bg-white">
            <div className="flex flex-col space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Citizen Feedback
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Review and manage feedback from citizens about your services
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-primary/10 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Feedback
                      </p>
                      <h3 className="text-2xl font-bold">{data.length}</h3>
                    </div>
                    <div className="rounded-lg bg-primary/20 p-3">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg. Rating
                      </p>
                      <h3 className="text-2xl font-bold">
                        {data.length > 0
                          ? (
                              data.reduce((sum, item) => sum + item.rating, 0) /
                              data.length
                            ).toFixed(1)
                          : 0}
                      </h3>
                    </div>
                    <div className="rounded-lg bg-secondary/20 p-3">
                      <Star className="h-5 w-5 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        New
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Badge variant="default" className="bg-blue-500">
                        New
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Resolved
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-100 p-3">
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-500"
                      >
                        Resolved
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardHeader>

          <CardContent className="bg-muted/40 mt-4">
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-9 md:max-w-sm"
                />
              </div>

              {/* Other filters */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Status */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Select
                    value={statusFilter}
                    onValueChange={(val) =>
                      setStatusFilter(val as Status | "All")
                    }
                  >
                    <SelectTrigger className="w-[150px] pl-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date range */}
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "MMM d") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <span className="text-muted-foreground">–</span>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[140px] justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "MMM d") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button variant="outline" onClick={resetFilters}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader className="bg-muted/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      <TableHead className="w-[50px]"></TableHead>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell colSpan={columns.length + 1}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.id}>
                        <TableRow
                          className={cn(
                            "cursor-pointer hover:bg-muted/50",
                            expandedRow === row.id && "bg-muted/30"
                          )}
                          onClick={() => toggleRowExpand(row.id)}
                        >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              {expandedRow === row.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>

                        {expandedRow === row.id && (
                          <TableRow>
                            <TableCell colSpan={columns.length + 1}>
                              <div className="p-4 bg-muted/20">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Feedback Details
                                    </h4>
                                    <p className="text-sm">
                                      {row.original.comment}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">
                                      Report Details
                                    </h4>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Report ID:
                                      </span>{" "}
                                      {row.original.report.id}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Title:
                                      </span>{" "}
                                      {row.original.report.title}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">
                                        Submitted:
                                      </span>{" "}
                                      {format(
                                        new Date(row.original.createdAt),
                                        "MMM d, yyyy 'at' h:mm a"
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                                  >
                                    View Full Report
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + 1}
                        className="h-24 text-center"
                      >
                        No feedback found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Showing {table.getRowModel().rows.length} of{" "}
                {filteredData.length} feedback items
              </div>
              <div className="flex items-center space-x-2">
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
          </CardContent>
        </Card>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false)
            setIsSuccess(false)
            setItemId("")
          }
        }}
        onConfirm={() => deleteItem(itemId)}
        isLoading={isDeleting}
        isSuccess={isSuccess}
        title="Delete Item?"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </>
  )
}
