import express from "express"

import {
  changeReportStatus,
  createReport,
  deleteReport,
  getAllReports,
  getAllReportsAssignedToWorker,
  getCriticalReports,
  getOfficerReports,
  getReportAssignedInprogress,
  getReportAssignedToWorker,
  getReportById,
  getReportsByStatus,
  getReportsByUser,
  getReportsOfficial,
  resolveReport,
  submitFeedback,
  updateReportDynamic,
} from "../controllers/report.controller.js"
import upload from "../middleware/multer.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// Submit a report to the database => passed
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "video", maxCount: 1 },
  ]),
  createReport
)

router.put("/:id/resolve", upload.array("resolutionImages", 4), resolveReport)

//get all reports for the admin
router.get("/admin", getAllReports)

//! Get all the reports that is assigned to the officer for the table formate => don't touch
router.get("/assign/officer/:id", getReportsOfficial)

//Get all the reports based on status
router.get("/status/:status", getReportsByStatus)

//Get a single report by Id  => passed
router.get("/:id", getReportById)

//Get reports for a specific user for the reporter => passed
router.get("/user/:id", getReportsByUser)

//get a worker report
router.get("/worker/assigned", protect, getReportAssignedToWorker)

// get worker's inprogress report
router.get("/worker/inprogress", protect, getReportAssignedInprogress)

//Get all the reports of the
router.get("/worker/exist", protect, getAllReportsAssignedToWorker)

//Get all reports that is assigned to the officer
router.get("/officer/:officerId", getOfficerReports)

//Submit a feedback to the report => passed
router.post("/feedback/:id", protect, submitFeedback)

//Get all critical reports
router.get("/critical/:officialId", getCriticalReports)

//Update a report by Id => only for the admin and officials => passed
router.patch("/:id", updateReportDynamic)

//Update the status of the report resolve, inProgress or rejected => passed
router.patch("/status/:id", changeReportStatus)

//Delete a report by Id => passed
router.delete("/:id", deleteReport)

export default router
