export const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.id)

    // Join room based on user ID
    socket.on("join", (userId) => {
      socket.join(userId)
      console.log(`🟢 User ${userId} joined their notification room`)
    })

    // Handle manual disconnect
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id)
    })
  })
}
