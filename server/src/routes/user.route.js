import express from "express"

import {
  createRegionAndAssignOfficial,
  deleteUser,
  getAllUsers,
  getUserWithDetails,
  getWorkers,
  updateUser,
} from "../controllers/user.controller.js"

const router = express.Router()

// Get all user
router.get("/", getAllUsers)

//Get all the workers
router.get("/workers", getWorkers)

//Get A single user
router.get("/:userId", getUserWithDetails)

//Assign official its region
router.post("/assign-official", createRegionAndAssignOfficial)

//Update the user
router.put("/:userId", updateUser)

//Delete user
router.delete("/:userId", deleteUser)

export default router
