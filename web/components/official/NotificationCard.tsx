"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNotifications, type Notification } from "./NotificationProiveder"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  MessageCircle,
  UserPlus,
  Star,
  Info,
  Gift,
  AlertTriangle,
  Zap,
  Trash2,
  MoreHorizontal,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NotificationCardProps {
  notification: Notification
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { markAsRead, deleteNotification } = useNotifications()
  const [isHovered, setIsHovered] = useState(false)

  const getNotificationIcon = () => {
    const iconClass = "h-5 w-5"

    switch (notification.type) {
      case "LIKE":
        return <Heart className={`${iconClass} text-red-500`} />
      case "COMMENT":
        return <MessageCircle className={`${iconClass} text-blue-500`} />
      case "FOLLOW":
        return <UserPlus className={`${iconClass} text-green-500`} />
      case "ACHIEVEMENT":
        return <Star className={`${iconClass} text-yellow-500`} />
      case "SYSTEM":
        return <Info className={`${iconClass} text-gray-500`} />
      case "PROMOTION":
        return <Gift className={`${iconClass} text-purple-500`} />
      case "MESSAGE":
        return <MessageCircle className={`${iconClass} text-blue-500`} />
      case "REMINDER":
        return <AlertTriangle className={`${iconClass} text-orange-500`} />
      default:
        return <Zap className={`${iconClass} text-gray-500`} />
    }
  }

  const getTypeColor = () => {
    switch (notification.type) {
      case "LIKE":
        return "from-red-400 to-pink-400"
      case "COMMENT":
        return "from-blue-400 to-cyan-400"
      case "FOLLOW":
        return "from-green-400 to-emerald-400"
      case "ACHIEVEMENT":
        return "from-yellow-400 to-orange-400"
      case "SYSTEM":
        return "from-gray-400 to-slate-400"
      case "PROMOTION":
        return "from-purple-400 to-violet-400"
      default:
        return "from-gray-400 to-slate-400"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300
        ${
          notification.isRead
            ? "bg-white/40 border-white/20"
            : "bg-white/70 border-white/30 shadow-lg"
        }
        ${isHovered ? "shadow-xl" : ""}
      `}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${getTypeColor()}`}
        />
      )}

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar or Icon */}
          <div className="flex-shrink-0">
            {notification.createdBy ? (
              <Avatar className="h-12 w-12 ring-2 ring-white/50">
                <AvatarImage
                  src={notification.createdBy.avatar || "/placeholder.svg"}
                />
                <AvatarFallback
                  className={`bg-gradient-to-r ${getTypeColor()} text-white font-semibold`}
                >
                  {notification.createdBy.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div
                className={`h-12 w-12 rounded-full bg-gradient-to-r ${getTypeColor()} flex items-center justify-center`}
              >
                {getNotificationIcon()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p
                  className={`text-sm leading-relaxed ${
                    notification.isRead
                      ? "text-gray-600"
                      : "text-gray-900 font-medium"
                  }`}
                >
                  {notification.message}
                </p>

                {/* Metadata */}
                {notification.metadata && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-3 bg-gray-50/50 rounded-lg"
                  >
                    {notification.type === "COMMENT" &&
                      notification.metadata.comment && (
                        <p className="text-xs text-gray-600 italic">
                          {notification.metadata.comment}
                        </p>
                      )}
                    {notification.type === "ACHIEVEMENT" &&
                      notification.metadata.badge && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {notification.metadata.badge}
                          </span>
                          <span className="text-xs text-gray-600">
                            Achievement unlocked!
                          </span>
                        </div>
                      )}
                    {notification.type === "PROMOTION" &&
                      notification.metadata.code && (
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-700"
                          >
                            {notification.metadata.code}
                          </Badge>
                          <span className="text-xs text-gray-600">
                            {notification.metadata.discount}% off
                          </span>
                        </div>
                      )}
                  </motion.div>
                )}

                <div className="flex items-center space-x-3 mt-3">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {notification.type.toLowerCase()}
                  </Badge>
                  {!notification.isRead && (
                    <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                      New
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/90 backdrop-blur-lg border-white/20"
                >
                  <DropdownMenuItem
                    onClick={() => markAsRead(notification.id)}
                    className="flex items-center space-x-2"
                  >
                    {notification.isRead ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span>
                      Mark as {notification.isRead ? "unread" : "read"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteNotification(notification.id)}
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  )
}
