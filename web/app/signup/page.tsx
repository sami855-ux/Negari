"use client"

import { useState } from "react"
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
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm, SubmitHandler } from "react-hook-form"
import { signUpUser } from "@/services/auth"
import toast from "react-hot-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setUser } from "@/store/slices/userSlice"

interface RegisterFormData {
  username: string
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>() // ✅ typed form

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      setIsLoading(true)
      const res = await signUpUser(data)
      if (res.success) {
        dispatch(setUser(res.user))
        toast.success("Account created successfully!")
        reset()
        // Redirect if needed
        router.push("/official")
      } else {
        toast.error(res.message || "Sign up failed")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with image + overlay text */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-800 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tbXVuaXR5JTIwc2VydmljZXxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
            alt="Community work background"
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
          <h2 className="text-4xl font-bold mb-4 font-jakarta">
            Join Our Community
          </h2>
          <p className="text-lg text-white/90 max-w-md font-jakarta">
            Create an account and unlock access to powerful tools, secure
            features, and seamless experiences built with your growth in mind.
          </p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg border-none bg-white  rounded-2xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Join us today and get started in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <Input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  id="username"
                  type="text"
                  placeholder="Enter your full name"
                  className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message as string}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
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
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="h-12 pr-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin" />
                    <span>Creating account...</span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
