//Accepted data looks like
/*
{
  "title": "Pothole on main street",
  "description": "There's a dangerous pothole near the intersection.",
  "category": "INFRASTRUCTURE",
  "imageUrls": ["https://cloudinary.com/pothole.jpg"],
  "videoUrl": null,
  "reporterId": "user-uuid-123",
  "severity": "HIGH",
  "isAnonymous": false,
  "tags": ["road", "urgent"],
  "location": {
    "latitude": 9.0321,
    "longitude": 38.7547,
    "address": "Main Street, Addis Ababa",
    "city": "Addis Ababa",
    "region": "Addis Ababa"
  }
}
*/
import cloudinary from "../utils/cloudinary.js"
import prisma from "../prisma/client.js"
import { checkSpam, checkToxicityHF } from "../utils/spamChecker.js"
import { analyzeImageSeverity } from "../utils/AnalyzeImage.js"

const DUPLICATE_RADIUS_M = 100
const VALID_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
  "VERIFIED",
  "NEEDS_MORE_INFO",
]

const metersToLatDegrees = (m) => m / 111_320
const metersToLonDegrees = (m, lat) =>
  m / (111_320 * Math.cos((lat * Math.PI) / 180))

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180
  const R = 6371e3
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1),
    Δλ = toRad(lon2 - lon1)
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

const uploadToCloudinary = (fileBuffer, folder = "negari/reports") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )
    uploadStream.end(fileBuffer)
  })
}

export const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category, // Can be null if AI is used
      reporterId,
      severity,
      tags,
      location,
    } = req.body

    const isAnonymous = req.body.isAnonymous === "true"
    const useAICategory = req.body.useAiCategory === "true"
    const parsedLocation = JSON.parse(location)
    const parsedTags = JSON.parse(tags)

    // Upload images
    let imageUrls = []
    if (req.files.images) {
      for (const file of req.files.images) {
        const uploadStream = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "negari/reports" },
            (error, result) => (error ? reject(error) : resolve(result))
          )
          stream.end(file.buffer)
        })
        imageUrls.push(uploadStream.secure_url)
      }
    }

    // Upload video
    let videoUrl = null
    if (req.files.video) {
      const uploadStream = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "negari/reports" },
          (error, result) => (error ? reject(error) : resolve(result))
        )
        stream.end(req.files.video[0].buffer)
      })
      videoUrl = uploadStream.secure_url
    }

    const { latitude, longitude, address, city, region } = parsedLocation

    // Determine categoryId safely
    let foundCategoryId = null
    if (category && !useAICategory) {
      const foundCategory = await prisma.reportCategory.findFirst({
        where: { name: category },
      })
      if (!foundCategory) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category." })
      }
      foundCategoryId = foundCategory.id
    }

    // Create location
    const createdLocation = await prisma.location.create({
      data: { latitude, longitude, address, city, region },
    })

    // Assign region and official logic
    const regions = await prisma.region.findMany()
    let reportRegion = null
    for (const r of regions) {
      if (r.polygon && isPointInPolygon([longitude, latitude], r.polygon)) {
        reportRegion = r
        break
      }
    }

    let assignedOfficial = null
    if (reportRegion) {
      assignedOfficial = await prisma.user.findFirst({
        where: { role: "OFFICER", regionId: reportRegion.id },
      })
    }

    if (!assignedOfficial) {
      const allOfficials = await prisma.user.findMany({
        where: { role: "OFFICER" },
        include: { region: true },
      })
      let minDistance = Infinity
      for (const official of allOfficials) {
        if (!official.region?.polygon) continue
        const poly = official.region.polygon
        const center = getPolygonCenter(poly)
        const dist = calculateDistance(
          latitude,
          longitude,
          center[1],
          center[0]
        )
        if (dist < minDistance) {
          minDistance = dist
          assignedOfficial = official
        }
      }
    }

    // Create report immediately
    const newReport = await prisma.report.create({
      data: {
        title,
        description,
        categoryId: foundCategoryId || null,
        imageUrls,
        videoUrl,
        reporterId,
        severity,
        isAnonymous,
        tags: parsedTags,
        locationId: createdLocation.id,
        assignedToId: assignedOfficial?.id || null,
        regionId: reportRegion?.id,
      },
      include: {
        location: true,
        reporter: true,
        category: true,
        assignedTo: true,
        Region: true,
      },
    })

    // Send immediate response
    // 1️⃣ Send response immediately
    res.status(201).json({
      success: true,
      message: "Report created successfully",
      data: newReport,
    })

    // 2️⃣ Fire-and-forget AI processing
    ;(async () => {
      try {
        let bestResult = await analyzeImageSeverity(imageUrls) // imageUrls is an array

        // Map category to DB
        let mappedCategoryId

        if (bestResult.category === "UNKNOWN") {
          // If AI could not detect category, default to INFRASTRUCTURE
          const infrastructureCategory = await prisma.reportCategory.findFirst({
            where: { name: "INFRASTRUCTURE" },
          })
          if (infrastructureCategory) {
            mappedCategoryId = infrastructureCategory.id
            bestResult.category = "INFRASTRUCTURE"
          }
        } else if (useAICategory) {
          const category = await prisma.reportCategory.findFirst({
            where: { name: bestResult.category },
          })
          if (category) mappedCategoryId = category.id
        }

        // Update report with AI results
        await prisma.report.update({
          where: { id: newReport.id },
          data: {
            severity: bestResult.severity,
            confidenceScore: bestResult.confidence,
            categoryId: mappedCategoryId,
          },
        })

        // Optional: Spam/Toxicity processing here (same pattern)
        if (newReport.title || newReport.description) {
          try {
            const spamResult = await checkSpam(
              `${newReport.title} ${newReport.description}`
            )

            if (spamResult) {
              await prisma.report.update({
                where: { id: newReport.id },
                data: { spamScore: spamResult.spamScore },
              })
            }
          } catch (spamError) {
            console.error("Spam check failed:", spamError)
          }
        }

        // Process toxicity check
        if (newReport.title || newReport.description) {
          try {
            const toxicityResult = await checkToxicityHF(
              `${newReport.title} ${newReport.description}`
            )
            if (toxicityResult) {
              await prisma.report.update({
                where: { id: newReport.id },
                data: { toxicityScore: toxicityResult },
              })
            }
          } catch (toxicityError) {
            console.error("Toxicity check failed:", toxicityError)
          }
        }

        console.log("AI processing completed successfully")
      } catch (err) {
        console.error("Background AI processing failed:", err)
      }
    })()
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message })
  }
}

