import prisma from "../prisma/client.js"

export const createRating = async (req, res) => {
  const { ratedById, officialId, score, comment } = req.body

  if (!ratedById || !officialId || !score) {
    return res
      .status(400)
      .json({ message: "ratedById, officialId, and score are required." })
  }

  if (score < 1 || score > 5) {
    return res.status(400).json({ message: "Score must be between 1 and 5." })
  }

  try {
    // ✅ Check if both users exist and valid
    const [rater, official] = await Promise.all([
      prisma.user.findUnique({ where: { id: ratedById } }),
      prisma.user.findUnique({ where: { id: officialId } }),
    ])

    if (!rater || !official) {
      return res.status(404).json({ message: "User or official not found." })
    }

    if (official.role !== "OFFICER") {
      return res
        .status(400)
        .json({ message: "Target user is not an official." })
    }

    if (ratedById === officialId) {
      return res.status(400).json({ message: "Users cannot rate themselves." })
    }

    const existing = await prisma.rating.findFirst({
      where: { ratedById, officialId },
    })

    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already rated this official." })
    }

    const newRating = await prisma.rating.create({
      data: {
        ratedById,
        officialId,
        score,
        comment,
      },
      include: {
        official: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    })

    return res.status(201).json({
      message: "Rating submitted successfully.",
      rating: newRating,
    })
  } catch (error) {
    console.error("Error creating rating:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const getAllRatedOfficials = async (req, res) => {
  try {
    // Fetch all officials who have at least one rating
    const ratedOfficials = await prisma.user.findMany({
      where: {
        role: "OFFICER",
        ratingsReceived: {
          some: {}, // has at least one rating
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        ratingsReceived: {
          select: {
            score: true,
            comment: true,
            createdAt: true,
            ratedBy: {
              select: {
                username: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    })

    // Format and calculate average ratings
    const formatted = ratedOfficials.map((official) => {
      const totalRatings = official.ratingsReceived.length
      const averageRating =
        official.ratingsReceived.reduce((sum, r) => sum + r.score, 0) /
        totalRatings

      return {
        id: official.id,
        username: official.username,
        email: official.email,
        profilePicture: official.profilePicture,
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalRatings,
        ratings: official.ratingsReceived.map((r) => ({
          score: r.score,
          comment: r.comment,
          createdAt: r.createdAt,
          rater: {
            username: r.ratedBy.username,
            email: r.ratedBy.email,
            profilePicture: r.ratedBy.profilePicture,
          },
        })),
      }
    })

    return res.json({ formatted, success: true })
  } catch (error) {
    console.error("Error fetching rated officials:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const getUserRatingsGiven = async (req, res) => {
  const { userId } = req.params

  try {
    const ratings = await prisma.rating.findMany({
      where: {
        officialId: userId, // This means we’re fetching ratings for this official
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        score: true,
        comment: true,
        createdAt: true,
        ratedBy: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    })

    if (!ratings.length) {
      return res.status(404).json({
        message: "No ratings found for this official.",
        success: false,
      })
    }

    const totalRatingsReceived = ratings.length
    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0)
    const averageRating = parseFloat(
      (totalScore / totalRatingsReceived).toFixed(2)
    )

    const scoreDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    ratings.forEach((r) => {
      scoreDistribution[r.score.toString()]++
    })

    const formatted = ratings.map((r) => ({
      score: r.score,
      comment: r.comment,
      createdAt: r.createdAt,
      ratedBy: {
        id: r.ratedBy.id,
        username: r.ratedBy.username,
        email: r.ratedBy.email,
        profilePicture: r.ratedBy.profilePicture,
      },
    }))

    return res.json({
      officialId: userId,
      totalRatingsReceived,
      averageRating,
      scoreDistribution,
      ratings: formatted,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching official ratings:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
