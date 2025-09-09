"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  Eye,
  Edit,
  SearchIcon,
  XCircle,
  Loader2,
  Trash,
} from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Role, type User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { EditUserSheet } from "./editUserSheet"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { DeleteModal } from "./Modal"
import { deleteUser } from "@/services/getUsers"

interface UserTableProps {
  data: User[]
  onDataRefresh: () => void
  isUserLoading: boolean
}

export function UserTable({
  data,
  onDataRefresh,
  isUserLoading,
}: UserTableProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedRoleFilter, setSelectedRoleFilter] =
    React.useState<string>("all")
  const [emailStatusFilter, setEmailStatusFilter] =
    React.useState<string>("all")
  const [googleIdStatusFilter, setGoogleIdStatusFilter] =
    React.useState<string>("all")
  const [telegramIdStatusFilter, setTelegramIdStatusFilter] =
    React.useState<string>("all")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10, // Default page size
  })

  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [itemId, setItemId] = React.useState("")

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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto px-0 py-0 text-text-secondary hover:bg-transparent"
        >
          Username
          <ArrowUpDown className="w-3 h-3 ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium capitalize text-text-primary">
          {row.getValue("username")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto px-0 py-0 text-text-secondary hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="w-3 h-3 ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-text-secondary">
          {row.getValue("email") || "None"}
        </div>
      ),
      filterFn: (row, columnId, value) => {
        const email = row.getValue<string | null>(columnId)
        if (value === "all") return true
        if (value === "has_email") return !!email
        if (value === "no_email") return !email
        return true
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto px-0 py-0 text-text-secondary hover:bg-transparent"
        >
          Role
          <ArrowUpDown className="w-3 h-3 ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const role: Role = row.getValue("role")
        let variant:
          | "default"
          | "secondary"
          | "outline"
          | "destructive"
          | "verified"
          | "pending"
          | null = "secondary"
        if (role === Role.ADMIN) variant = "default"
        else if (role === Role.OFFICER) variant = "outline"
        else if (role === Role.WORKER) variant = "pending" // Re-using pending for a distinct color
        return (
          <Badge variant={variant} className="text-xs px-2 py-0.5">
            {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
          </Badge>
        )
      },
      filterFn: (row, columnId, value) => {
        if (value === "all") return true
        return row.getValue<string>(columnId) === value
      },
    },
    {
      accessorKey: "googleId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto px-0 py-0 text-text-secondary hover:bg-transparent"
        >
          Google
          <ArrowUpDown className="w-3 h-3 ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-text-secondary">
          {row.getValue("googleId") ? (
            <Badge
              variant="verified"
              className="px-2 py-0.5 text-xs text-green-800 border-green-300"
            >
              Connected
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-xs text-gray-700 border-gray-300"
            >
              None
            </Badge>
          )}
        </div>
      ),
      filterFn: (row, columnId, value) => {
        const googleId = row.getValue<string | null>(columnId)
        if (value === "all") return true
        if (value === "connected") return !!googleId
        if (value === "not_connected") return !googleId
        return true
      },
    },
    {
      accessorKey: "telegramId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto px-0 py-0 text-text-secondary hover:bg-transparent"
        >
          Telegram
          <ArrowUpDown className="w-3 h-3 ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-text-secondary">
          {row.getValue("telegramId") ? (
            <Badge
              variant="verified"
              className="px-2 py-0.5 text-xs text-green-800 border-green-300"
            >
              Connected
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-xs text-gray-700 border-gray-300"
            >
              None
            </Badge>
          )}
        </div>
      ),
      filterFn: (row, columnId, value) => {
        const telegramId = row.getValue<string | null>(columnId)
        if (value === "all") return true
        if (value === "connected") return !!telegramId
        if (value === "not_connected") return !telegramId
        return true
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
          Joined At
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
      header: () => (
        <div className="text-right text-text-secondary">Actions</div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/users/${row.original.id}`)}
              className="bg-transparent text-text-primary hover:bg-muted border-border-line"
              aria-label={`View reports by ${user.username}`}
            >
              <Eye className="w-4 h-4 mr-1" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setEditingUser(user)
                setIsEditSheetOpen(true)
              }}
              className="text-white bg-primary-accent hover:bg-primary-accent/90"
              aria-label={`Edit ${user.username}`}
            >
              <Edit className="w-4 h-4 mr-1" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setItemId(row.original.id)
                setIsDeleteModalOpen(true)
              }}
              className="text-red-700 bg-white hover:text-red-700/90 hover:bg-red-100"
              aria-label={`Delete ${user.username}`}
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

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  })

  const deleteItem = async (id: string) => {
    setIsDeleting(true)
    try {
      // Simulate API call
      const res = await deleteUser(id)

      if (res.success) {
        setIsSuccess(true)
        toast.success("user deleted successfully!")

        queryClient.invalidateQueries({ queryKey: ["users"] })
        // Close modal after 1 second
        setTimeout(() => {
          setIsDeleteModalOpen(false)
          setIsSuccess(false)
          setItemId("")
        }, 1000)

        return
      } else {
        toast.error("Failed to delete user")
        return
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed")
    } finally {
      setIsDeleting(false)
    }
  }

  // Apply filters when their respective states change
  React.useEffect(() => {
    table.getColumn("role")?.setFilterValue(selectedRoleFilter)
  }, [selectedRoleFilter, table])

  React.useEffect(() => {
    table.getColumn("email")?.setFilterValue(emailStatusFilter)
  }, [emailStatusFilter, table])

  React.useEffect(() => {
    table.getColumn("googleId")?.setFilterValue(googleIdStatusFilter)
  }, [googleIdStatusFilter, table])

  React.useEffect(() => {
    table.getColumn("telegramId")?.setFilterValue(telegramIdStatusFilter)
  }, [telegramIdStatusFilter, table])

  return (
    <>
      <div className="w-full p-6 border rounded-lg shadow-sm bg-card-background border-border-line">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="relative flex-grow max-w-sm min-w-[200px]">
            <SearchIcon className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-text-secondary" />
            <Input
              placeholder="Search by username or email..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pr-8 pl-9 border-border-line text-text-primary focus:ring-primary-accent focus:border-primary-accent"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute p-0 -translate-y-1/2 right-1 top-1/2 h-7 w-7 text-text-secondary hover:bg-muted"
                onClick={() => setGlobalFilter("")}
                aria-label="Clear search"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              value={selectedRoleFilter}
              onValueChange={setSelectedRoleFilter}
            >
              <SelectTrigger className="w-[160px] border-border-line text-text-primary">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-card-background border-border-line">
                <SelectItem
                  value="all"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  All Roles
                </SelectItem>
                {Object.values(Role).map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="text-text-primary hover:bg-muted focus:bg-muted"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={emailStatusFilter}
              onValueChange={setEmailStatusFilter}
            >
              <SelectTrigger className="w-[160px] border-border-line text-text-primary">
                <SelectValue placeholder="Email Status" />
              </SelectTrigger>
              <SelectContent className="bg-card-background border-border-line">
                <SelectItem
                  value="all"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  All Emails
                </SelectItem>
                <SelectItem
                  value="has_email"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  Has Email
                </SelectItem>
                <SelectItem
                  value="no_email"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  No Email
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={googleIdStatusFilter}
              onValueChange={setGoogleIdStatusFilter}
            >
              <SelectTrigger className="w-[160px] border-border-line text-text-primary">
                <SelectValue placeholder="Google Status" />
              </SelectTrigger>
              <SelectContent className="bg-card-background border-border-line">
                <SelectItem
                  value="all"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  All Google
                </SelectItem>
                <SelectItem
                  value="connected"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  Connected
                </SelectItem>
                <SelectItem
                  value="not_connected"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  None
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={telegramIdStatusFilter}
              onValueChange={setTelegramIdStatusFilter}
            >
              <SelectTrigger className="w-[160px] border-border-line text-text-primary">
                <SelectValue placeholder="Telegram Status" />
              </SelectTrigger>
              <SelectContent className="bg-card-background border-border-line">
                <SelectItem
                  value="all"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  All Telegram
                </SelectItem>
                <SelectItem
                  value="connected"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  Connected
                </SelectItem>
                <SelectItem
                  value="not_connected"
                  className="text-text-primary hover:bg-muted focus:bg-muted"
                >
                  None
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-hidden border rounded-md border-border-line">
          <Table className="w-full">
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border-line">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-10 text-text-secondary whitespace-nowrap"
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
              {isUserLoading ? (
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

        <EditUserSheet
          user={editingUser}
          isOpen={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          onUserUpdated={onDataRefresh}
        />
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
