import express from "express"

import {
  createRating,
  getAllRatedOfficials,
  getUserRatingsGiven,
} from "../controllers/rating.controller.js"

const router = express.Router()

// Create a new rating
router.post("/", createRating)

// Get all ratings => all officials
router.get("/", getAllRatedOfficials)

//Get all ratings given by a user
router.get("/:userId", getUserRatingsGiven)

export default router
