import prisma from "../prisma/client.js"

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body

    const existing = await prisma.reportCategory.findUnique({
      where: { name },
    })

    if (existing) {
      return res
        .status(400)
        .json({ message: "Category already exists", success: false })
    }

    const newCategory = await prisma.reportCategory.create({
      data: { name, description, icon, color },
    })

    return res.status(201).json({
      data: newCategory,
      success: true,
      message: "Category created successfully",
    })
  } catch (error) {
    console.error("Create Category Error:", error)
    res.status(500).json({ message: "Server error while creating category" })
  }
}

// Get all categories
export const getAllCategories = async (_req, res) => {
  try {
    const categories = await prisma.reportCategory.findMany({
      orderBy: { createdAt: "desc" },
    })

    return res.status(200).json({ categories, success: true })
  } catch (error) {
    console.error("Fetch Categories Error:", error)
    res.status(500).json({ message: "Server error while fetching categories" })
  }
}

//Get category bt Id
export const getCategoryById = async (req, res) => {
  const { categoryId } = req.params
  try {
    const category = await prisma.reportCategory.findUnique({
      where: { id: categoryId },
    })
    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", success: false })
    }
    return res.status(200).json({ category, success: true })
  } catch (error) {
    console.error("Get Category Error:", error)
    res.status(500).json({ message: "Server error while fetching category" })
  }
}

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params
    const { name, description, icon, color } = req.body

    const updatedCategory = await prisma.reportCategory.update({
      where: { id: categoryId },
      data: { name, description, icon, color },
    })

    return res.status(200).json({
      updatedCategory,
      success: true,
      message: "Category updated successfully",
    })
  } catch (error) {
    console.error("Update Category Error:", error)
    res.status(500).json({ message: "Server error while updating category" })
  }
}

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params

    await prisma.reportCategory.delete({
      where: { id: categoryId },
    })

    return res
      .status(200)
      .json({ message: "Category deleted successfully", success: true })
  } catch (error) {
    console.error("Delete Category Error:", error)
    res.status(500).json({ message: "Server error while deleting category" })
  }
}
