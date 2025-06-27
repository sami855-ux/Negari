import express from "express"

import { registerUser, loginUser } from "../controllers/authApp.controller.js"
import { registerValidator, loginValidator } from "../utils/authValidator.js"
import validateRequest from "../middleware/validateRequest.js"
import {
  loginUserWeb,
  logoutUserWeb,
  registerUserWeb,
} from "../controllers/authWeb.controller.js"
import loginLimiter from "../middleware/LoginLimter.js"

const router = express.Router()

router.post("/app/register", registerValidator, validateRequest, registerUser)
router.post(
  "/app/login",
  loginLimiter,
  loginValidator,
  validateRequest,
  loginUser
)

router.post(
  "/web/register",
  registerValidator,
  validateRequest,
  registerUserWeb
)
router.post(
  "/web/login",
  loginLimiter,
  loginValidator,
  validateRequest,
  loginUserWeb
)
router.post("/web/logout", logoutUserWeb)

export default router
