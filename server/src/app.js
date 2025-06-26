import cookieParser from "cookie-parser"
import passport from "passport"
import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import googleAuthRoutes from "./routes/google.route.js"
import telegramAuthRoutes from "./routes/telegram.route.js"

import "./utils/passport.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: ["http://localhost:3000", "exp://localhost:19000"],
    credentials: true,
  })
)
app.use(helmet())
app.use(passport.initialize())

// API Routes

app.use("/api/auth", authRoutes)
app.use("/api/", googleAuthRoutes)
app.use("/api/", telegramAuthRoutes)

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "ZenaNet backend is running ✅" })
})

app.listen(PORT, () => {
  console.log(`🚀 ZenaNet API running on http://localhost:${PORT}`)
})
