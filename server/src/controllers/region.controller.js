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
