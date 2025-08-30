"use client"

import * as React from "react"
import { UserTable } from "@/components/admin/userTable"
import useGetUsers from "@/hooks/useGetUsers"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShieldCheck, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function AdminUsersPage() {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const { isLoading, users, refetch } = useGetUsers()
  const isUserLoading = isLoading

  const refreshUserData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      toast.success("Users refreshed successfully!")
    } catch {
      toast.error("Error while refreshing users!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen text-text-primary">
      <Card className="mb-4 bg-white shadow-none border-slate-200 dark:border-slate-700 dark:bg-slate-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 dark:text-slate-100">
                <ShieldCheck className="text-blue-600 h-7 w-7 dark:text-slate-400" />
                User management
                <Badge variant="secondary" className="ml-2 font-medium">
                  users
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                View and manage users here
              </CardDescription>
            </div>
            <div className="flex items-center">
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

      <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-0">
        {/* Horizontally scrollable on mobile */}
        <div className="-mx-4 md:mx-0">
          <div
            className="w-full overflow-x-auto overscroll-x-contain"
            role="region"
            aria-label="Users table"
            tabIndex={0}
          >
            {/* Force width > viewport on mobile to enable side scroll */}
            <div className="min-w-[700px] md:min-w-full rounded-lg border border-slate-200 dark:border-slate-700 overflow-y-hidden">
              <UserTable
                data={users}
                onDataRefresh={refreshUserData}
                isUserLoading={isUserLoading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
