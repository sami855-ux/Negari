import { axiosInstance } from "./report"

export const messagedUsersAPI = async () => {
  try {
    const res = await axiosInstance.get("/messages")

    console.log(res.data)
    if (res.data.success) {
      return res.data.users
    } else {
      return []
    }
  } catch (err) {
    console.error("Failed to fetch messaged users:", err)

    // Specific useful info
    if (err.response) {
      // The request was made and the server responded with a status code out of 2xx
      console.error("Status code:", err.response.status)
      console.error("Response data:", err.response.data)
      console.error("Response headers:", err.response.headers)
    } else if (err.request) {
      // The request was made but no response received
      console.error("No response received. Request:", err.request)
    } else {
      // Something happened setting up the request
      console.error("Error setting up request:", err.message)
    }
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
