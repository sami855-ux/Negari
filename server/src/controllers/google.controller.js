import { generateToken } from "./authWeb.controller.js"

export const googleCallback = (req, res) => {
  const user = req.user

  console.log(user.role)
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
  if (user.role === "ADMIN") {
    res.redirect(`${process.env.FRONTEND_URL}/admin`)
  }
  if (user.role === "OFFICER") {
    res.redirect(`${process.env.FRONTEND_URL}/official`)
  }
}

export const googleCallbackApp = (req, res) => {
  const user = req.user

  // Sign JWT token
  const token = generateToken(user)

  // For mobile apps, send JSON instead of redirect
  res.json({
    success: true,
    token, // Send JWT to app
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      picture: user.picture,
    },
  })
}
