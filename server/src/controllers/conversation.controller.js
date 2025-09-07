import prisma from "../prisma/client.js"

export const getOrCreateConversation = async (req, res) => {
  try {
    let { participantAId, participantBId } = req.body

    if (!participantAId || !participantBId) {
      return res
        .status(400)
        .json({ error: "Both participant IDs are required" })
    }

    // ✅ Ensure consistent ordering to prevent duplicate conversations
    if (participantAId > participantBId) {
      ;[participantAId, participantBId] = [participantBId, participantAId]
    }

    // ✅ Find existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: { participantAId, participantBId },
    })

    // ✅ If not found, create new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { participantAId, participantBId },
      })
    }

    return res.status(200).json(conversation)
  } catch (error) {
    console.error("❌ Error creating/fetching conversation:", error)
    return res.status(500).json({
      error: "Failed to create or fetch conversation",
      details: error.message,
    })
  }
}
