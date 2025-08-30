import { axiosInstance } from "./auth.js"

export const getAllRatings = async () => {
  try {
    const response = await axiosInstance.get("/rating")

    if (response.data.success) {
      return response.data.formatted
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching rating:", error)
    return []
  }
}

export const getRatingsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/rating/${userId}`)

    if (response.data.success) {
      return {
        userId: response.data.officialId,
        totalRatingsReceived: response.data.totalRatingsReceived,
        averageRating: response.data.averageRating,
        scoreDistribution: response.data.scoreDistribution,
        ratings: response.data.ratings,
      }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching ratings by user:", error)
    return null
  }
}
