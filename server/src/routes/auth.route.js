import express from "express"

import {
  registerUser,
  loginUser,
  verifyOTP,
} from "../controllers/authApp.controller.js"
import { registerValidator, loginValidator } from "../utils/authValidator.js"
import validateRequest from "../middleware/validateRequest.js"
import {
  forgotPassword,
  getMe,
  loginUserWeb,
  logoutUserWeb,
  registerUserWeb,
  resetPassword,
} from "../controllers/authWeb.controller.js"
import loginLimiter from "../middleware/LoginLimter.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

router.get("/me", protect, getMe)

router.post("/app/register", registerValidator, validateRequest, registerUser)

router.post(
  "/app/login",
  // loginLimiter,
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

router.post("/verify/otp", verifyOTP)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:token", resetPassword)
router.post("/web/signout", logoutUserWeb)

export default router
