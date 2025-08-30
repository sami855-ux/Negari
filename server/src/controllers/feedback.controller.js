import prisma from "../prisma/client.js"

export const getFeedbackByOfficial = async (req, res) => {
  const { officialId } = req.params

  if (!officialId) {
    return res
      .status(400)
      .json({ error: "officialId is required", success: false })
  }

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        report: {
          assignedToId: officialId,
        },
      },
      include: {
        report: {
          select: {
            title: true,
            id: true,
            reporter: {
              select: { username: true, id: true, profilePicture: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.status(200).json({ feedbacks, success: true })
  } catch (error) {
    console.error("Error fetching feedbacks:", error)
    return res
      .status(500)
      .json({ error: "Something went wrong", success: false })
  }
}

export const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params

    const deletedFeedback = await prisma.feedback.delete({
      where: { id: feedbackId },
    })

    return res
      .status(200)
      .json({ deletedFeedback, success: true, message: "Feedback deleted" })
  } catch (error) {
    console.error("Error deleting feedback:", error)
    return res
      .status(500)
      .json({ error: "Something went wrong", success: false })
  }
}
