import { getOrCreateConversation } from "../controllers/conversation.controller.js"
import express from "express"

const router = express.Router()

router.post("/", getOrCreateConversation)

export default router
