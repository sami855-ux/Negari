import { axiosInstance } from "./auth.js"

export const getAllRegion = async () => {
  try {
    const res = await axiosInstance.get("/region")

    if (res.data.success) {
      return {
        data: res.data.data,
        success: true,
      }
    } else {
      return {
        data: [],
        success: false,
      }
    }
  } catch (error) {
    console.log("Error while fetching" + error)
    return {
      data: [],
      success: false,
    }
  }
}

export const getRegionByOfficer = async (officerId) => {
  try {
    const res = await axiosInstance.get(`/region/${officerId}`)

    if (res.data.success) {
      return {
        data: res.data.data,
        success: true,
      }
    } else {
      return {
        data: null,
        success: false,
      }
    }
  } catch (error) {
    console.log("Error while fetching" + error)
    return {
      data: null,
      success: false,
    }
  }
}
