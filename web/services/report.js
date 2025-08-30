import { axiosInstance } from "./auth.js"

// Get Report based on the status
export const getReportsByStatus = async (status) => {
  try {
    const res = await axiosInstance.get(`/report/status/${status}`)

    console.log(res.data)
    if (res.data.success) {
      console.log(res.data)
      return res.data.reports
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching pending reports:", error)
    return []
  }
}

// Get all reports
export const getAllReports = async () => {
  try {
    const res = await axiosInstance.get(`/report/admin`)
    if (res.data.success) {
      return res.data.reports
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching all reports:", error)
    return []
  }
}

// delete report
export const deleteReport = async (reportId) => {
  try {
    const res = await axiosInstance.delete(`/report/${reportId}`)

    if (res.data.success) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("Error deleting report:", error)
    return false
  }
}

//Get all reports that is assigned to the officer
export const getAssignedReports = async (officerId) => {
  try {
    const res = await axiosInstance.get(`/report/officer/${officerId}`)
    if (res.data.success) {
      return res.data.reports
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching assigned reports to the officer:", error)
    return []
  }
}

//Get a report by id
export const getReportById = async (reportId) => {
  try {
    const res = await axiosInstance.get(`/report/${reportId}`)

    if (res.data.success) {
      return res.data.report
    } else {
      return null
    }
  } catch (error) {
    console.error("Error fetching assigned reports to the officer:", error)
    return null
  }
}

//Get all reports that is assigned to the officer
export const getAssignedReportsByOfficer = async (officerId) => {
  try {
    const res = await axiosInstance.get(`/report/assign/officer/${officerId}`)

    if (res.data.success) {
      return res.data.data
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching assigned reports to the officer:", error)
    return []
  }
}

// Update the report Dynamically
export const updateReportDynamic = async (reportId, data) => {
  try {
    const res = await axiosInstance.patch(`/report/${reportId}`, data)

    if (res.data.success) {
      return {
        success: true,
        message: "Report updated successfully",
      }
    } else {
      return {
        success: false,
        message: "Failed to update report",
      }
    }
  } catch (error) {
    console.error("Error updating report:", error)

    return {
      success: false,
      message: "Failed to update report",
    }
  }
}

export const getCriticalReports = async (officialId) => {
  try {
    const res = await axiosInstance.get(`/report/critical/${officialId}`)

    if (res.data.success) {
      return res.data.criticalReports
    } else {
      return []
    }
  } catch (error) {
    console.log("Error fetching critical reports:", error)
    return []
  }
}
