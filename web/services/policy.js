import { axiosInstance } from "./auth.js"

//Get all the policy
export const getPolicies = async () => {
  try {
    const response = await axiosInstance.get("/policy")

    if (response.data.success) {
      return response.data.data
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching policies:", error)
    return []
  }
}

// Get a single policy
export const getPolicy = async (policyId) => {
  try {
    const response = await axiosInstance.get(`/policy/${policyId}`)

    if (response.data.success) {
      return response.data
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching policy:", error)
    return null
  }
}

//update policy
export const updatePolicy = async (role, data) => {
  try {
    const res = await axiosInstance.patch(`/policy/${role}`, data)

    if (res.data.success) {
      console.log(res.data.data)
      return {
        success: true,
        message: "Policy updated successfully.",
      }
    } else {
      return {
        success: false,
        message: "Failed to update policy.",
      }
    }
  } catch (error) {
    console.error("Error updating policy:", error)
    return { success: false, message: "Failed to update policy." }
  }
}
