import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../prisma/client.js"
import crypto from "crypto"

import { sendEmail } from "../services/Mailer.js"

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

// Register a new user (web - sets token cookie)
export const registerUserWeb = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    const token = generateToken(user)

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error("Register Error:", err)
    res.status(500).json({ message: "Server error", success: false })
  }
}

export const loginUserWeb = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false })
    }

    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false })
    }

    const token = generateToken(user)

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error("Login Error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// Logout user (clear cookie)
export const logoutUserWeb = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return res.status(200).json({
      message: "Signed out successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error during logout:", error)

    return res.status(500).json({
      message: "An error occurred while signing out. Please try again.",
      success: false,
      error: error.message || "Unexpected error",
    })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    // 1. Check if user exists
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res
        .status(404)
        .json({ message: "There is no user with this email", success: false })
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")

    // 3. Hash token and calculate expiry
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")
    const expireTime = new Date(Date.now() + 15 * 60 * 1000) // 15 min

    // 4. Save hashed token and expiry in database
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: expireTime,
      },
    })

    // 5. Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    // 6. Email message
    const message = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
    <h2 style="color: #00796B;">Negari Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password for your Negari account. Click the button below to reset it:</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" target="_blank" 
         style="
           background-color: #00796B; 
           color: white; 
           text-decoration: none; 
           padding: 12px 24px; 
           border-radius: 6px; 
           font-weight: bold;
           display: inline-block;
         ">
        Reset Password
      </a>
    </p>
    <p>This link will expire in <strong>15 minutes</strong>.</p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
    <p>Thank you,<br/>The Negari Team</p>
  </div>
`

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: "",
      html: message,
    })

    res.json({
      message: "Reset link sent to your email. Please check your inbox.",
      success: true,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error. Please try again." })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", success: false })
    }

    // 1. Hash the token (same as forgot password)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // 2. Find the user with matching token and valid expiry
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { gt: new Date() }, // not expired
      },
    })

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token", success: false })
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Update the user's password and clear reset token/expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    })

    res
      .status(200)
      .json({ message: "Password updated successfully!", success: true })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: "Server error. Please try again.", success: false })
  }
}

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    })
  } catch (error) {
    console.error("getMe error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}
