import React from "react"
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StatusBar,
} from "react-native"
import {
  X,
  Mail,
  Phone,
  BadgeInfo,
  Clock,
  Shield,
  MessageCircle,
} from "lucide-react-native"

// Color palette for consistency
const COLORS = {
  primary: "#4361EE",
  secondary: "#7209B7",
  accent: "#06D6A0",
  background: "#F8F9FA",
  card: "#FFFFFF",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  success: "#48BB78",
  warning: "#ED8936",
  error: "#F56565",
  border: "#E2E8F0",
}

export default function UserModal({ visible, user, onClose }) {
  if (!user) return null

  // Format last seen time
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Unknown"
    const now = new Date()
    const lastSeenDate = new Date(lastSeen)
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Get role badge style
  const getRoleBadgeStyle = (role) => {
    const roleLower = role.toLowerCase()

    if (roleLower.includes("police") || roleLower.includes("officer")) {
      return {
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        color: "#2563EB",
        icon: <Shield size={16} color="#2563EB" />,
      }
    } else if (roleLower.includes("citizen")) {
      return {
        backgroundColor: "rgba(6, 214, 160, 0.15)",
        color: "#059669",
        icon: <BadgeInfo size={16} color="#059669" />,
      }
    } else {
      return {
        backgroundColor: "rgba(107, 114, 128, 0.15)",
        color: "#6B7280",
        icon: <BadgeInfo size={16} color="#6B7280" />,
      }
    }
  }

  const badgeStyle = getRoleBadgeStyle(user.role)
  const formattedRole =
    `${user.role}`.charAt(0) + `${user.role}`.slice(1).toLowerCase()
  const isOnline = user.isOnline

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900 font-geist">
              Profile Details
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <View className="p-6" style={{ maxHeight: "80%" }}>
            {/* Profile Section */}
            <View className="items-center mb-6">
              <View className="relative mb-4">
                <Image
                  source={{ uri: user.profilePicture }}
                  className="w-32 h-32 rounded-full border-4"
                  style={{ borderColor: COLORS.border }}
                />
                {/* Online Status */}
                {isOnline && (
                  <View className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white bg-green-500" />
                )}
              </View>

              <Text className="text-2xl font-bold text-gray-900 font-geist mb-2">
                {user.username}
              </Text>

              {/* Role Badge */}
              <View
                className="flex-row items-center px-4 py-2 rounded-full mb-3"
                style={{ backgroundColor: badgeStyle.backgroundColor }}
              >
                {badgeStyle.icon}
                <Text
                  className="ml-2 font-semibold font-jakarta"
                  style={{ color: badgeStyle.color }}
                >
                  {formattedRole}
                </Text>
              </View>

              {/* Online Status */}
              <View className="flex-row items-center">
                <View
                  className={`w-3 h-3 rounded-full mr-2 ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                />
                <Text className="text-sm text-gray-600 font-geist">
                  {isOnline
                    ? "Online now"
                    : `Last seen ${formatLastSeen(user.lastSeen)}`}
                </Text>
              </View>
            </View>

            {/* Information Cards */}
            <View className="space-y-4">
              {/* Contact Card */}
              <View className="p-4 rounded-xl bg-gray-50">
                <Text className="text-sm font-semibold text-gray-500 uppercase font-geist mb-3">
                  CONTACT INFORMATION
                </Text>

                <View className="space-y-3">
                  <View className="flex-row items-center">
                    <View className="p-2 rounded-lg bg-white mr-3">
                      <Mail size={18} color={COLORS.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 font-geist">
                        Email
                      </Text>
                      <Text
                        className="text-gray-900 font-geist"
                        numberOfLines={1}
                      >
                        {user.email || "email@example.com"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Status Card */}
              <View className="p-4 rounded-xl bg-gray-50">
                <Text className="text-sm font-semibold text-gray-500 uppercase font-geist mb-3">
                  STATUS
                </Text>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="p-2 rounded-lg bg-white mr-3">
                      <Clock size={18} color={COLORS.primary} />
                    </View>
                    <View>
                      <Text className="text-xs text-gray-500 font-geist">
                        Availability
                      </Text>
                      <Text className="text-gray-900 font-geist">
                        {user.role === "OFFICER" ? "On Duty" : "Available"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <View className="p-2 rounded-lg bg-white mr-3">
                      <MessageCircle size={18} color={COLORS.primary} />
                    </View>
                    <View>
                      <Text className="text-xs text-gray-500 font-geist">
                        Response Time
                      </Text>
                      <Text className="text-gray-900 font-geist">
                        {user.role === "OFFICER" ? "Within 15min" : "Varies"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* About Card */}
              <View className="p-4 rounded-xl bg-gray-50">
                <Text className="text-sm font-semibold text-gray-500 uppercase font-geist mb-3">
                  ABOUT
                </Text>
                <Text className="text-gray-700 font-geist leading-6">
                  {user.role === "OFFICER"
                    ? "Dedicated law enforcement professional committed to community safety and prompt response to citizen concerns."
                    : "Active community member using this platform to report issues and communicate with local authorities."}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
