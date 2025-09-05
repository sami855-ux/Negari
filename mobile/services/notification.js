import { axiosInstance } from "./report"

export const getUserNotifications = async (userId) => {
  try {
    const res = await axiosInstance.get(`/notifications/user/${userId}`)

    console.log(res)
    if (res.data.success) {
      return res.data.notifications
    } else {
      return []
    }
  } catch (error) {
    console.log("Error while fetching the user notifications", error)
    return []
  }
}

export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await axiosInstance.patch(`/notifications/${notificationId}`)

    if (res.data.success) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("Error while marking the notification as read", error)
    return false
  }
}

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const res = await axiosInstance.patch(`/notifications/user/${userId}`)

    if (res.data.success) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("Error while marking all notifications as read", error)
    return false
  }
}

export const deleteNotificationEach = async (notificationId) => {
  try {
    const res = await axiosInstance.delete(`/notifications/${notificationId}`)

    if (res.data.success) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log("Error while deleting the notification", error)
    return false
  }
}
