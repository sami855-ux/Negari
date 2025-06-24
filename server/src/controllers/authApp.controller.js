import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import prisma from "../prisma/client.js"

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register a new user
export const registerUser = async (req, res) => {
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

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
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
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user)

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (err) {
    console.error("Login Error:", err)
    res.status(500).json({ message: "Server error" })
  }
}
