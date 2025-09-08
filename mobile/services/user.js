import { axiosInstance } from "./report"

export const registerUser = async (data) => {
  try {
    const res = await axiosInstance.post("auth/app/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (res.data.success) {
      return res.data
    } else {
      return {
        success: false,
        message: res.data.message || "Registration failed",
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: error || "Registration failed",
    }
  }
}

export const VerifyOpt = async (email, otp) => {
  try {
    const res = await axiosInstance.post(
      "auth/verify/otp",
      { email, otp },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (res.data.success) {
      return res.data
    } else {
      return res.data
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "Verification failed",
    }
  }
}

export const getUserDetails = async (userId) => {
  try {
    const res = await axiosInstance.get(`user/${userId}`)

    if (res.data.success) {
      return res.data
    } else {
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}
