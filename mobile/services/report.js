import { storage } from "@/store/slices/auth"
import axios from "axios"
// import Constants from "expo-constants"

// const serverUrl =
//   Constants.expoConfig?.extra?.serverUrl ||
//   Constants.manifest?.extra?.serverUrl ||
//   "https://negari.onrender.com"

//! for localhost
const serverUrl = "http://localhost:5000"

export const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/`,
})

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await storage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (err) {
    console.error("Error attaching token:", err)
  }
  return config
})

export const createReport = async (data) => {
  try {
    const res = await axiosInstance.post("report", data)

    if (res.success) {
      return {
        success: true,
        data: res.data,
      }
    } else {
      return {
        success: false,
        message: res.message,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error,
    }
  }
}
export const getUserReports = async (userId) => {
  try {
    const res = await axiosInstance.get(`report/user/${userId}`)

    console.log(userId, res.data)
    if (res.data.success) {
      return {
        success: true,
        data: res.data.reports,
      }
    } else {
      return {
        success: false,
        message: res.data.message,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error,
    }
  }
}

export const getReportById = async (reportId) => {
  try {
    const res = await axiosInstance.get(`report/${reportId}`)

    console.log(res.data)
    if (res.data.success) {
      return {
        success: true,
        data: res.data.report,
      }
    } else {
      return {
        success: false,
        message: res.data.message,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error,
    }
  }
}

export const deleteReport = async (reportId) => {
  try {
    const res = await axiosInstance.delete(`report/${reportId}`)

    if (res.data.success) {
      return {
        success: true,
        message: res.data.message,
      }
    } else {
      return {
        success: false,
        message: res.data.message,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error,
    }
  }
}
