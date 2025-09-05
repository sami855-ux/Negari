import { axiosInstance } from "./report"

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/category")

    if (response.data.success) {
      const categoryNames = response.data.categories.map(
        (category) => category?.name
      )

      categoryNames.push("AI suggest")
      return categoryNames
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}
