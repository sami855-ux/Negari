import { axiosInstance } from "./auth.js"

export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get("/category")

    if (response.data.success) {
      return response.data.categories
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/category", categoryData)

    if (response.data.success) {
      return response.data
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create category",
      }
    }
  } catch (error) {
    console.error("Error creating category:", error)
    return {
      success: false,
      message: "Failed to create category",
    }
  }
}

export const deleteCategory = async (categoryId) => {
  try {
    const res = await axiosInstance.delete(`/category/${categoryId}`)

    if (res.data.success) {
      return res.data
    } else {
      return {
        success: false,
        message: res.data.message || "Failed to delete category",
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: "Failed to delete category",
    }
  }
}

export const getCategoryById = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/category/${categoryId}`)

    if (response.data.success) {
      return response.data
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching category by ID:", error)
    return []
  }
}

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axiosInstance.patch(
      `/category/${categoryId}`,
      categoryData
    )

    if (response.data.success) {
      return response.data
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to update category",
      }
    }
  } catch (error) {
    console.error("Error updating category:", error)
    return {
      success: false,
      message: "Failed to update category",
    }
  }
}
