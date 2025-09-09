import { axiosInstance } from "./auth.js"

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/user")

    if (response.data.success) {
      console.log(response.data)
      return response.data.data
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/user/${userId}`)

    if (response.data.success) {
      return response.data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return null
  }
}

export const updateUser = async (userId, data) => {
  try {
    const response = await axiosInstance.put(`/user/${userId}`, data)

    if (response.data.success) {
      return response.data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export const getSingleUser = async (userId) => {
  try {
    const res = await axiosInstance.get(`/user/${userId}`)

    if (res.data.success) {
      return res.data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export const getAllWorkers = async () => {
  try {
    const res = await axiosInstance.get("/user/workers")
    console.log(res.data)

    if (res.data.success) {
      return res.data.workers
    } else {
      return []
    }
  } catch (error) {
    console.log("Error while getting the workers", error)
    return []
  }
}

export const searchUsersAPI = async (username) => {
  try {
    const res = await axiosInstance.get("/user/search", {
      params: { username },
    })

    if (res.data.success) {
      return res.data.users
    } else {
      return []
    }
  } catch (err) {
    console.error("Failed to search users:", err)
    return []
  }
}
export const searchAllUsersAPI = async (username) => {
  try {
    const res = await axiosInstance.get("/user/all/search", {
      params: { username },
    })

    if (res.data.success) {
      return res.data.users
    } else {
      return []
    }
  } catch (err) {
    console.error("Failed to search users:", err)
    return []
  }
}

export const getOfficerDashboardData = async () => {
  try {
    const res = await axiosInstance.get("/user/officer")
    if (res.data.success) {
      console.log(res.data.data)
      return res.data.data
    } else {
      return {}
    }
  } catch (err) {
    console.error("Failed to fetch officer dashboard data:", err)
    return {}
  }
}
