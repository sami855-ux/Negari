import express from "express"

import { protect } from "../middleware/protect.js"
import { authorizeRoles } from "../middleware/authorizedRoles.js"
import {
  createPolicy,
  getPolicyByRole,
  getSystemPoliciesFormatted,
  hardDeletePolicy,
  updatePolicy,
} from "../controllers/policy.controller.js"

const router = express.Router()

// create system policy
router.post("/", createPolicy)

// get system policy for a role
router.get("/role/:role", getPolicyByRole)

//Get all policies
router.get("/", getSystemPoliciesFormatted)

// update system policy
router.patch("/:role", updatePolicy)

// delete system policy
router.delete("/:policyId", hardDeletePolicy)

export default router
