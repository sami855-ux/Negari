import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  X,
  ChevronDown,
  ChevronUp,
  Cog,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NotificationCardProps {
  notification: Notification
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { markAsRead, deleteNotification } = useNotifications()
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const getNotificationIcon = () => {
    const iconClass = "h-5 w-5"

    switch (notification.type) {
      case "NEW_REPORT":
        return <Cog className={`${iconClass} text-red-500 fill-red-100`} />
      case "STATUS_UPDATED":
        return (
          <MessageCircle
            className={`${iconClass} text-blue-500 fill-blue-100`}
          />
        )
      case "ASSIGNED_TO_YOU":
        return (
          <UserPlus className={`${iconClass} text-green-500 fill-green-100`} />
        )
      case "SYSTEM_ALERT":
        return (
          <Star className={`${iconClass} text-yellow-500 fill-yellow-100`} />
        )
      case "SYSTEM_CHECK":
        return <Info className={`${iconClass} text-gray-500 fill-gray-100`} />
      case "ROLE_PERMISSION_UPDATE":
        return (
          <Gift className={`${iconClass} text-purple-500 fill-purple-100`} />
        )
      default:
        return <Zap className={`${iconClass} text-gray-500 fill-gray-100`} />
    }
  }

  const getTypeColor = () => {
    switch (notification.type) {
      case "NEW_REPORT":
        return "bg-red-50 border-l-red-400"
      case "STATUS_UPDATED":
        return "bg-blue-50 border-l-blue-400"
      case "ASSIGNED_TO_YOU":
        return "bg-green-50 border-l-green-400"
      case "SYSTEM_ALERT":
        return "bg-yellow-50 border-l-yellow-400"
      case "SYSTEM_CHECK":
        return "bg-gray-50 border-l-gray-400"
      case "ROLE_PERMISSION_UPDATE":
        return "bg-purple-50 border-l-purple-400"
      default:
        return "bg-gray-50 border-l-gray-400"
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

  const handleCardClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.metadata) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <motion.div
      layout
      animate={{ opacity: 1, x: 0 }}
      exit={{
        opacity: 0,
        x: -20,
        transition: { duration: 0.25, ease: "easeInOut" },
      }}
      initial={{ opacity: 0, x: 20 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.8,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-md border border-gray-300 transition-all duration-300 cursor-pointer bg-white/50",
        "border-l-4 shadow-sm hover:shadow-md",
        notification.isRead ? "opacity-80" : "opacity-100"
      )}
      onClick={handleCardClick}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon with modern background */}
          <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-white border rounded-lg shadow-sm">
              {getNotificationIcon()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {notification.createdBy && (
                    <span className="text-sm font-medium text-gray-900">
                      {notification.createdBy.username}
                    </span>
                  )}
                  <Badge
                    variant="outline"
                    className="px-2 py-1 text-xs font-normal text-green-700 bg-green-200 border border-green-200 rounded-md"
                  >
                    {notification.type.toLowerCase()}
                  </Badge>
                </div>

                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    notification.isRead
                      ? "text-gray-600"
                      : "text-gray-900 font-medium"
                  )}
                >
                  {notification.message}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(new Date(notification.createdAt))}
                  </span>

                  {notification.metadata && (
                    <button
                      className="flex items-center gap-1 text-xs text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsExpanded(!isExpanded)
                      }}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={12} /> Less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} /> More
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 transition-opacity rounded-full opacity-70 hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="p-1 border border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm rounded-xl"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer"
                  >
                    {notification.isRead ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>
                      Mark as {notification.isRead ? "unread" : "read"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md cursor-pointer focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Expandable metadata */}
        <AnimatePresence>
          {isExpanded && notification.metadata && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 overflow-hidden"
            >
              <div className="p-3 border rounded-lg bg-white/80"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  )
}
