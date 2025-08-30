"use client"

import { use, useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  PlusCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Eye,
  Trash,
  PencilIcon,
  Pencil,
} from "lucide-react"

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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/services/category"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { original } from "@reduxjs/toolkit"
import { DeleteModal } from "./Modal"

interface Category {
  id: string
  name: string
  description: string
  icon: string | null
  color: string | null
  createdAt: string
}
const mockCategories: Category[] = [
  {
    id: "99dd8b52-2c0f-4116-9ec3-f83aef1e074d",
    name: "NOISE",
    description: "Pollution, deforestation, illegal dumping, green areas.",
    icon: null,
    color: null,
    createdAt: "2025-07-24T17:16:43.753Z",
  },
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    name: "WATER QUALITY",
    description: "Monitoring water purity in rivers and lakes.",
    icon: null,
    color: null,
    createdAt: "2025-07-23T10:30:00.000Z",
  },
  {
    id: "f0e9d8c7-b6a5-4321-fedc-ba9876543210",
    name: "AIR POLLUTION",
    description: "Tracking airborne particles and gases.",
    icon: null,
    color: null,
    createdAt: "2025-07-22T08:00:00.000Z",
  },
  {
    id: "1a2b3c4d-5e6f-7890-abcd-ef1234567890",
    name: "BIODIVERSITY",
    description: "Protecting endangered species and habitats.",
    icon: null,
    color: null,
    createdAt: "2025-07-21T14:45:00.000Z",
  },
]

export default function CategoriesTable(
  { data, isLoading } = { data: [], isLoading: false }
) {
  const queryClient = useQueryClient()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [globalFilter, setGlobalFilter] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [itemId, setItemId] = useState("")

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [isGettingCategory, setIsGettingCategory] = useState(false)

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-gray-700">
          {`${row.getValue("id")}.`.slice(0, 8)}...
        </Badge>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Badge className="font-semibold text-orange-600 bg-orange-100 font-jakarta hover:bg-orange-200">
          {`${row.getValue("name")}`.charAt(0).toUpperCase() +
            `${row.getValue("name")}`.slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-gray-600 line-clamp-2 text-[15px]">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return <div className="text-sm text-gray-500">{formatDate(date)}</div>
      },
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
                      handleGetCategory(row.original.id)
                      setIsEditSheetOpen(true)
                    }}
                  >
                    <Pencil className="w-6 h-6" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-sm">
                  <p>Edit category details</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      setItemId(row.original.id)
                      setIsDeleteModalOpen(true)
                    }}
                  >
                    <Trash className="w-6 h-6" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-sm">
                  <p>Delete Category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  })

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryDescription) {
      toast.error("Please fill in all fields.")
      return
    }

    const categoryData = {
      name: newCategoryName.toUpperCase(),
      description: newCategoryDescription,
      icon: null,
      color: null,
    }

    try {
      setIsSaving(true)
      const res = await createCategory(categoryData)

      if (res.success) {
        toast.success("Category added successfully!")

        queryClient.invalidateQueries({ queryKey: ["All_categories"] })

        setNewCategoryName("")
        setNewCategoryDescription("")
        setIsSheetOpen(false)

        return
      } else {
        toast.error(res.message || "Failed to create category")
        return
      }
    } catch (err) {
      toast.error(err.message || "Failed to create category")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteItem = async (id: string) => {
    setIsDeleting(true)
    try {
      // Simulate API call
      const res = await deleteCategory(id)

      // Your actual delete logic would go here
      console.log("Deleted item with ID:", id)

      if (res.success) {
        setIsSuccess(true)
        toast.success("Category deleted successfully!")

        queryClient.invalidateQueries({ queryKey: ["All_categories"] })
        // Close modal after 1 second
        setTimeout(() => {
          setIsDeleteModalOpen(false)
          setIsSuccess(false)
          setItemId("")
        }, 1000)

        return
      } else {
        toast.error("Failed to delete category")
        return
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed")
    } finally {
      setIsDeleting(false)
    }
  }

  //Get Category by Id
  const handleGetCategory = async (id: string) => {
    setItemId(id)
    setIsGettingCategory(true)

    try {
      const res = await getCategoryById(id)

      if (res.success) {
        setNewCategoryName(res.category.name)
        setNewCategoryDescription(res.category.description)
      } else {
        return toast.error(res.message || "Failed to fetch category details")
      }
    } catch (error) {
      console.log(error)
      return toast.error("Failed to fetch category details")
    } finally {
      setIsGettingCategory(false)
    }
  }

  //Edit Category
  const handleEditCategory = async () => {
    if (!newCategoryName || !newCategoryDescription) {
      toast.error("Please fill in all fields.")
      return
    }
    const categoryData = {
      name: newCategoryName.toUpperCase(),
      description: newCategoryDescription,
      icon: null,
      color: null,
    }

    try {
      setIsSaving(true)
      const res = await updateCategory(itemId, categoryData)

      if (res.success) {
        toast.success("Category updated successfully!")
        queryClient.invalidateQueries({ queryKey: ["All_categories"] })

        setIsEditSheetOpen(false)
        setItemId("")
        return
      } else {
        toast.error(res.message || "Failed to update category")
        return
      }
    } catch (err) {
      toast.error(err.message || "Failed to update category")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="container px-6 mx-auto py-9">
        {/* Controls Bar */}
        <div className="flex flex-col justify-between gap-4 mb-6 rounded-lg md:flex-row md:items-center">
          <div className="flex items-center w-full gap-2 md:w-auto">
            <div className="relative flex-1 md:flex-none md:w-80">
              <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <Input
                placeholder="Search categories..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="gap-2 bg-blue-500 hover:bg-blue-700"
                onClick={() => {
                  setNewCategoryDescription("")
                  setNewCategoryName("")
                }}
              >
                <PlusCircle className="w-4 h-4" />
                Add Category
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Category</SheetTitle>
                <SheetDescription>
                  Fill in the details for the new category. Click save when
                  you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-8">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Air Quality"
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    placeholder="e.g., Monitoring air pollutants and emissions."
                    className="focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button
                  type="submit"
                  disabled={isSaving}
                  onClick={handleAddCategory}
                  className="w-full text-white bg-primary-accent hover:bg-primary-accent/90"
                >
                  {isSaving && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Category</SheetTitle>
                <SheetDescription>
                  Update the details for the category. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>

              {isGettingCategory ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Loader2 className="w-6 h-6 text-gray-700 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-4 py-8">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Air Quality"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCategoryDescription}
                      onChange={(e) =>
                        setNewCategoryDescription(e.target.value)
                      }
                      placeholder="e.g., Monitoring air pollutants and emissions."
                      className="focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
                <Button
                  type="submit"
                  disabled={isSaving}
                  onClick={handleEditCategory}
                  className="w-full text-white bg-primary-accent hover:bg-primary-accent/90"
                >
                  {isSaving && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Table */}
        <div className="overflow-hidden border rounded-lg shadow-sm">
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

        {/* Pagination and Summary */}
        <div className="flex flex-col items-center justify-between gap-4 p-4 mt-6 rounded-lg md:flex-row bg-blue-50">
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
            of {table.getFilteredRowModel().rows.length} categories
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
              <SelectTrigger className="h-8 w-[70px] focus:ring-2 focus:ring-blue-500">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </>
  )
}
