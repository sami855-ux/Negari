import express from "express"
import {
  getAllRegions,
  getRegionByOfficer,
} from "../controllers/region.controller.js"

const router = express.Router()

//Get all the regions
router.get("/", getAllRegions)

//Get a region for the officer
router.get("/:officerId", getRegionByOfficer)

export default router
