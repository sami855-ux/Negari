import passport from "passport"
import express from "express"

import {
  googleCallback,
  googleCallbackApp,
} from "../controllers/google.controller.js"

const router = express.Router()

// Step 1: Redirect to Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
)

// Step 2: Google redirects here after login
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
)

router.get(
  "/mobile/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallbackApp
)

export default router
