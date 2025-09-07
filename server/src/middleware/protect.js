import jwt from "jsonwebtoken"
import prisma from "../prisma/client.js"

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token
    console.log(token)

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

    // Attach user to request
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
