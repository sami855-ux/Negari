import express from "express"
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js"

const router = express.Router()

//Create new category
router.post("/", createCategory)

//Get all categories
router.get("/", getAllCategories)

//Get category by Id
router.get("/:categoryId", getCategoryById)

//Update category
router.patch("/:categoryId", updateCategory)

//Delete category
router.delete("/:categoryId", deleteCategory)

export default router