// export const createReport = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       category,
//       imageUrls = [],
//       videoUrl = null,
//       reporterId,
//       severity,
//       isAnonymous,
//       tags = [],
//       location,
//     } = req.body

//     // Validate required fields
//     if (!title || !description || !category || !reporterId || !location) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields." })
//     }

//     const { latitude, longitude, address, city, region } = location

//     // Validate category
//     const foundCategory = await prisma.reportCategory.findFirst({
//       where: { name: category },
//     })
//     if (!foundCategory) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid category." })
//     }

//     // Check for duplicate reports nearby
//     const latDiff = metersToLatDegrees(DUPLICATE_RADIUS_M)
//     const lonDiff = metersToLonDegrees(DUPLICATE_RADIUS_M, latitude)
//     const duplicate = await prisma.report.findFirst({
//       where: {
//         categoryId: foundCategory.id,
//         location: {
//           latitude: { gte: latitude - latDiff, lte: latitude + latDiff },
//           longitude: { gte: longitude - lonDiff, lte: longitude + lonDiff },
//         },
//       },
//     })
//     if (duplicate) {
//       return res.status(409).json({
//         success: false,
//         message: "Duplicate report nearby",
//         duplicateId: duplicate.id,
//       })
//     }

//     // Create location record
//     const createdLocation = await prisma.location.create({
//       data: { latitude, longitude, address, city, region },
//     })

//     // Region assignment
//     const regions = await prisma.region.findMany()
//     let reportRegion = null
//     for (const r of regions) {
//       if (r.polygon && isPointInPolygon([longitude, latitude], r.polygon)) {
//         reportRegion = r
//         break
//       }
//     }

//     let assignedOfficial = null
//     if (reportRegion) {
//       assignedOfficial = await prisma.user.findFirst({
//         where: { role: "OFFICER", regionId: reportRegion.id },
//       })
//     }

//     // Fallback: nearest officer
//     if (!assignedOfficial) {
//       const allOfficials = await prisma.user.findMany({
//         where: { role: "OFFICER" },
//         include: { region: true },
//       })
//       let minDistance = Infinity
//       for (const official of allOfficials) {
//         if (!official.region?.polygon) continue
//         const poly = official.region.polygon
//         const center = getPolygonCenter(poly)
//         const dist = calculateDistance(
//           latitude,
//           longitude,
//           center[1],
//           center[0]
//         )
//         if (dist < minDistance) {
//           minDistance = dist
//           assignedOfficial = official
//         }
//       }
//     }

