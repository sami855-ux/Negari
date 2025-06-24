import cookieParser from "cookie-parser"
import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"

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

// API Routes

app.use("/api/auth", authRoutes)

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "ZenaNet backend is running ✅" })
})

app.listen(PORT, () => {
  console.log(`🚀 ZenaNet API running on http://localhost:${PORT}`)
})
