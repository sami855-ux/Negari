import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password or real password
  },
})

export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `Negari Verification`,
      to,
      subject,
      text,
      html,
    })

    console.log("Email sent: %s", info.messageId)
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
