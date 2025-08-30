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
  withCredentials: true,
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
