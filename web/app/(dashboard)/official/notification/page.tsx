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
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
  const [showFilters, setShowFilters] = useState(false)
  const [notificationTypes, setNotificationTypes] = useState({
    like: true,
    comment: true,
    follow: true,
    achievement: true,
    system: true,
    promotion: true,
  })

  // Filter notifications based on search, tab, and type filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.isRead) ||
      (activeTab === "read" && notification.isRead) ||
      notification.type.toLowerCase() === activeTab

    return matchesTab
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

  const notificationCounts = {
    all: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
  }

  const toggleNotificationType = (type: keyof typeof notificationTypes) => {
    setNotificationTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <div className="container max-w-4xl px-4 py-3 mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 px-2 py-5 mb-2 bg-white rounded-md md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 ">
          <div className="p-2 rounded-full bg-primary/10">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Stay updated with your latest activities
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="default" className="px-2 py-1 ml-2">
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
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </Button>
      </div>

      {/* Filters and Tabs */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col justify-between gap-6 p-4 md:flex-row md:items-center">
              <TabsList className="w-full mr-2 overflow-x-auto md:w-auto">
                <TabsTrigger value="all" className="relative mx-3 px-7">
                  All
                  {notificationCounts.all > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                      {notificationCounts.all}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative mx-3 px-7">
                  Unread
                  {notificationCounts.unread > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                      {notificationCounts.unread}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read" className="relative mx-3 px-7">
                  Read
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <Select
                  value={sortBy}
                  onValueChange={(val) => setSortBy(val as any)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="unread">Unread first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification List */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value={activeTab} className="mt-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[250px]" />
                          <div className="flex gap-2">
                            <Skeleton className="w-16 h-4" />
                            <Skeleton className="w-16 h-4" />
                          </div>
                        </div>
                        <Skeleton className="w-8 h-8 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : sortedNotifications.length > 0 ? (
              <motion.div key={activeTab} className="space-y-4">
                <div className="mb-2 text-sm text-muted-foreground">
                  {sortedNotifications.length} notification
                  {sortedNotifications.length !== 1 ? "s" : ""}
                </div>
                {sortedNotifications.map((notification) => (
                  <motion.div key={notification.id}>
                    <NotificationCard notification={notification} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg"
              >
                <div className="p-4 mb-4 rounded-full bg-muted">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  No notifications found
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  {searchQuery ||
                  !Object.values(notificationTypes).includes(true)
                    ? "Try adjusting your search terms or enabling more notification types"
                    : "You're all caught up! New notifications will appear here."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  )
}
