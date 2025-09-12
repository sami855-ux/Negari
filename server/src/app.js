import { Server as SocketIOServer } from "socket.io"
import cookieParser from "cookie-parser"
import passport from "passport"
import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import http from "http"

// import routes
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import regionRoutes from "./routes/region.route.js"
import ratingRoutes from "./routes/rating.route.js"
import reportRoutes from "./routes/report.route.js"
import messageRoutes from "./routes/message.route.js"
import googleAuthRoutes from "./routes/google.route.js"
import feedbackRoutes from "./routes/feedback.route.js"
import categoryRoutes from "./routes/category.route.js"
import telegramAuthRoutes from "./routes/telegram.route.js"
import notificationRoutes from "./routes/notification.route.js"
import systemPolicyRoutes from "./routes/systemPolicy.route.js"
import conversationRoutes from "./routes/conversation.route.js"

import "./utils/passport.js"
import job from "./utils/cron.js"
import { setupSocketIO } from "./socket/socket.js"
import "./utils/spamChecker.js"

dotenv.config()

job.start()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://nj8wkxm-samiux855-8081.exp.direct",
      "http://localhost:8081",
      "https://negari-ten.vercel.app",
      "exp://127.0.0.1:8081"
    ],
    credentials: true,
  })
)
app.use(helmet())
app.use(passport.initialize())

const server = http.createServer(app)
setupSocketIO(server)

// API Routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api", googleAuthRoutes)
app.use("/api", telegramAuthRoutes)
app.use("/api/report", reportRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/policy", systemPolicyRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/region", regionRoutes)
app.use("/api/conversations", conversationRoutes)
app.use("/api/messages", messageRoutes)

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Project backend is running ✅" })
})

server.listen(PORT, () => {
  console.log(`🚀 Project API running on http://localhost:${PORT}`)
})
