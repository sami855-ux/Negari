import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: "https://negari.onrender.com/api",
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

export const SignedOut = async () => {
  try {
    const res = await axiosInstance.post("/auth/web/signout")

    if (res.data.success) {
      return {
        success: true,
        message: res.data.message || "Signed out successfully",
      }
    } else {
      return {
        success: false,
        message: res.data.message || "Failed to sign out",
      }
    }
  } catch (error) {
    console.error("Error signing up:", error)
    return {
      error:
        error.response?.data?.message || "An error occurred during sign up.",
      success: false,
    }
  }
}

export const forgotPassword = async (email) => {
  try {
    const res = await axiosInstance.post("/auth/forgot-password", { email })

    if (res.data.success) {
      return {
        success: true,
        message: res.data.message || "Password reset link sent successfully",
      }
    } else {
      return {
        success: false,
        message: res.data.message || "Failed to send password reset link",
      }
    }
  } catch (error) {
    console.error("Error signing up:", error)
    return {
      error:
        error.response?.data?.message ||
        "An error occurred during password reset.",
      success: false,
    }
  }
}

export const getMe = async () => {
  try {
    const res = await axiosInstance.get("/auth/me")

    if (res.data.success) {
      return {
        user: res.data.user,
        success: true,
      }
    } else {
      return {
        user: null,
        success: false,
      }
    }
  } catch (error) {
    console.error("Error getting user info:", error)
    return {
      error:
        error.response?.data?.message ||
        "An error occurred during getting user info.",
      success: false,
      user: null,
    }
  }
}
