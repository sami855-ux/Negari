"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Lock, Eye, EyeOff } from "lucide-react"
import { axiosInstance } from "@/services/auth"
import { useRouter } from "next/navigation"

interface ResetPasswordForm {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string }
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>()

  const password = watch("password")

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Call your API endpoint using Axios
      const response = await axiosInstance.put(
        `/auth/reset-password/${params.token}`,
        {
          password: data.password,
        }
      )
      console.log(response.data)

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Password updated successfully!",
        })
      }
    } catch (error) {
      // Axios error handling
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage({
          type: "error",
          text: error.response.data.message,
        })
      } else {
        setMessage({
          type: "error",
          text: "An error occurred. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-[#00796B] text-center">
            Reset Password
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
          {/* New Password Field */}
          <div className="mb-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent transition-colors duration-200"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796B] focus:border-transparent transition-colors duration-200"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#00796B] hover:bg-[#00695C] text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>

          {/* Success/Error Messages */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? `${message.text}, ` : message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
