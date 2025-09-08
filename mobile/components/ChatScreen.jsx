import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useMessage } from "../components/MessageContext"
import { useNavigation } from "@react-navigation/native"
import {
  ArrowLeft,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  ImageIcon,
} from "lucide-react-native"
import ImagePickerComp from "../components/ImagePicker"
import UserModal from "../components/UserModal"
import { useLocalSearchParams, useRouter } from "expo-router"
import { storage } from "../store/slices/auth"

export default function ChatScreen() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  const { messages, sendMessage, fetchMessages, loadingSend, loadingFetch } =
    useMessage()
  let { conversationId, officer } = useLocalSearchParams()

  officer = officer ? JSON.parse(officer) : null

  const [messageText, setMessageText] = useState("")
  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  const conversationMessages = messages[conversationId] || []

  // Fetch messages for this conversation
  useEffect(() => {
    loadMessages()
  }, [conversationId])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await storage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      }
    }

    fetchUser()
  }, [])

  const loadMessages = async () => {
    try {
      await fetchMessages(conversationId)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      Alert.alert("Error", "Failed to load messages")
    }
  }

  const handleSendMessage = async () => {
    if (messageText.trim() === "") return

    try {
      await sendMessage({
        conversationId,
        receiverId: officer.id,
        textMessage: messageText.trim(),
      })

      setMessageText("")
    } catch (error) {
      console.error("Failed to send message:", error)
      Alert.alert("Error", "Failed to send message")
    }
  }

  const handleAttachmentSelect = async (attachment) => {
    setShowAttachmentPicker(false)

    if (attachment) {
      try {
        await sendMessage({
          conversationId,
          receiverId: officer.id,
          file: attachment,
        })
      } catch (error) {
        console.error("Failed to send attachment:", error)
        Alert.alert("Error", "Failed to send attachment")
      }
    }
  }

  const renderMessageItem = ({ item }) => {
    const isCurrentUser = item.senderId === user?.id

    return (
      <View
        className={`flex-row mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        <View
          className={`max-w-[80%] rounded-2xl p-1 ${
            isCurrentUser
              ? "bg-green-400 rounded-br-none"
              : "bg-white border border-gray-200 rounded-bl-none"
          }`}
        >
          {item.type === "IMAGE" && item.attachmentUrl ? (
            <Image
              source={{ uri: item.attachmentUrl }}
              className="w-48 h-48 mb-2 rounded-lg"
              resizeMode="cover"
            />
          ) : null}

          <Text
            className={
              item.type === "IMAGE"
                ? "text-xs text-gray-500 mb-1 p-2"
                : "text-gray-800 font-jakarta p-2"
            }
          >
            {item.content}
          </Text>

          <View className="flex-row items-center justify-end mt-1">
            <Text
              className={`text-xs mr-1 font-jakarta ${
                isCurrentUser ? "text-white" : "text-gray-700"
              }`}
            >
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {isCurrentUser &&
              (item.isRead ? (
                <CheckCheck size={14} color="white" />
              ) : (
                <Check size={14} color="white" />
              ))}
          </View>
        </View>
      </View>
    )
  }

  if (loadingFetch) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        {/* Back Button */}
        <TouchableOpacity className="mr-4" onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        {/* Officer Info */}
        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={() => setShowUserModal(true)}
        >
          <Image
            source={{ uri: officer.profilePicture }}
            className="w-10 h-10 mr-3 rounded-full"
          />
          <View>
            <Text className="font-semibold text-gray-800 font-geist">
              {officer.username}
            </Text>
            <Text className="text-[10px] text-gray-500 font-semibold font-jakarta">
              {officer.role}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={conversationMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        className="flex-1 p-4"
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 px-4 mt-20">
            <ImageIcon size={64} color="#d1d5db" />
            <Text className="mt-4 text-xl font-semibold text-center text-gray-400 font-jakarta">
              No messages yet
            </Text>
            <Text className="mt-2 text-center text-gray-400 font-jakarta">
              Start a conversation with {officer.username}
            </Text>
          </View>
        }
      />

      {/* Message Input */}
      <View className="p-3 bg-white border-t border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-2 mr-2"
            onPress={() => setShowAttachmentPicker(true)}
          >
            <Paperclip size={24} color="#6b7280" />
          </TouchableOpacity>

          <TextInput
            className="flex-1 px-4 py-2 mr-2 bg-gray-100 rounded-2xl font-geist"
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            className={`p-2 rounded-full ${messageText.trim() ? "bg-emerald-600" : "bg-gray-300"}`}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || loadingSend}
          >
            {loadingSend ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <ImagePickerComp
        visible={showAttachmentPicker}
        onClose={() => setShowAttachmentPicker(false)}
        onImageSelected={handleAttachmentSelect}
      />

      <UserModal
        visible={showUserModal}
        user={officer}
        onClose={() => setShowUserModal(false)}
      />
    </KeyboardAvoidingView>
  )
}
