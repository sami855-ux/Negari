import express from "express"
import { telegramHandler } from "../controllers/telegram.controller"

const router = express.Router()

router.get("/telegram", telegramHandler)

export default router
