export const authorizeRoles = (allowedRoles = []) => {
  const set = new Set(allowedRoles.map((r) => r.toUpperCase()))

  return (req, res, next) => {
    try {
      //  Ensure the user object exists (set by your auth middleware)
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        })
      }

      // Check role membership
      const role = String(req.user.role).toUpperCase()

      if (!set.has(role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient role privileges",
        })
      }

      return next()
    } catch (err) {
      console.error("authorizeRoles error:", err)
      return res.status(500).json({
        success: false,
        message: "Role authorization failed",
        error: err.message,
      })
    }
  }
}
