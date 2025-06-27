"use client"

import TelegramLoginWidget from "@/components/TelegramLogi"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signInUser } from "@/services/auth"
import { Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleClickGoogle = () => {
    // Handle Google sign-in logic here
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/google`
  }

  const handleSignIn = async (data: { email: string; password: string }) => {
    // Handle sign-in logic here
    console.log(data)

    try {
      setIsLoading(true)
      const res = await signInUser(data)
      if (res.success) {
        toast.success("Logged in successfully!")
      } else {
        console.error("Sign in failed:", res.message)
        toast.error(res.message || "Failed to log in")
        return
      }

      reset() // Reset form fields after successful submission
    } catch (error) {
      console.log("Error signing in:", error)
      toast.error(error.message || "Failed to log in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}

        {/* Main Card */}
        <Card className="backdrop-blur-sm w-[80vw] md:w-[50vw] bg-white/80 border-1 border-gray-200 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <CardHeader className="relative pt-8 pb-6 space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-transparent bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-base text-center text-gray-600">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="relative px-8 pb-8 space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 font-medium text-gray-700 transition-all duration-200 border-2 border-gray-200 bg-white/90   group"
                type="button"
              >
                <div
                  className="flex items-center justify-center"
                  onClick={handleClickGoogle}
                >
                  <svg
                    className="w-5 h-5 mr-3 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </div>
              </Button>

              <TelegramLoginWidget />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="px-4 font-medium text-gray-500 bg-white">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form
              className="space-y-5"
              onSubmit={handleSubmit((data) => {
                handleSignIn(data)
              })}
            >
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center text-sm font-semibold text-gray-700"
                >
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Email address
                </Label>
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-12 transition-all duration-200 border-2 border-gray-200 outline-none focus:border-blue-500 rounded-xl bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="flex items-center text-sm font-semibold text-gray-700"
                  >
                    <Lock className="w-4 h-4 mr-2 text-blue-600" />
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-12 transition-all duration-200 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}

              <Button
                type="submit"
                className={`${
                  isLoading ? "bg-[#509d61] cursor-not-allowed" : "bg-[#1c4625]"
                } w-full font-geist h-12 text-[15px]  text-white  hover:bg-[#1c4625] border border-gray-200 font-semibold  hover:shadow-xl  duration-200 transform`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin" />
                    <span className="text-gray-200">Signing in...</span>
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="mt-3 text-gray-600 text-center font-geist text-[15px]">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-500"
              >
                Sign up for free
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-2 text-center">
          <p className="text-sm leading-relaxed text-gray-500">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