//     // Create report
//     const newReport = await prisma.report.create({
//       data: {
//         title,
//         description,
//         categoryId: foundCategory.id,
//         imageUrls,
//         videoUrl,
//         reporterId,
//         severity,
//         isAnonymous,
//         tags,
//         locationId: createdLocation.id,
//         assignedToId: assignedOfficial?.id || null,
//         regionId: reportRegion?.id || null,
//       },
//       include: {
//         location: true,
//         reporter: true,
//         category: true,
//         assignedTo: true,
//         Region: true,
//       },
//     })

//     return res.status(201).json({
//       success: true,
//       message: "Report created successfully",
//       data: newReport,
//     })
//   } catch (err) {
//     console.error(err)
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message,
//     })
//   }
// }

// Geo helpers
const isPointInPolygon = (point, polygon) => {
  const [x, y] = point
  let inside = false
  const poly = polygon.coordinates[0]
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0],
      yi = poly[i][1]
    const xj = poly[j][0],
      yj = poly[j][1]
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

const getPolygonCenter = (polygon) => {
  const coords = polygon.coordinates[0]
  let sumX = 0,
    sumY = 0
  coords.forEach(([x, y]) => {
    sumX += x
    sumY += y
  })
  return [sumX / coords.length, sumY / coords.length]
}

export const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        location: true,
        AssignedReports_worker: true,
        reporter: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        feedback: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const result = reports.map((report) => ({
      ...report,
      category: report.category?.name || null,
      AssignedReports_worker: report.AssignedReports_worker?.username || null,
    }))

    res.status(200).json({ reports: result, success: true })
  } catch (error) {
    console.error("Error fetching reports:", error)
    res.status(500).json({ message: "Failed to fetch reports", error })
  }
}

