import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
})

export const signInUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/web/login", userData)
    return response.data
  } catch (error) {
    console.error("Error signing in:", error)
    return {
      error:
        error.response?.data?.message || "An error occurred during sign in.",
      success: false,
    }
  }
}

export const signUpUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/web/register", userData)
    return response.data
  } catch (error) {
    console.error("Error signing up:", error)
    return {
      error:
        error.response?.data?.message || "An error occurred during sign up.",
      success: false,
    }
  }
}
