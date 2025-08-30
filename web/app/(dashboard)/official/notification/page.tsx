"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotifications } from "@/components/official/NotificationProiveder"
import { NotificationCard } from "@/components/official/NotificationCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCheck,
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  Settings,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface NotificationCenterProps {
  searchQuery: string
}

export default function NotificationCenter({
  searchQuery,
}: NotificationCenterProps) {
  const { notifications, unreadCount, markAllAsRead, isLoading } =
    useNotifications()
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "unread">("newest")

  // Filter notifications based on search and tab
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.message.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      notification.createdBy?.name
        .toLowerCase()
        .includes(searchQuery?.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.isRead) ||
      (activeTab === "read" && notification.isRead) ||
      notification.type.toLowerCase() === activeTab

    return matchesSearch && matchesTab
  })

  // Sort notifications
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "unread":
        if (a.isRead === b.isRead)
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        return a.isRead ? 1 : -1
      default:
        return 0
    }
  })

  const notificationStats = [
    {
      label: "Likes",
      count: notifications.filter((n) => n.type === "LIKE").length,
      icon: Heart,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Comments",
      count: notifications.filter((n) => n.type === "COMMENT").length,
      icon: MessageSquare,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Follows",
      count: notifications.filter((n) => n.type === "FOLLOW").length,
      icon: UserPlus,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "System",
      count: notifications.filter((n) => n.type === "SYSTEM").length,
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="px-2 py-1">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <Button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Notification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {notificationStats.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.color} rounded-lg p-4 flex items-center gap-3`}
              >
                <stat.icon className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              <div className="flex items-center gap-2">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="px-1.5 py-0.5">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="unread">Unread first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Notification List */}
        <TabsContent value={activeTab} className="mt-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[250px]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedNotifications.length > 0 ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {sortedNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NotificationCard notification={notification} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No notifications found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "You're all caught up!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}
