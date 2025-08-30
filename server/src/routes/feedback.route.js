import express from "express"
import {
  deleteFeedback,
  getFeedbackByOfficial,
} from "../controllers/feedback.controller.js"

const router = express.Router()

//Get all feedbacks from the report that is assigned to the specific officer
router.get("/:officialId", getFeedbackByOfficial)

//Delete Feedback
router.delete("/:feedbackId", deleteFeedback)

export default router
