import prisma from "../prisma/client.js"

// Get all regions
export const getAllRegions = async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        users: true,
      },
    })

    return res.status(200).json({
      success: true,
      count: regions.length,
      data: regions,
    })
  } catch (error) {
    console.error("Error fetching regions:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch regions",
      error: error.message,
    })
  }
}

export const getRegionByOfficer = async (req, res) => {
  const { officerId } = req.params

  try {
    const official = await prisma.user.findUnique({
      where: { id: officerId },
      include: {
        region: {
          include: {
            reports: true,
          },
        },
      },
    })

    if (!official || official.role !== "OFFICER") {
      return res.status(404).json({
        message: "Officer not found or not a valid official.",
        success: false,
      })
    }

    if (!official.region) {
      return res.status(404).json({
        message: `Official '${official.username}' has no region assigned.`,
        success: false,
      })
    }

    return res.status(200).json({
      message: "Region fetched successfully.",
      data: official.region,
      success: true,
    })
  } catch (error) {
    console.error("Error in getRegionByOfficer:", error)
    return res
      .status(500)
      .json({ message: "Internal server error.", success: false })
  }
}
