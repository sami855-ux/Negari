import prisma from "../prisma/client.js"

export const createNotification = async (req, res) => {
  try {
    const { recipientId, type, message, metadata, createdById } = req.body
    // const createdById = req.user.id

    const notif = await prisma.notification.create({
      data: {
        recipientId,
        createdById,
        type: type || NotificationType.SYSTEM_ALERT,
        message,
        metadata,
      },
    })

    res.status(201).json({ notification: notif, success: true })
  } catch (err) {
    console.error("createNotification:", err)
    res.status(500).json({
      message: "Failed to create notification",
      success: false,
      error: err.message,
    })
  }
}

export const getAllNotificationsForUser = async (req, res) => {
  try {
    const userId = "e6e7b379-dde0-46f0-8265-c28a50a03ca3" //req.params.id // set by auth middleware

    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          // who triggered it
          select: { id: true, username: true, role: true },
        },
      },
    })

    res.json({
      total: notifications.length,
      results: notifications,
    })
  } catch (error) {
    console.error("getAllNotificationsForUser:", error)
    res.status(500).json({ message: "Failed to fetch notifications" })
  }
}

//Get unread message count for the user
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id
    const count = await prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    })
    res.json({ unread: count })
  } catch (err) {
    console.error("getUnreadCount:", err)
    res.status(500).json({ message: "Failed to fetch unread count" })
  }
}

//Get one notification by Id
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params

    const notif = await prisma.notification.findUnique({
      where: { id },
      include: { createdBy: true },
    })

    if (!notif) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json(notif)
  } catch (err) {
    console.error("getNotificationById:", err)
    res.status(500).json({ message: "Failed to retrieve notification" })
  }
}

//Mark one Notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params
    // const userId = req.user.id

    const updated = await prisma.notification.updateMany({
      where: { id },
      data: { isRead: true },
    })

    if (updated.count === 0)
      return res.status(404).json({ message: "Not found or not yours" })

    res.json({ message: "Marked as read" })
  } catch (err) {
    console.error("markNotificationRead:", err)
    res.status(500).json({ message: "Failed to mark read" })
  }
}

//Mark all as read
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user.id
    const updated = await prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    })
    res.json({ markedRead: updated.count })
  } catch (err) {
    console.error("markAllRead:", err)
    res.status(500).json({ message: "Failed to mark all read" })
  }
}

//Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params
    const user = req.user

    // Only recipient or ADMIN can delete
    const notif = await prisma.notification.findUnique({ where: { id } })
    if (!notif) return res.status(404).json({ message: "Not found" })

    if (notif.recipientId !== user.id) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await prisma.notification.delete({ where: { id } })
    res.json({ message: "Notification deleted" })
  } catch (err) {
    console.error("deleteNotification:", err)
    res.status(500).json({ message: "Failed to delete" })
  }
}
