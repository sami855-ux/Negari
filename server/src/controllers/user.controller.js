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

  // Validate input
  if (!name || !polygon || !officialId) {
    return res
      .status(400)
      .json({ message: "Region name, polygon, and officialId are required." })
  }

  try {
    // Step 1: Validate Official
    const official = await prisma.user.findUnique({
      where: { id: officialId },
    })

    if (!official || official.role !== "OFFICER") {
      return res.status(400).json({ message: "User is not a valid official." })
    }

    // Step 2: Create Region
    const region = await prisma.region.create({
      data: {
        name,
        polygon,
      },
    })

    // Step 3: Assign region to the official
    const updatedOfficial = await prisma.user.update({
      where: { id: officialId },
      data: {
        regionId: region.id,
      },
      include: { region: true },
    })

    return res.status(201).json({
      message: `Region '${region.name}' created and assigned to official '${official.username}' successfully.`,
      region,
      official: updatedOfficial,
    })
  } catch (error) {
    console.error("Error in createRegionAndAssignOfficial:", error)
    return res.status(500).json({ message: "Internal server error." })
  }
}
