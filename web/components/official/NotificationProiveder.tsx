"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  AlertTriangle,
  Info,
  Heart,
  Gift,
  MessageCircle,
  UserPlus,
  Star,
  Zap,
} from "lucide-react"

export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW"
  | "MESSAGE"
  | "SYSTEM"
  | "ACHIEVEMENT"
  | "REMINDER"
  | "PROMOTION"

export interface Notification {
  id: string
  recipientId: string
  type: NotificationType
  message: string
  metadata?: any
  isRead: boolean
  createdById?: string
  createdBy?: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    )
  }
  return context
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: "1",
    recipientId: "user1",
    type: "LIKE",
    message: "Sarah liked your post about React development",
    isRead: false,
    createdById: "user2",
    createdBy: {
      id: "user2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: "2",
    recipientId: "user1",
    type: "COMMENT",
    message: "Mike commented on your project showcase",
    metadata: {
      postId: "post123",
      comment: "This looks amazing! Great work on the UI design.",
    },
    isRead: false,
    createdById: "user3",
    createdBy: {
      id: "user3",
      name: "Mike Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: "3",
    recipientId: "user1",
    type: "FOLLOW",
    message: "Emma started following you",
    isRead: true,
    createdById: "user4",
    createdBy: {
      id: "user4",
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "4",
    recipientId: "user1",
    type: "ACHIEVEMENT",
    message: "Congratulations! You've reached 1000 followers",
    metadata: { achievement: "1k_followers", badge: "🎉" },
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "5",
    recipientId: "user1",
    type: "SYSTEM",
    message: "Your account security has been updated",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "6",
    recipientId: "user1",
    type: "PROMOTION",
    message: "Special offer: 50% off premium features this week!",
    metadata: { discount: 50, code: "PREMIUM50" },
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications)
  const [toastNotifications, setToastNotifications] = useState<Notification[]>(
    []
  )

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])
    setToastNotifications((prev) => [...prev, newNotification])

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToastNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      )
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toastNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ x: 400, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.8 }}
              className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-lg max-w-sm"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
                <button
                  onClick={() => removeToast(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  )
}

function getNotificationIcon(type: NotificationType) {
  const iconClass = "h-5 w-5"

  switch (type) {
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