export const getReportsByStatus = async (req, res) => {
  const status = req.params.status

  console.log(status)
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" })
  }

  try {
    const reports = await prisma.report.findMany({
      where: { status },
      include: {
        location: true,
        reporter: true,
        assignedTo: true,
        feedback: true,
        AssignedReports_worker: true,
        reporter: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const result = reports.map((report) => ({
      ...report,
      category: report.category?.name || null,
      AssignedReports_worker: report.AssignedReports_worker?.username || null,
    }))

    res.json({ reports: result, success: true })
  } catch (error) {
    console.error("Error fetching reports by status:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// ! Get all report => for the official in a specific format
export const getReportsOfficial = async (req, res) => {
  const { id } = req.params // this is the official's user ID

  try {
    const reports = await prisma.report.findMany({
      where: { assignedToId: id },
      include: {
        location: true,
        reporter: true,
        category: true,
        assignedTo: true,
      },
    })

    if (!reports.length) {
      return res
        .status(404)
        .json({ message: "No reports found for this official", success: false })
    }

    const data = reports.map((report) => ({
      id: report.id,
      title: report.title,
      description: report.description,
      location:
        report.location?.city ||
        report.location?.region ||
        report.location?.address ||
        "Unknown",
      reportedOn: report.createdAt,
      archivedOn: report.resolvedAt,

      urgency: report.severity,
      status: report.status,
      category: report.category?.name || "Uncategorized",
      reportedBy: report.isAnonymous
        ? "Anonymous"
        : report.reporter?.username || "Unknown",
      assignedTo: report.assignedTo?.username || "Unassigned",
      resolution: report.resolutionNote || "Not yet resolved",
    }))

    res.status(200).json({ data, success: true })
  } catch (err) {
    console.error("Failed to fetch official's reports:", err)
    res
      .status(500)
      .json({ message: "Internal Server Error" + err.message, success: false })
  }
}

export const getReportById = async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        reporter: true,
        assignedTo: true,
        feedback: true,
        AssignedReports_worker: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!report) {
      return res
        .status(404)
        .json({ message: "Report not found", success: false })
    }

    const result = {
      ...report,
      category: report.category?.name || null,
      AssignedReports_worker:
        report.AssignedReports_worker?.username || "Unassigned",
    }

    return res.json({ report: result, success: true, message: "Report found" })
  } catch (error) {
    console.error("Error fetching report by ID:", error)
    return res
      .status(500)
      .json({ message: "Internal server error", error, success: false })
  }
}

export const getReportAssignedToWorker = async (req, res) => {
  try {
    const workerId = req.user.id

    if (!workerId) {
      return res
        .status(400)
        .json({ error: "Worker ID is required", success: false })
    }

    const report = await prisma.report.findFirst({
      where: {
        assignedToWorkerId: workerId,
        status: "VERIFIED",
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
        location: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc", // gets the latest one
      },
    })

    return res.status(200).json({
      success: true,
      report,
    })
  } catch (error) {
    console.error("Error fetching assigned reports:", error)
    res
      .status(500)
      .json({ error: "Failed to fetch reports for worker", success: false })
  }
}

export const getReportAssignedInprogress = async (req, res) => {
  try {
    const workerId = req.user.id

    if (!workerId) {
      return res
        .status(400)
        .json({ error: "Worker ID is required", success: false })
    }

    const report = await prisma.report.findFirst({
      where: {
        assignedToWorkerId: workerId,
        status: "IN_PROGRESS",
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
        location: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc", // gets the latest one
      },
    })

    return res.status(200).json({
      success: true,
      report,
    })
  } catch (error) {
    console.error("Error fetching assigned reports:", error)
    res
      .status(500)
      .json({ error: "Failed to fetch reports for worker", success: false })
  }
}

export const getAllReportsAssignedToWorker = async (req, res) => {
  try {
    const workerId = req.user.id

    if (!workerId) {
      return res
        .status(400)
        .json({ error: "Worker ID is required", success: false })
    }

    const reports = await prisma.report.findMany({
      where: {
        assignedToWorkerId: workerId,
        status: {
          in: ["RESOLVED", "REJECTED"],
        },
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
        location: true,
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    const result = reports.map((report) => ({
      ...report,
      category: report.category?.name || null,
      location:
        report.location.city ||
        report.location.region ||
        report.location.address ||
        "Addis abeba",
    }))

    return res.status(200).json({
      success: true,
      reports,
    })
  } catch (error) {
    console.error("Error fetching assigned reports:", error)
    res
      .status(500)
      .json({ error: "Failed to fetch reports for worker", success: false })
  }
}

export const changeReportStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, resolutionNote } = req.body

    // Basic validation: check if status is provided and valid
    const allowedStatuses = [
      "PENDING",
      "IN_PROGRESS",
      "RESOLVED",
      "REJECTED",
      "VERIFIED",
      "NEEDS_MORE_INFO",
    ]
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`,
      })
    }

    // Update the report status
    const updated = await prisma.report.update({
      where: { id },
      data: {
        status,
        resolutionNote: resolutionNote || undefined,
        resolvedAt: status === "RESOLVED" ? new Date() : null,
        inProgressAt: status === "IN_PROGRESS" ? new Date() : null,
      },
    })

    return res.json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    })
  } catch (error) {
    console.error("Error updating report status:", error)
    // Handle case where report with given id does not exist
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message || "Unknown error",
    })
  }
}

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params

    // Find the report with its locationId
    const report = await prisma.report.findUnique({
      where: { id },
      select: { locationId: true },
    })

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
        success: false,
      })
    }

    // Delete all feedback related to this report
    await prisma.feedback.deleteMany({
      where: { reportId: id },
    })

    // Delete the report itself
    await prisma.report.delete({
      where: { id },
    })

    // Delete the location if exists
    if (report.locationId) {
      await prisma.location.delete({
        where: { id: report.locationId },
      })
    }

    res.json({
      message: "Report and related feedback & location deleted successfully",
      success: true,
    })
  } catch (err) {
    console.error("deleteReport error:", err)
    res.status(500).json({
      message: "Failed to delete report",
      success: false,
      error: err.message,
    })
  }
}

export const submitFeedback = async (req, res) => {
  try {
    console.log(req.params)
    const id = req.params.id // reportId
    let { rating, comment } = req.body

    // Validate rating is between 1 and 5
    rating = parseFloat(rating)
    if (isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 0.0 and 5.0",
      })
    }

    // Round to 1 decimal place
    rating = Math.round(rating * 10) / 10

    // Check if report exists
    const existingReport = await prisma.report.findUnique({
      where: { id },
    })

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }

    // Prevent duplicate feedback on same report by same user
    // const alreadyGiven = await prisma.feedback.findFirst({
    //   where: {
    //     reportId: id,
    //     reporterId: req.user.id,
    //   },
    // })

    // if (alreadyGiven) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Feedback already submitted for this report",
    //   })
    // }

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment,
        reportId: id,
      },
    })

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    })
  } catch (err) {
    console.error("submitFeedback error:", err)
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: err.message,
    })
  }
}

//! On the mobile
export const getReportsByUser = async (req, res) => {
  try {
    const { id } = req.params

    const reports = await prisma.report.findMany({
      where: { reporterId: id },
      include: {
        location: true,
        feedback: true,
        category: true,
        assignedTo: true,
      },
    })

    console.log(reports)
    if (reports.length === 0) {
      return res
        .status(404)
        .json({ message: "No reports found", success: false })
    }

    const result = reports.map((report) => ({
      ...report,
      category: report.category?.name || null,
      assignedOfficer: report.assignedTo?.username || "Unassigned",
      AssignedReports_worker:
        report.AssignedReports_worker?.username || "Unassigned",
      location:
        report.location.city ||
        report.location.region ||
        report.location.address ||
        "Unknown",
    }))

    res.json({
      reports: result,
      success: true,
      message: "successfully fetched",
    })
  } catch (err) {
    console.error("getReportsByUser error:", err)
    res
      .status(500)
      .json({ message: "Failed to fetch user reports", success: false })
  }
}

export const getOfficerReports = async (req, res) => {
  const { officerId } = req.params

  try {
    //Find the officer and their region
    const officer = await prisma.user.findUnique({
      where: { id: officerId },
      include: { region: true },
    })

    if (!officer) {
      return res
        .status(404)
        .json({ message: "Officer not found", success: false })
    }

    if (!officer.regionId) {
      return res
        .status(400)
        .json({ message: "Officer has no region assigned", success: false })
    }

    // Step 2: Get all reports in the officer's region
    const reports = await prisma.report.findMany({
      where: {
        assignedToId: officerId,
        status: {
          not: "PENDING",
        },
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
          },
        },
        category: true,
        location: true,
        assignedTo: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res
      .status(200)
      .json({ region: officer.region.name, reports, success: true })
  } catch (error) {
    console.error("Error fetching reports:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updateReportDynamic = async (req, res) => {
  try {
    const { id } = req.params
    const allowedFields = [
      "title",
      "description",
      "category",
      "imageUrls",
      "videoUrl",
      "status",
      "severity",
      "resolutionNote",
      "isAnonymous",
      "tags",
      "assignedToId",
      "assignedToWorkerId",
    ]

    // Only include allowed fields
    const updateData = {}

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key]
      }
    }

    // If updating status to "RESOLVED", auto set resolvedAt
    if (updateData.status === "RESOLVED") {
      updateData.resolvedAt = new Date()
    }

    if (updateData.status === "IN_PROGRESS") {
      updateData.inProgressAt = new Date()
    }
    if (updateData.status === "REJECTED") {
      updateData.rejectedAt = new Date()
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: updateData,
    })

    res.json({ updatedReport, success: true })
  } catch (err) {
    console.error("updateReportDynamic error:", err)
    res.status(500).json({ message: "Failed to update report" })
  }
}

export const getCriticalReports = async (req, res) => {
  const { officialId } = req.params

  if (!officialId) {
    return res
      .status(400)
      .json({ message: "officialId is required", success: false })
  }

  try {
    const criticalReports = await prisma.report.findMany({
      where: {
        severity: "CRITICAL",
        assignedToId: officialId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        location: true,
        reporter: true,
        assignedTo: true,
        AssignedReports_worker: true,
        feedback: true,
        Region: true,
        User: true,
        category: true,
      },
    })

    res
      .status(200)
      .json({ criticalReports, success: true, message: "successfully fetched" })
  } catch (error) {
    console.error("Error fetching CRITICAL reports:", error)
    res.status(500).json({ message: "Something went wrong", success: false })
  }
}

export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params
    const { resolutionNote } = req.body

    // Upload resolution images (if provided)
    let uploadedImages = []
    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      )
    }

    // Update report in Prisma
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status: "RESOLVED",
        resolutionNote: resolutionNote || null,
        resolvedAt: new Date(),
        resolutionImages: {
          push: uploadedImages, // Prisma push for String[]
        },
      },
    })

    res.status(200).json({
      message: "Report resolved successfully",
      report: updatedReport,
      success: true,
    })
  } catch (error) {
    console.error("Resolve report error:", error)
    res.status(500).json({ error: "Failed to resolve report", success: false })
  }
}
