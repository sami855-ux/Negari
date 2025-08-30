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
import { Archive, RefreshCw, ShieldCheck, User } from "lucide-react"
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
      }, 500) // Optional delay to show the spin briefly
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen text-text-primary">
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mb-4 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 dark:text-slate-100">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-slate-400" />
                User management
                <Badge variant="secondary" className="ml-2 font-medium">
                  users
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                View and manage users here
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={refreshUserData}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="gap-2 bg-transparent flex items-center"
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
        <UserTable
          data={users}
          onDataRefresh={refreshUserData}
          isUserLoading={isUserLoading}
        />
      </main>
    </div>
  )
}
