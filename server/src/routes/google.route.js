import passport from "passport"
import express from "express"

import { googleCallback } from "../controllers/google.controller.js"

const router = express.Router()

// Step 1: Redirect to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

// Step 2: Google redirects here after login
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
)

export default router
