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

export const searchUser = async (req, res) => {
  try {
    const officerId = req.user.id
    const searchQuery = req.query.username?.toString().trim().toLowerCase()

    if (!searchQuery) {
      return res
        .status(400)
        .json({ success: false, message: "Username query is required" })
    }

    // Fetch officer with region
    const officer = await prisma.user.findUnique({
      where: { id: officerId },
      select: { regionId: true },
    })

    if (!officer) {
      return res
        .status(404)
        .json({ success: false, message: "Officer not found" })
    }

    // Get IDs of citizens who submitted reports in officer's region
    const citizenReports = await prisma.report.findMany({
      where: { regionId: officer.regionId },
      select: { reporterId: true },
      distinct: ["reporterId"],
    })
    const citizenIds = citizenReports.map((r) => r.reporterId)

    // Fetch all relevant users except the current user
    const allUsers = await prisma.user.findMany({
      where: {
        NOT: { id: officerId }, // exclude current user
        OR: [
          { id: { in: citizenIds } }, // citizens reporting in region
          { role: "ADMIN" },
          { role: "WORKER" },
          { role: "OFFICER" },
        ],
        username: { contains: searchQuery, mode: "insensitive" }, // search filter
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        role: true,
        isOnline: true,
        lastSeen: true,
      },
      orderBy: { username: "asc" },
    })

    if (allUsers.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" })
    }

    return res.status(200).json({ success: true, users: allUsers })
  } catch (error) {
    console.error("Error searching user:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

export const searchUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id
    const searchQuery = req.query.username?.toString().trim()

    if (!searchQuery) {
      return res
        .status(400)
        .json({ success: false, message: "Username query is required" })
    }

    // Fetch users excluding the current user
    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId }, // exclude self
        username: { contains: searchQuery, mode: "insensitive" }, // case-insensitive search
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        role: true,
        isOnline: true,
        lastSeen: true,
      },
      orderBy: { username: "asc" },
    })

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" })
    }

    return res.status(200).json({ success: true, users })
  } catch (error) {
    console.error("Error searching users:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

export const getOfficerDashboard = async (req, res) => {
  try {
    const { officerId } = req.user?.id

    // 1. Count reports assigned to this officer
    const totalAssigned = await prisma.report.count({
      where: { assignedToId: officerId },
    })

    // 2. Get 3 most recent assigned reports
    const recentReports = await prisma.report.findMany({
      where: { assignedToId: officerId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        severity: true,
        location: {
          select: {
            latitude: true,
            longitude: true,
            address: true,
            city: true,
            region: true,
          },
        },
      },
    })

    // 3. Count reports by status
    const inProgressCount = await prisma.report.count({
      where: {
        assignedToId: officerId,
        status: "IN_PROGRESS",
      },
    })

    const resolvedCount = await prisma.report.count({
      where: {
        assignedToId: officerId,
        status: "RESOLVED",
      },
    })

    // 4. Citizen feedback rating (average, default 5 if none)
    const feedback = await prisma.rating.aggregate({
      where: { officialId: officerId },
      _avg: { score: true },
    })

    const avgRating = feedback._avg.score || 5

    return res.status(200).json({
      success: true,
      data: {
        officerId,
        totalAssigned,
        inProgressCount,
        resolvedCount,
        recentReports,
        avgRating,
      },
    })
  } catch (error) {
    console.error("Error fetching officer dashboard:", error)
    res.status(500).json({ error: "Failed to fetch officer dashboard" })
  }
}
