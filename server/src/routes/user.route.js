import express from "express"

import {
  createRegionAndAssignOfficial,
  deleteUser,
  getAllUsers,
  getUserWithDetails,
  getWorkers,
  searchUser,
  searchUsers,
  getOfficerDashboard,
  updateUser,
} from "../controllers/user.controller.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// Get all user
router.get("/", getAllUsers)

//Get all the workers
router.get("/workers", getWorkers)

//Officer Details
router.get("/officer", protect, getOfficerDashboard)

//Get users that can be searched from the officer
router.get("/search", protect, searchUser)

router.get("/all/search", protect, searchUsers)

//Get A single user
router.get("/:userId", getUserWithDetails)

//Assign official its region
router.post("/assign-official", createRegionAndAssignOfficial)

//Update the user
router.put("/:userId", updateUser)

//Delete user
router.delete("/:userId", deleteUser)

export default router
