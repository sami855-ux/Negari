import { axiosInstance } from "./auth.js"

export const getFeedbackByOfficial = async (officialId) => {
  try {
    const res = await axiosInstance.get(`/feedback/${officialId}`)

    if (res.data.success) {
      return res.data.feedbacks
    } else {
      return []
    }
  } catch (error) {
    console.log("Error fetching feedbacks:", error)
    return []
  }
}

export const deleteFeedback = async (feedbackId) => {
  try {
    const res = await axiosInstance.delete(`/feedback/${feedbackId}`)

    if (res.data.success) {
      return res.data
    } else {
      return {
        success: false,
        message: res.data.message || "Failed to delete feedback",
      }
    }
  } catch (error) {
    console.error("Error deleting feedback:", error)
    return {
      success: false,
      message: res.data.message || "Failed to delete feedback",
    }
  }
}
