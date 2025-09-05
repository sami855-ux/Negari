import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  Bell,
  Trash2,
  CheckCircle,
  Circle,
  Square,
  CheckSquare,
  Filter,
  ChevronDown,
  Clock,
  User,
  AlertCircle,
  Settings,
  Workflow,
} from "lucide-react-native"
import { useSelector, useDispatch } from "react-redux"
import {
  selectNotifications,
  selectUnreadCount,
  selectIsLoading,
  selectError,
  fetchNotifications,
  markAllAsRead,
  deleteNotification,
  deleteSelectedNotifications,
  markAsRead,
  clearError,
} from "../../store/slices/notification"

// Filter options
const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "system", label: "System Alerts" },
  { key: "updates", label: "Updates" },
  { key: "assigned", label: "Assigned" },
]

const NotificationScreen = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectNotifications)
  const unreadCount = useSelector(selectUnreadCount)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)

  const [refreshing, setRefreshing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectMode, setSelectMode] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])

  // Load notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        { text: "OK", onPress: () => dispatch(clearError()) },
      ])
    }
  }, [error, dispatch])

  // Refresh notifications
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    dispatch(fetchNotifications())
      .unwrap()
      .finally(() => setRefreshing(false))
  }, [dispatch])

  // Mark all as read
  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  // Toggle select mode
  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
    if (selectMode) {
      setSelectedItems([]) // Clear selection when exiting select mode
    }
  }

  // Toggle selection of a notification
  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Select all notifications
  const selectAll = () => {
    setSelectedItems(notifications.map((notification) => notification.id))
  }

  // Delete selected notifications
  const deleteSelected = () => {
    Alert.alert(
      "Delete Notifications",
      `Are you sure you want to delete ${selectedItems.length} notification(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteSelectedNotifications(selectedItems))
            setSelectedItems([])
            setSelectMode(false)
          },
        },
      ]
    )
  }

  // Delete a single notification
  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id))
  }

  // Mark a single notification as read
  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id))
  }

  // Get filtered notifications based on current filter
  const getFilteredNotifications = () => {
    switch (selectedFilter) {
      case "unread":
        return notifications.filter((n) => !n.isRead)
      case "system":
        return notifications.filter(
          (n) => n.type === "SYSTEM_ALERT" || n.type === "SYSTEM_CHECK"
        )
      case "updates":
        return notifications.filter(
          (n) => n.type === "STATUS_UPDATED" || n.type === "USER_UPDATED"
        )
      case "assigned":
        return notifications.filter(
          (n) => n.type === "ASSIGNED_TO_YOU" || n.type === "ASSIGNED_WORKER"
        )
      default:
        return notifications
    }
  }

  // Group notifications by read status
  const groupNotificationsByReadStatus = (notificationsList) => {
    const unread = notificationsList.filter((n) => !n.isRead)
    const read = notificationsList.filter((n) => n.isRead)
    return { unread, read }
  }

  // Format date to human readable format
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date)
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  // Get icon based on notification type
  const getIconForType = (type) => {
    switch (type) {
      case "NEW_REPORT":
        return <AlertCircle size={20} color="#3B82F6" />
      case "STATUS_UPDATED":
        return <Settings size={20} color="#3B82F6" />
      case "ASSIGNED_TO_YOU":
      case "ASSIGNED_WORKER":
        return <User size={20} color="#3B82F6" />
      case "SYSTEM_ALERT":
      case "SYSTEM_CHECK":
        return <AlertCircle size={20} color="#EF4444" />
      case "ROLE_PERMISSION_UPDATE":
        return <Settings size={20} color="#3B82F6" />
      case "USER_UPDATED":
        return <User size={20} color="#3B82F6" />
      case "REPORT_REOPENED":
        return <Workflow size={20} color="#3B82F6" />
      case "FEEDBACK":
        return <AlertCircle size={20} color="#3B82F6" />
      case "WORK_TO_COMPLETE":
        return <Workflow size={20} color="#3B82F6" />
      default:
        return <Bell size={20} color="#3B82F6" />
    }
  }

  // Render a single notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => !item.isRead && !selectMode && handleMarkAsRead(item.id)}
      activeOpacity={0.7}
    >
      <Animated.View
        className={`bg-white rounded-lg p-4 mb-2 shadow-sm border-l-4 ${
          item.isRead ? "border-transparent" : "border-blue-500"
        } ${selectMode ? "pl-2" : ""}`}
      >
        <View className="flex-row items-start">
          {selectMode && (
            <TouchableOpacity
              onPress={() => toggleSelectItem(item.id)}
              className="mt-1 mr-3"
            >
              {selectedItems.includes(item.id) ? (
                <CheckSquare size={20} color="#3B82F6" />
              ) : (
                <Square size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          )}

          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              {getIconForType(item.type)}
              <Text
                className={`ml-2 text-sm font-semibold ${
                  item.isRead ? "text-gray-700" : "text-gray-900"
                }`}
              >
                {item.type.replace(/_/g, " ")}
              </Text>
            </View>

            <Text
              className={`text-base mb-2 ${
                item.isRead ? "text-gray-700" : "text-gray-900 font-medium"
              }`}
            >
              {item.message}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Clock size={14} color="#9CA3AF" />
                <Text className="ml-1 text-xs text-gray-500">
                  {formatDate(item.createdAt)}
                </Text>

                {item.createdBy && (
                  <>
                    <Text className="mx-1 text-xs text-gray-500">•</Text>
                    <User size={14} color="#9CA3AF" />
                    <Text className="ml-1 text-xs text-gray-500">
                      {item.createdBy.username}
                    </Text>
                  </>
                )}
              </View>

              {!selectMode && (
                <TouchableOpacity
                  onPress={() => handleDeleteNotification(item.id)}
                >
                  <Trash2 size={16} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  )

  // Render section header
  const renderSectionHeader = (title, count) => (
    <View className="px-4 py-2 bg-gray-50">
      <Text className="text-sm font-medium text-gray-700">
        {title} • {count}
      </Text>
    </View>
  )

  // Get filtered and grouped notifications
  const filteredNotifications = getFilteredNotifications()
  const { unread, read } = groupNotificationsByReadStatus(filteredNotifications)

  if (isLoading && notifications.length === 0) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-100">
        <Text className="text-lg text-gray-600">Loading notifications...</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 py-4 bg-white shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            Notifications
          </Text>

          <View className="flex-row">
            {unreadCount > 0 && (
              <View className="px-2 py-1 mr-2 bg-blue-500 rounded-full">
                <Text className="text-xs font-bold text-white">
                  {unreadCount}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={toggleSelectMode}
              className="p-2 bg-gray-100 rounded-full"
            >
              {selectMode ? (
                <CheckSquare size={20} color="#3B82F6" />
              ) : (
                <Square size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Bar */}
        <View className="flex-row justify-between">
          <View className="flex-row flex-wrap">
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setSelectedFilter(option.key)}
                className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                  selectedFilter === option.key ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <Text
                  className={
                    selectedFilter === option.key
                      ? "text-white text-sm font-medium"
                      : "text-gray-700 text-sm"
                  }
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Action Bar (visible in select mode) */}
      {selectMode && (
        <View className="flex-row items-center justify-between px-4 py-3 bg-blue-50">
          <View className="flex-row items-center">
            <Text className="mr-4 font-medium text-blue-700">
              {selectedItems.length} selected
            </Text>

            <TouchableOpacity onPress={selectAll} className="mr-4">
              <Text className="text-blue-500">Select All</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={deleteSelected}
              className="px-3 py-1 mr-2 bg-red-500 rounded"
            >
              <Text className="text-white">Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleSelectMode}
              className="px-3 py-1 bg-blue-500 rounded"
            >
              <Text className="text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={[]} // We'll use ListHeaderComponent and ListFooterComponent for sections
          renderItem={null}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            unread.length > 0 ? (
              <>
                {renderSectionHeader("Unread", unread.length)}
                {unread.map((item) => (
                  <View key={item.id}>{renderNotificationItem({ item })}</View>
                ))}
              </>
            ) : null
          }
          ListFooterComponent={
            read.length > 0 ? (
              <>
                {renderSectionHeader("Read", read.length)}
                {read.map((item) => (
                  <View key={item.id}>{renderNotificationItem({ item })}</View>
                ))}
              </>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        // Empty State
        <View className="items-center justify-center flex-1 px-10">
          <Bell size={64} color="#D1D5DB" />
          <Text className="mt-4 text-xl font-bold text-center text-gray-500">
            No notifications yet
          </Text>
          <Text className="mt-2 text-center text-gray-400">
            {selectedFilter !== "all"
              ? `You don't have any ${FILTER_OPTIONS.find(
                  (f) => f.key === selectedFilter
                )?.label.toLowerCase()} notifications`
              : "We'll notify you when something arrives"}
          </Text>

          {selectedFilter !== "all" && (
            <TouchableOpacity
              onPress={() => setSelectedFilter("all")}
              className="px-4 py-2 mt-4 bg-blue-500 rounded-lg"
            >
              <Text className="font-medium text-white">
                View All Notifications
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Mark All as Read Button (only when there are unread notifications) */}
      {unreadCount > 0 && !selectMode && (
        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          className="absolute p-3 bg-blue-500 rounded-full shadow-lg bottom-4 right-4"
        >
          <CheckCircle size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default NotificationScreen
