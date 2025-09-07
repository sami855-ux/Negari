import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import prisma from "../prisma/client.js"
import { sendEmail } from "../services/Mailer.js"

// JWT token generator
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in DB (unverified)
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified: false,
      },
    })

    // Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Save OTP in DB
    await prisma.oTPVerification.create({
      data: {
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        verified: false,
      },
    })

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Negari Email Verification",
      text: `Your verification OTP is ${otp}. It will expire in 5 minutes.`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f5f6fa; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 30px; text-align: center;">
      <h2 style="color: #00796B; margin-bottom: 20px;">Negari Verification</h2>
      <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">
        Hello <strong>${email}</strong>,
      </p>
      <p style="font-size: 16px; color: #333333; margin-bottom: 30px;">
        Use the following OTP to verify your email address. This OTP will expire in 5 minutes.
      </p>
      <div style="font-size: 24px; font-weight: bold; color: #E53935; background-color: #fce4ec; display: inline-block; padding: 10px 20px; border-radius: 6px; letter-spacing: 2px;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 30px;">
        If you did not request this OTP, please ignore this email.
      </p>
      <p style="font-size: 14px; color: #999999;">
        &copy; ${new Date().getFullYear()} Negari. All rights reserved.
      </p>
    </div>
  </div>
  `,
    })

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please verify your email with the OTP sent.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error("Register Error:", err)
    res.status(500).json({ message: "Server error", success: false })
  }
}

// Login an existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false })
    }

    const token = generateToken(user)

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        lastSeen: user.lastSeen,
        isOnline: user.isOnline,
      },
      token,
    })
  } catch (err) {
    console.error("Login Error:", err)
    res.status(500).json({ message: "Server error", success: false })
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const record = await prisma.oTPVerification.findFirst({
      where: { email, otp, verified: false },
    })

    if (!record) {
      return res.status(400).json({ success: false, error: "Invalid OTP" })
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: "OTP expired" })
    }

    // Mark OTP as verified
    await prisma.oTPVerification.update({
      where: { id: record.id },
      data: { verified: true },
    })

    // Activate user
    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    })

    // Generate JWT token
    const token = generateToken(user)

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        lastSeen: user.lastSeen,
        isOnline: user.isOnline,
      },
      token,
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    })
  }
}
