import express from "express"

import {
  deleteMessage,
  getMessagedUsers,
  getMessagesForConversation,
  sendMessage,
} from "../controllers/message.controller.js"
import { protect } from "../middleware/protect.js"
import upload from "../middleware/multer.js"

const router = express.Router()

router.get("/", protect, getMessagedUsers)

router.post("/:receiverId", protect, upload.single("image"), sendMessage)

router.get("/:participantId", protect, getMessagesForConversation)

router.delete("/:id", protect, deleteMessage)

export default router
