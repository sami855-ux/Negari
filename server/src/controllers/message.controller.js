import prisma from "../prisma/client.js"
import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import { isUserOnline, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id
    const receiverId = req.params.receiverId
    const { textMessage } = req.body
    const image = req.file || null

    if (!textMessage && !image) {
      return res.status(400).json({
        success: false,
        error: "Either text message or image is required",
      })
    }

    // ✅ Process image if present
    let imageUrl = null
    if (image) {
      if (!image.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ success: false, error: "File must be an image" })
      }

      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 1000, height: 1000, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer()

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`

      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "chat_images",
        resource_type: "image",
      })

      if (!cloudResponse?.secure_url) {
        return res
          .status(500)
          .json({ success: false, error: "Failed to upload image" })
      }

      imageUrl = cloudResponse.secure_url
    }

    // ✅ Get or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantAId: senderId, participantBId: receiverId },
          { participantAId: receiverId, participantBId: senderId },
        ],
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { participantAId: senderId, participantBId: receiverId },
      })
    }

    // ✅ Create message
    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        type: imageUrl ? "IMAGE" : "TEXT",
        content: textMessage || null,
        attachmentUrl: imageUrl,
      },
      include: {
        sender: { select: { id: true, username: true, profilePicture: true } },
      },
    })

    // ✅ Create notification message
    const notificationMessage = imageUrl
      ? textMessage
        ? `${newMessage.sender.username} sent you a message with an image`
        : `${newMessage.sender.username} sent you an image`
      : `${newMessage.sender.username} sent you a message`

    // ✅ Create database notification
    const newNotification = await prisma.notification.create({
      data: {
        recipientId: receiverId,
        createdById: senderId,
        type: "NEW_REPORT",
        message: notificationMessage,
        metadata: { conversationId: conversation.id, messageId: newMessage.id },
      },
    })

    // ✅ Emit real-time events only if the user is online
    if (isUserOnline(receiverId)) {
      io.to(`user:${receiverId}`).emit("newMessage", newMessage)
      io.to(`user:${receiverId}`).emit("notification", {
        ...newNotification,
        senderDetails: newMessage.sender,
      })
    }

    return res.status(201).json({ success: true, newMessage })
  } catch (error) {
    console.error("Error in sendMessage:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to send message",
      details: error.message,
    })
  }
}

export const getMessages = async (req, res) => {
  try {
    const senderId = req.id
    const receiverId = req.params.id

    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantAId: senderId, participantBId: receiverId },
          { participantAId: receiverId, participantBId: senderId },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: { id: true, username: true, profilePicture: true },
            },
          },
        },
      },
    })

    return res.status(200).json({
      success: true,
      messages: conversation?.messages ?? [],
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" })
  }
}

export const deleteMessage = async (req, res) => {
  const { id } = req.params
  try {
    const deletedMessage = await prisma.message.delete({ where: { id } })
    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      deletedMessage,
    })
  } catch (error) {
    console.error("Error deleting message:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const getMessagesForConversation = async (req, res) => {
  try {
    const participantId = req.params.participantId
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" })
    }

    console.log(`Fetching conversation between ${userId} and ${participantId}`)

    // ✅ Find conversation where participantA + participantB match in any order
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantAId: userId, participantBId: participantId },
          { participantAId: participantId, participantBId: userId },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: { id: true, username: true, profilePicture: true },
            },
          },
        },
      },
    })

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" })
    }

    return res.status(200).json({
      success: true,
      conversationId: conversation.id,
      messages: conversation.messages,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" })
  }
}

export const getMessagedUsers = async (req, res) => {
  try {
    const userId = req.user.id // Auth middleware should set this

    // Fetch all conversations where the current user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ participantAId: userId }, { participantBId: userId }],
      },
      include: {
        participantA: true, // includes all fields of User
        participantB: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // only the last message for preview
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Map to get the “other user” and last message
    const users = conversations.map((conv) => {
      const otherUser =
        conv.participantAId === userId ? conv.participantB : conv.participantA
      const lastMessage = conv.messages[0] || null

      return {
        ...otherUser, // all user fields
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              attachmentUrl: lastMessage.attachmentUrl,
              type: lastMessage.type,
              isRead: lastMessage.isRead,
              createdAt: lastMessage.createdAt,
            }
          : null,
        conversationId: conv.id,
      }
    })

    res.status(200).json({ success: true, users })
  } catch (err) {
    console.error("Error fetching messaged users:", err)
    res.status(500).json({ success: false, error: "Failed to fetch users" })
  }
}
