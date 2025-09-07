import { Server } from "socket.io"
import prisma from "../prisma/client.js"

export let io

// Map to track userId -> connection count (handles multi-device)
const onlineUsers = new Map()

export const setupSocketIO = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  })

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId
    if (!userId) return socket.disconnect()

    // Increment connection count
    onlineUsers.set(userId, (onlineUsers.get(userId) ?? 0) + 1)

    // Update DB isOnline
    await prisma.user
      .update({
        where: { id: userId },
        data: { isOnline: true },
      })
      .catch(() => {})

    console.log(`✅ User connected: ${userId}, socket: ${socket.id}`)

    // Emit current online users
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()))

    socket.on("disconnect", async () => {
      const count = (onlineUsers.get(userId) ?? 1) - 1

      if (count <= 0) {
        onlineUsers.delete(userId)

        // Update DB: set offline and lastSeen
        await prisma.user
          .update({
            where: { id: userId },
            data: { isOnline: false, lastSeen: new Date() },
          })
          .catch(() => {})

        console.log(`🔴 User disconnected: ${userId}`)
      } else {
        onlineUsers.set(userId, count)
      }

      // Emit updated online users
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()))
    })
  })
}

// Helper function to check if a user is online
export const isUserOnline = (userId) => onlineUsers.has(userId)
