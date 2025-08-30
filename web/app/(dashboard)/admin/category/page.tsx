"use client"

import { ListTree, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoriesTable from "@/components/admin/CategoryTable"
import useGetAllCategories from "@/hooks/useGetAllCategories"
import { useState } from "react"
import toast from "react-hot-toast"

export default function HomePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isLoading, categories, refetch } = useGetAllCategories()

  const refreshUserData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      toast.success("Categories refreshed successfully!")
    } catch {
      toast.error("Error while refreshing categories!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <div className="w-full mx-auto space-y-6 max-w-7xl">
        {/* Header Card */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <ListTree className="w-5 h-5 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Categories
                  </h1>
                </div>
                <p className="max-w-3xl text-gray-600">
                  Manage all categories in the system.
                </p>
              </div>

              <div className="flex items-center gap-3">
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
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <CategoriesTable data={categories} isLoading={isLoading} />
        </div>
      </div>
    </main>
  )
}
