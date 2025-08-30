import crypto from "crypto"
import prisma from "../prisma/client.js"

function verifyTelegramData(data) {
  const secretKey = crypto
    .createHash("sha256")
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest()

  const checkString = Object.keys(data)
    .filter((k) => k !== "hash")
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join("\n")

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex")

  return hash === data.hash
}

export async function telegramHandler(req, res) {
  const data = req.query

  if (!verifyTelegramData(data)) {
    return res.status(401).send("Invalid Telegram data")
  }

  const telegramId = data.id
  const name = data.first_name
  const photoUrl = data.photo_url

  let user = await prisma.user.findUnique({
    where: { telegramId },
  })

  if (!user) {
    user = await prisma.user.create({
      data: { telegramId, username: name, profilePicture: photoUrl },
    })
  }

  // TODO: Issue JWT or cookie for session

  res.redirect("/dashboard") // or wherever
}
