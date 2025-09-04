"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
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
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import {
  deleteNotificationEach,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notification"

export type NotificationType =
  | "NEW_REPORT"
  | "STATUS_UPDATED"
  | "ASSIGNED_TO_YOU"
  | "SYSTEM_ALERT"
  | "SYSTEM_CHECK"
  | "ROLE_PERMISSION_UPDATE"
  | "USER_UPDATED"
  | "ASSIGNED_WORKER"
  | "REPORT_REOPENED"
  | "FEEDBACK"
  | "WORK_TO_COMPLETE"

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
    username: string
    profilePicture?: string
  }
  createdAt: Date
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
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

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useSelector((store: RootState) => store.user)

  const { data, isLoading } = useQuery<Notification[]>({
    queryKey: ["Notifications_for_user"],
    queryFn: () => getUserNotifications(user?.user?.id),
    enabled: !!user?.user?.id,
  })

  const [notifications, setNotifications] = useState<Notification[]>([])

  const [toastNotifications, setToastNotifications] = useState<Notification[]>(
    []
  )

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsRead(id)
      if (res) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await markAllNotificationsAsRead(user?.user?.id)
      if (res) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const res = await deleteNotificationEach(id)

      if (res) {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }
    } catch (error) {
      console.log(error)
    }
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

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setNotifications(data)
    } else {
      setNotifications([])
    }
  }, [data])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
        isLoading,
      }}
    >
      {children}

      {/* Toast Notifications */}
      <div className="fixed z-50 space-y-2 top-4 right-4">
        <AnimatePresence>
          {toastNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ x: 400, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 400, opacity: 0, scale: 0.8 }}
              className="max-w-sm p-4 border shadow-lg bg-white/90 backdrop-blur-lg border-white/20 rounded-xl"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Just now</p>
                </div>
                <button
                  onClick={() => removeToast(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
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
