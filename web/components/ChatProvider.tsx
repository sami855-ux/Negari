"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react"
import { io, Socket } from "socket.io-client"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import {
  deleteMessageAPI,
  fetchMessagesAPI,
  messagedUsersAPI,
} from "@/services/Messag"

const SOCKET_URL = "http://localhost:5000"

// Types
export interface User {
  id: string
  username: string
  email?: string
  profilePicture?: string
  role?: string
  isOnline?: boolean
  lastSeen?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  type: "TEXT" | "IMAGE"
  content?: string | null
  attachmentUrl?: string | null
  createdAt: string
  isRead: boolean
}

interface ChatContextType {
  socket: Socket | null
  onlineUsers: string[]
  messages: Record<string, Message[]>
  messagedUsers: User[]
  loadingSend: boolean
  loadingFetch: boolean
  sendMessage: (data: {
    conversationId: string
    receiverId: string
    textMessage?: string
    file?: File
  }) => Promise<Message>
  fetchMessages: (conversationId: string) => Promise<Message[]>
  fetchMessagedUsers: () => Promise<User[]>
  deleteMessage: (messageId: string) => Promise<void>
  setMessagedUsers: React.Dispatch<React.SetStateAction<User[]>>
}

// Context Setup
const ChatContext = createContext<ChatContextType | null>(null)

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("❌ useChat must be used within a ChatProvider")
  }
  return context
}

// Provider
interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useSelector((store: RootState) => store.user)
  const userId = user?.user?.id ?? ""

  const socketRef = useRef<Socket | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [messagedUsers, setMessagedUsers] = useState<User[]>([])
  const [loadingSend, setLoadingSend] = useState(false)
  const [loadingFetch, setLoadingFetch] = useState(false)

  // Socket.IO Setup
  useEffect(() => {
    if (!userId) return

    const socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"], // ✅ Prefer WebSocket over long-polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log(`✅ Connected to Socket.IO as user ${userId}`)
    })

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message)
    })

    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => {
        const convId = message.conversationId
        const updated = prev[convId] ? [...prev[convId], message] : [message]
        return { ...prev, [convId]: updated }
      })
    })

    socket.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [userId])

  // Fetch messaged users
  const fetchMessagedUsers = async (): Promise<User[]> => {
    try {
      const users = await messagedUsersAPI()
      setMessagedUsers(users)
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
  }: {
    conversationId: string
    receiverId: string
    textMessage?: string
    file?: File
  }): Promise<Message> => {
    setLoadingSend(true)
    try {
      const formData = new FormData()
      if (textMessage) formData.append("textMessage", textMessage)
      if (file) formData.append("image", file)

      const res = await axios.post<{ newMessage: Message }>(
        `http://localhost:5000/api/messages/${receiverId}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

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
  const fetchMessages = async (conversationId: string): Promise<Message[]> => {
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

  //Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      const res = await deleteMessageAPI(messageId)
      if (res) {
        setMessages((prev) => {
          const updated = { ...prev }
          for (const convId in updated) {
            updated[convId] = updated[convId].filter(
              (msg) => msg.id !== messageId
            )
          }
          return updated
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const contextValue: ChatContextType = {
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
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  )
}
