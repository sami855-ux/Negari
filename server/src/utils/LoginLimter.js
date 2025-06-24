import rateLimit from "express-rate-limit"
//For brute force attack prevention on login attempts

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts
  message: "Too many login attempts. Try again later.",
})
export default loginLimiter
