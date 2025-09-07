import { axiosInstance } from "./report"

export const messagedUsersAPI = async () => {
  try {
    const res = await axiosInstance.get("/messages")

    if (res.data.success) {
      return res.data.users
    } else {
      return []
    }
  } catch (err) {
    console.error("Failed to fetch messaged users:", err)
    return []
  }
}

export const fetchMessagesAPI = async (conversationId) => {
  try {
    const res = await axiosInstance.get(`/messages/${conversationId}`)

    if (res.data.success) {
      return res.data.messages
    } else {
      return []
    }
  } catch (err) {
    console.error("Failed to fetch messages:", err)
    return []
  }
}

export const deleteMessageAPI = async (messageId) => {
  try {
    const res = await axiosInstance.delete(`/messages/${messageId}`)

    if (res.data.success) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.error("Failed to delete message:", err)
    return false
  }
}
