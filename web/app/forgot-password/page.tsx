"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { forgotPassword } from "@/services/auth"

type FormValues = {
  email: string
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const res = await forgotPassword(data.email)

      console.log(res)
      if (res.success) {
        setMessage({
          type: "success",
          text:
            res.message ||
            "Reset link sent! Check your email for instructions.",
        })

        reset()
      } else {
        setMessage({
          type: "error",
          text: res.error || "Failed to send reset link. Please try again.",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.error || "Failed to send reset link. Please try again1.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold text-[#00796B] text-center font-geist">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-gray-600 text-center font-jakarta">
            Enter your registered email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="pl-10 pr-4 py-6 rounded-lg border-gray-300 focus:border-[#00796B] focus:ring-[#00796B]"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm font-geist mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 rounded-lg bg-[#00796B] hover:bg-[#00695C] text-white font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-center ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <span className="font-geist">{message.text}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
