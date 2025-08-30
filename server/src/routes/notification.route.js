import express from "express"
import {
  createNotification,
  deleteNotification,
  getAllNotificationsForUser,
  getNotificationById,
  markNotificationRead,
} from "../controllers/notification.controller.js"

const router = express.Router()

//Create Notification => passed
router.post("/", createNotification)

//Get a single notification => passed
router.get("/:id", getNotificationById)

//Mark one notification as read => passed
router.patch("/:id", markNotificationRead)

//Get all notifications => passed
router.get("/", getAllNotificationsForUser)

//Delete a notification
router.delete("/:id", deleteNotification)

export default router
