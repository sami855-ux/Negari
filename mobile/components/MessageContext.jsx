import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react"
import io from "socket.io-client"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

import { messagedUsersAPI, fetchMessagesAPI } from "../services/message"
import { axiosInstance } from "@/services/report"

const SOCKET_URL = "https://negari.onrender.com"

// Context Setup
const MessageContext = createContext(null)

export const useMessage = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider")
  }
  return context
}

export const MessageProvider = ({ children, user }) => {
  const userId = user?.id ?? ""

  const socketRef = useRef(null)
  const [onlineUsers, setOnlineUsers] = useState([]) // List of online users[]
  const [messages, setMessages] = useState({})
  const [messagedUsers, setMessagedUsers] = useState([])
  const [loadingSend, setLoadingSend] = useState(false)
  const [loadingFetch, setLoadingFetch] = useState(false)

  // Socket.IO Setup
  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log(`Connected to Socket.IO as user ${userId}`)
    })

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message)
    })

    socket.on("newMessage", (message) => {
      setMessages((prev) => {
        const convId = message.conversationId
        const updated = prev[convId] ? [...prev[convId], message] : [message]
        return { ...prev, [convId]: updated }
      })
    })

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [userId])

  // Fetch messaged users
  const fetchMessagedUsers = async () => {
    try {
      const users = await messagedUsersAPI()
      setMessagedUsers(users)
      console.log("Messaged users", users)
      return users
    } catch (err) {
      console.error("❌ Failed to fetch messaged users:", err)
      return []
    }
  }

  // Send message
  const sendMessage = async ({
    conversationId,
    receiverId,
    textMessage,
    file,
  }) => {
    setLoadingSend(true)
    try {
      console.log(file)
      const formData = new FormData()
      if (textMessage) formData.append("textMessage", textMessage)
      if (file) formData.append("image", file)

      const res = await axiosInstance.post(`messages/${receiverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const newMessage = res.data.newMessage

      setMessages((prev) => {
        const updated = prev[conversationId]
          ? [...prev[conversationId], newMessage]
          : [newMessage]
        return { ...prev, [conversationId]: updated }
      })

      // Refresh user list if it's a new conversation
      await fetchMessagedUsers()

      return newMessage
    } catch (err) {
      console.error("❌ Failed to send message:", err)
      throw err
    } finally {
      setLoadingSend(false)
    }
  }

  // Fetch messages
  const fetchMessages = async (conversationId) => {
    setLoadingFetch(true)
    try {
      const data = await fetchMessagesAPI(conversationId)
      setMessages((prev) => ({ ...prev, [conversationId]: data }))
      return data
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err)
      return []
    } finally {
      setLoadingFetch(false)
    }
  }

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      // Replace with your actual API call
      // await deleteMessageAPI(messageId);

      setMessages((prev) => {
        const updated = { ...prev }
        for (const convId in updated) {
          updated[convId] = updated[convId].filter(
            (msg) => msg.id !== messageId
          )
        }
        return updated
      })
    } catch (error) {
      console.error("Failed to delete message:", error)
      throw error
    }
  }

  const contextValue = {
    socket: socketRef.current,
    onlineUsers,
    messages,
    messagedUsers,
    setMessagedUsers,
    sendMessage,
    fetchMessages,
    fetchMessagedUsers,
    deleteMessage,
    loadingSend,
    loadingFetch,
  }

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  )
}
