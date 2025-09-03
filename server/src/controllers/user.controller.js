import prisma from "../prisma/client.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        reportsSubmitted: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    console.error("❌ Error fetching users with related data:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId: id } = req.params

    const deletedUser = await prisma.user.delete({
      where: { id },
    })
    res.status(200).json({
      success: true,
      data: deletedUser,
    })
  } catch (error) {
    console.error("❌ Error deleting user:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { userId: id } = req.params
    const { role } = req.body

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    })

    res.status(200).json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    console.error("❌ Error updating user:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const createRegionAndAssignOfficial = async (req, res) => {
  const { name, polygon, officialId } = req.body

  console.log(req.body)

  // Validate input
  if (!name || !polygon || !officialId) {
    return res.status(400).json({
      message: "Region name, polygon, and officialId are required.",
      success: false,
    })
  }

  try {
    // Step 1: Validate Official
    const official = await prisma.user.findUnique({
      where: { id: officialId },
      include: { region: true }, // check if official already has a region
    })

    if (!official || official.role !== "OFFICER") {
      return res
        .status(400)
        .json({ message: "User is not a valid official.", success: false })
    }

    // Step 2: Prevent multiple region assignments
    if (official.region) {
      return res.status(400).json({
        message: `Official '${official.username}' is already assigned to region '${official.region.name}'.`,
        success: false,
      })
    }

    // Step 3: Create Region
    const region = await prisma.region.create({
      data: {
        name,
        polygon,
      },
    })

    // Step 4: Assign region to the official
    const updatedOfficial = await prisma.user.update({
      where: { id: officialId },
      data: {
        regionId: region.id,
      },
      include: { region: true },
    })

    return res.status(201).json({
      message: `Region created and assigned to official '${official.username}' successfully.`,
      region,
      official: updatedOfficial,
      success: true,
    })
  } catch (error) {
    console.error("Error in createRegionAndAssignOfficial:", error)
    return res
      .status(500)
      .json({ message: "Internal server error.", success: false })
  }
}

export const getUserWithDetails = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        // Region
        region: true,
        // Reports
        reportsSubmitted: true,
        reportsAssignedToMe: true,
        reportsAssignedToWorker: true,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false })
    }

    res.json({ user, success: true })
  } catch (error) {
    console.error("Error fetching user:", error)
    res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false })
  }
}

export const getWorkers = async (req, res) => {
  try {
    const workers = await prisma.user.findMany({
      where: { role: "WORKER" },
      select: {
        id: true,
        username: true,
      },
    })

    res.json({ workers, success: true })
  } catch (error) {
    console.error("Error fetching workers:", error)
    res.status(500).json({ error: "Failed to fetch workers", success: false })
  }
}
