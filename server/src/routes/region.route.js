import express from "express"
import { getAllRegions } from "../controllers/region.controller.js"

const router = express.Router()

//Get all the regions
router.get("/", getAllRegions)

export default router
