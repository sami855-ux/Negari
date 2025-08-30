/*
 !Note: permission json looks like this:

{
  "canViewReports": true,
  "canVerifyReports": true,
  "canAssignReports": false,
  "canDeleteReports": false,
  "canUpdateReportStatus": true,

  "canViewUsers": true,
  "canEditUsers": false,
  "canSuspendUsers": false,
  "canAssignUserRoles": false,

  "canManageSettings": false,
  "canManageCategories": false,
  "canToggleSystemPolicy": false,

  "canViewAnalytics": false,
  "canExportReports": false,

  "canSendNotifications": false,
  "canRespondToFeedback": false,
  "canManageFeedback": false
}
*/
// Default permissions for fallback when a role has no policy
const defaultPermissions = {
  canViewReports: false,
  canVerifyReports: false,
  canAssignReports: false,
  canDeleteReports: false,
  canUpdateReportStatus: false,
  canViewUsers: false,
  canEditUsers: false,
  canSuspendUsers: false,
  canAssignUserRoles: false,
  canManageSettings: false,
  canManageCategories: false,
  canToggleSystemPolicy: false,
  canViewAnalytics: false,
  canExportReports: false,
  canSendNotifications: false,
  canRespondToFeedback: false,
  canManageFeedback: false,
}
import prisma from "../prisma/client.js"

export const createPolicy = async (req, res) => {
  try {
    const {
      role,
      permissions = {},
      description = "",
      isActive = true, // optional override
    } = req.body

    // Quick JSON‑shape check (permissions must be an object, not array/null)
    if (
      typeof permissions !== "object" ||
      permissions === null ||
      Array.isArray(permissions)
    ) {
      return res.status(400).json({
        message: "Permissions must be a JSON object (key/value pairs).",
        success: false,
      })
    }

    //  Check for duplicate role (one policy per role)
    const existing = await prisma.systemPolicy.findUnique({ where: { role } })
    if (existing) {
      return res.status(409).json({
        message: `Policy for role “${role}” already exists.`,
        success: false,
      })
    }

    // Create policy
    const newPolicy = await prisma.systemPolicy.create({
      data: {
        role,
        permissions,
        description,
        isActive,
      },
    })

    return res.status(201).json({
      message: "System policy created successfully.",
      data: newPolicy,
      success: true,
    })
  } catch (err) {
    console.error("CreatePolicy error:", err)
    return res.status(500).json({
      message: "Failed to create system policy.",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
      success: false,
    })
  }
}

// GET /api/policy/role/:role
export const getPolicyByRole = async (req, res) => {
  try {
    //  Grab the :role param
    const role = (req.params.role || "").toUpperCase()

    // Validate against Role enum (adjust if you add more roles)
    const allowedRoles = ["ADMIN", "OFFICIAL", "CITIZEN", "WORKER"]
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Expected one of: ${allowedRoles.join(", ")}`,
        success: false,
      })
    }

    // Query the SystemPolicy table (only active policies)
    const policy = await prisma.systemPolicy.findFirst({
      where: {
        role,
        isActive: true, // only return active policy
      },
      select: {
        id: true,
        role: true,
        permissions: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Handle not‑found (404) or inactive policy
    if (!policy) {
      return res.status(404).json({
        message: `No active policy found for role “${role}”.`,
        success: false,
      })
    }

    return res.status(200).json({
      message: "Policy fetched successfully.",
      data: policy,
      success: true,
    })
  } catch (err) {
    console.error("getPolicyByRole error:", err)

    return res.status(500).json({
      message: "Failed to fetch policy.",
      // hide stack in production
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
      success: false,
    })
  }
}

// PATCH /api/system-policies/:role
export const updatePolicy = async (req, res) => {
  try {
    const { role } = req.params
    const { permissions, description, isActive } = req.body

    console.log("UpdatePolicy body:", req.body)

    if (!role || typeof role !== "string") {
      return res.status(400).json({
        message: "Role parameter is required and must be a string.",
        success: false,
      })
    }

    const updates = {}

    if (permissions !== undefined) {
      if (
        typeof permissions !== "object" ||
        permissions === null ||
        Array.isArray(permissions)
      ) {
        return res.status(400).json({
          message: "Permissions must be a valid JSON object.",
          success: false,
        })
      }
      updates.permissions = permissions
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          message: "Description must be a string.",
          success: false,
        })
      }
      updates.description = description
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          message: "isActive must be true or false.",
          success: false,
        })
      }
      updates.isActive = isActive
    }

    const updated = await prisma.systemPolicy.update({
      where: { role },
      data: updates,
      select: {
        id: true,
        role: true,
        permissions: true,
        description: true,
        isActive: true,
        updatedAt: true,
      },
    })

    return res.status(200).json({
      message: "Policy updated successfully.",
      data: updated,
      success: true,
    })
  } catch (err) {
    console.error("updatePolicy error:", err)

    if (err.code === "P2025") {
      return res.status(404).json({ message: "Policy not found." })
    }

    return res.status(500).json({
      message: "Failed to update system policy.",
      success: false,
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    })
  }
}

// DELETE /api/system-policies/:policyId
export const hardDeletePolicy = async (req, res) => {
  try {
    const { policyId: id } = req.params

    await prisma.systemPolicy.delete({ where: { id } })

    return res
      .status(204)
      .json({ message: "Policy deleted successfully.", success: true })
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Policy not found." })
    }
    console.error("hardDeletePolicy error:", err)
    return res.status(500).json({ message: "Failed to delete policy." })
  }
}

export async function getSystemPoliciesFormatted(req, res) {
  try {
    const roles = ["CITIZEN", "WORKER", "OFFICER", "ADMIN"]

    const policies = await prisma.systemPolicy.findMany({
      where: {
        role: { in: roles },
        isActive: true,
      },
    })

    const policyMap = policies.reduce((acc, policy) => {
      acc[policy.role] = policy.permissions
      return acc
    }, {})

    const formatted = [
      {
        id: "citizen",
        name: "Citizen",
        description: "Basic user who can submit reports",
        icon: "user",
        permissions: policyMap["CITIZEN"] ?? defaultPermissions,
      },
      {
        id: "worker",
        name: "Worker",
        description: "Can process and verify reports",
        icon: "hardhat",
        permissions: policyMap["WORKER"] ?? defaultPermissions,
      },
      {
        id: "officer",
        name: "Officer",
        description: "Can manage reports and users",
        icon: "shield",
        permissions: policyMap["OFFICER"] ?? defaultPermissions,
      },
      {
        id: "admin",
        name: "Administrator",
        description: "Full system access",
        icon: "lock",
        permissions: policyMap["ADMIN"] ?? defaultPermissions,
      },
    ]
    console.log("policy")
    return res.status(200).json({
      data: formatted,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching system policies:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve system policies.",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
