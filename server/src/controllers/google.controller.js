import { generateToken } from "./authWeb.controller.js"

export const googleCallback = (req, res) => {
  const user = req.user

  // Sign JWT token
  const token = generateToken(user)

  // Set JWT as HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  // Redirect to frontend dashboard or homepage
  res.redirect(`${process.env.FRONTEND_URL}/login`)
}
