"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel, // Re-add for global filter
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Star, MoreHorizontal, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input" // Re-add Input
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export type User = {
  id: string
  username: string
  email: string
  profilePicture: string
  averageRating: number
  totalRatings: number
}

interface UsersTableProps {
  data: User[]
  isLoading: boolean
}

export default function ReportTable({ data, isLoading }: UsersTableProps) {
  const router = useRouter()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("") // Re-add global filter state

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "profilePicture",
      header: () => (
        <div className="text-left text-text-secondary">Picture</div>
      ),
      cell: ({ row }) => {
        const username = row.original.username
        const initials = username
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
        return (
          <Avatar className="border h-9 w-9 border-border-line">
            <AvatarImage
              src={row.original.profilePicture || undefined}
              alt={`${username}'s profile`}
            />
            <AvatarFallback className="text-white bg-primary-accent">
              {initials}
            </AvatarFallback>
          </Avatar>
        )
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "averageRating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Avg. Rating
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const rating = Number.parseFloat(row.getValue("averageRating"))
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: fullStars }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            ))}
            {hasHalfStar && (
              <Star
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
                style={{ clipPath: "inset(0 50% 0 0)" }} // Simple half-star visual
              />
            )}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-muted stroke-muted-foreground"
              />
            ))}
            <span className="ml-1 text-sm font-medium">
              {rating.toFixed(2)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "totalRatings",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Ratings
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium text-right">
          {row.getValue("totalRatings")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/admin/feedback/${user.id}`)}
              >
                View official details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter, // Re-add global filter handler
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Re-add filtered row model
    state: {
      sorting,
      globalFilter, // Include global filter in state
    },
  })

  const handleSortByRating = (order: "asc" | "desc") => {
    setSorting([{ id: "averageRating", desc: order === "desc" }])
  }

  const handleSortByUsername = (order: "asc" | "desc") => {
    setSorting([{ id: "username", desc: order === "desc" }])
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4 py-4 sm:flex-row">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="flex-1 max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-transparent">
              Sort By
              <ArrowUpDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSortByRating("desc")}>
              Highest Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortByRating("asc")}>
              Lowest Rating
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortByUsername("asc")}>
              Username (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortByUsername("desc")}>
              Username (Z-A)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
      <div className="flex items-center justify-end py-4 space-x-2">
        <div className="flex-1 text-sm text-text-secondary">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table?.getPageCount()}
        </div>
        <Select
          value={table?.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="w-[100px] border-border-line text-text-primary">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent className="bg-card-background border-border-line">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={pageSize.toString()}
                className="text-text-primary hover:bg-muted focus:bg-muted"
              >
                Show {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-transparent border-border-line text-text-primary hover:bg-muted"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-transparent border-border-line text-text-primary hover:bg-muted"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
