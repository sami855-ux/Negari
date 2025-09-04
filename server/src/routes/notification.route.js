import express from "express"
import {
  createNotification,
  deleteNotification,
  getAllNotificationsForUser,
  getNotificationById,
  markAllNotificationsReadForUser,
  markNotificationRead,
} from "../controllers/notification.controller.js"

const router = express.Router()

//Create Notification => passed
router.post("/", createNotification)

//Get a single notification => passed
router.get("/:id", getNotificationById)

//Mark one notification as read => passed
router.patch("/:id", markNotificationRead)

//Mark all notifications as read for a user
router.patch("/user/:userId", markAllNotificationsReadForUser)

//Get all notifications => passed
router.get("/user/:userId", getAllNotificationsForUser)

//Delete a notification
router.delete("/:id", deleteNotification)

export default router
