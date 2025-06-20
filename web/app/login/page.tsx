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
import {
  Apple,
  Mail,
  Lock,
  Sparkles,
  PlaneTakeoffIcon,
  Send,
} from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>

      <div className="relative z-10 w-full max-w-lg px-4 py-12 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        {/* Header */}

        {/* Main Card */}
        <Card className="backdrop-blur-sm w-[40vw] bg-white/80 border-1 border-gray-200 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <CardHeader className="relative space-y-1 pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-base">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6 px-8 pb-8">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 bg-white/90 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-700 font-medium transition-all duration-200 hover:shadow-md group"
                type="button"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
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

              <Button
                variant="outline"
                className="w-full h-12 bg-[#0088cc] hover:bg-[#007ebd] text-white border-2 border-[#0088cc] font-medium transition-all duration-200 hover:shadow-md group"
                type="button"
              >
                <Send className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Continue with Telegram
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-12 border-2 border-gray-200 outline-none focus:border-blue-500  rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-2 text-blue-600" />
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                className="w-full font-geist h-12 text-[15px]  text-white bg-[#0a581b] hover:bg-[#023d0f]/90 border border-gray-200 font-semibold  hover:shadow-xl  duration-200 transform"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-3 text-gray-600 text-center font-geist text-[15px]">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-2">
          <p className="text-sm text-gray-500 leading-relaxed">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
