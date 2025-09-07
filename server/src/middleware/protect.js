import jwt from "jsonwebtoken"
import prisma from "../prisma/client.js"

export const protect = async (req, res, next) => {
  try {
    let token

    // 1️⃣ Check Authorization Header (Bearer token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }
    // 2️⃣ (Optional) Fallback to Cookie for web users if you ever set cookies
    else if (req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized: No token provided",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        username: true,
        email: true,
        profilePicture: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized: User not found",
      })
    }

    req.user = user
    next()
  } catch (err) {
    console.error("protect error:", err)
    return res.status(401).json({
      success: false,
      message: "Not authorized: Invalid token",
    })
  }
}
