import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import passport from "passport"
import dotenv from "dotenv"

import prisma from "../prisma/client.js"

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
      callbackURL: "http://localhost:5000/api/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists by Google ID
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        })

        if (!user) {
          // New user — create record
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
              username: profile.displayName,
              profilePicture: profile.photos[0].value,
            },
          })
        }

        console.log(`User ${user.username} authenticated with Google`)
        // Return user to Passport
        done(null, user)
      } catch (error) {
        done(error, null)
      }
    }
  )
)
