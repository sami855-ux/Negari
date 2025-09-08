import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Animated,
  Easing,
} from "react-native"
import { useMessage } from "../../../components/MessageContext"
import { useNavigation } from "@react-navigation/native"
import {
  ChevronRight,
  MessageCircle,
  MoreVertical,
  Search,
  UserPlus,
  Shield,
} from "lucide-react-native"
import { TextInput } from "react-native"
import { useRouter } from "expo-router"

// Beautiful color palette
const COLORS = {
  primary: "#4361EE", // Vibrant blue
  secondary: "#7209B7", // Purple
  accent: "#06D6A0", // Teal green
  background: "#F8F9FA", // Light gray background
  card: "#FFFFFF", // White cards
  textPrimary: "#2D3748", // Dark gray text
  textSecondary: "#718096", // Medium gray text
  online: "#48BB78", // Green for online status
  offline: "#A0AEC0", // Gray for offline
  unread: "#EF4444", // Red for unread count
  border: "#E2E8F0", // Light border
}

const user = {
  id: "1",
  username: "samuel tale",
  role: "CITIZEN",
  profilePicture:
    "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
}

export default function ConversationListScreen() {
  const { messagedUsers, fetchMessagedUsers, messages, onlineUsers } =
    useMessage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0]
  const scaleAnim = useState(new Animated.Value(0.9))[0]

  // Fetch conversations on mount
  useEffect(() => {
    loadConversations()
    startAnimations()
  }, [])

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start()
  }

  const loadConversations = async () => {
    try {
      await fetchMessagedUsers()
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadConversations()
  }

  const navigateToChat = (officer) => {
    router.push({
      pathname: "/one/chat",
      params: {
        conversationId: officer.id,
        officer: JSON.stringify(officer),
      },
    })

    setShowModal(false)
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getLastMessage = (officerId) => {
    const conversationId = [user.id, officerId].sort().join("_")
    const conversationMessages = messages[conversationId]
    if (conversationMessages?.length > 0) {
      return conversationMessages[conversationMessages.length - 1]
    }
    return null
  }

  const getUnreadCount = (officerId) => {
    const conversationId = [user.id, officerId].sort().join("_")
    const conversationMessages = messages[conversationId]
    if (!conversationMessages) return 0
    return conversationMessages.filter(
      (msg) => msg.senderId !== user.id && !msg.isRead
    ).length
  }

  const filteredUsers = messagedUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderConversationItem = ({ item, index }) => {
    const lastMessage = getLastMessage(item.id)
    const unreadCount = getUnreadCount(item.id)
    const isOnline = onlineUsers.includes(item.id)

    console.log(item)

    // Function to get badge style based on role
    const getRoleBadgeStyle = (role) => {
      const roleLower = role.toLowerCase()

      if (roleLower.includes("citizen") || roleLower.includes("officer")) {
        return {
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          color: "#2563EB",
          borderColor: "#3B82F6",
        }
      } else if (roleLower.includes("admin")) {
        return {
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          color: "#D97706",
          borderColor: "#F59E0B",
        }
      } else if (
        roleLower.includes("officer") ||
        roleLower.includes("deputy")
      ) {
        return {
          backgroundColor: "rgba(139, 92, 246, 0.15)",
          color: "#7C3AED",
          borderColor: "#8B5CF6",
        }
      } else if (
        roleLower.includes("worker") ||
        roleLower.includes("investigator")
      ) {
        return {
          backgroundColor: "rgba(236, 72, 153, 0.15)",
          color: "#DB2777",
          borderColor: "#EC4899",
        }
      } else {
        return {
          backgroundColor: "rgba(107, 114, 128, 0.15)",
          color: "#6B7280",
          borderColor: "#9CA3AF",
        }
      }
    }

    const badgeStyle = getRoleBadgeStyle(item.role)
    const formattedRole =
      `${item.role}`.charAt(0) + `${item.role}`.slice(1).toLowerCase()

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <TouchableOpacity
          className="flex-row items-center p-5 mx-4 mb-4 rounded-xl"
          style={{
            backgroundColor: COLORS.card,
          }}
          onPress={() => navigateToChat(item)}
        >
          <View className="relative">
            <Image
              source={{ uri: item.profilePicture }}
              className="w-16 h-16 mr-4 rounded-2xl"
              style={{ borderWidth: 2, borderColor: COLORS.border }}
            />
            {isOnline && (
              <View
                className="absolute bottom-0 w-3 h-3 border-2 border-white rounded-full right-3"
                style={{ backgroundColor: COLORS.online }}
              />
            )}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className="font-semibold capitalize font-jakarta"
                style={{ color: COLORS.textPrimary, fontSize: 16 }}
                numberOfLines={1}
              >
                {item.username}
              </Text>
              {(item?.lastMessage?.attachmentUrl ||
                item?.lastMessage?.content) && (
                <Text
                  className="text-xs font-jakarta"
                  style={{ color: COLORS.textSecondary }}
                >
                  {formatTime(item.lastMessage.createdAt)}
                </Text>
              )}
            </View>

            {/* Role Badge with dynamic styling */}
            <View
              className="self-start px-2 py-1 mb-1 rounded-full"
              style={{
                backgroundColor: badgeStyle.backgroundColor,
                borderWidth: 1,
                borderColor: badgeStyle.borderColor,
              }}
            >
              <Text
                className="text-xs font-semibold font-jakarta"
                style={{ color: badgeStyle.color }}
              >
                {formattedRole}
              </Text>
            </View>

            <Text
              className="text-sm font-jakarta"
              style={{
                color: COLORS.textSecondary,
                fontWeight: unreadCount > 0 ? "600" : "400",
              }}
              numberOfLines={1}
            >
              {item.lastMessage?.content
                ? item.lastMessage.content
                : item?.lastMessage?.attachmentUrl
                  ? "File shared"
                  : "No messages yet"}
            </Text>
          </View>
          {unreadCount > 0 && (
            <View
              className="items-center justify-center w-6 h-6 ml-2 rounded-full"
              style={{ backgroundColor: COLORS.unread }}
            >
              <Text className="text-xs font-bold text-white font-jakarta">
                {unreadCount}
              </Text>
            </View>
          )}
          <ChevronRight
            size={20}
            color={COLORS.textSecondary}
            className="ml-2"
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  if (loading) {
    return (
      <View
        className="items-center justify-center flex-1"
        style={{ backgroundColor: COLORS.background }}
      >
        <View className="items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            className="mt-4 font-geist"
            style={{ color: COLORS.textSecondary }}
          >
            Loading conversations...
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <View className="px-6 py-5" style={{ backgroundColor: COLORS.primary }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              className="text-2xl font-bold font-geist"
              style={{ color: "#FFFFFF" }}
            >
              Messages
            </Text>
            <Text
              className="text-sm font-geist"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {messagedUsers.length} conversations
            </Text>
          </View>
          <TouchableOpacity>
            <MoreVertical size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center px-4 py-3 mt-4 bg-white rounded-xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            placeholder="Search conversations..."
            className="flex-1 ml-2 outline-none font-jakarta"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      {/* Conversation List */}
      <Animated.View
        className="flex-1"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <FlatList
          data={filteredUsers}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center flex-1 px-4 mt-20">
              <View
                className="items-center justify-center w-20 h-20 mb-6 rounded-full"
                style={{ backgroundColor: "rgba(67, 97, 238, 0.1)" }}
              >
                <MessageCircle size={40} color={COLORS.primary} />
              </View>
              <Text
                className="mb-2 text-xl font-semibold text-center font-geist"
                style={{ color: COLORS.textPrimary }}
              >
                No conversations yet
              </Text>
              <Text
                className="mb-6 text-center font-jakarta"
                style={{ color: COLORS.textSecondary, lineHeight: 20 }}
              >
                Start a conversation with an officer{"\n"}from a report detail
                screen
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      </Animated.View>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute items-center justify-center rounded-full bottom-6 right-6 w-14 h-14"
        style={{
          backgroundColor: COLORS.accent,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
      >
        <Shield size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}
