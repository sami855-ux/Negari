"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Apple,
  Play,
  Shield,
  Clock,
  Zap,
  ArrowLeft,
  X,
  AlertTriangle,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function HomePage() {
  const [showWarning, setShowWarning] = useState(true)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Warning/Information Banner */}
      {showWarning && (
        <div className="w-full bg-amber-100 border-b border-amber-300 text-amber-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p className="text-sm font-medium">
              Official Government Application - For citizens use the Mobile
              application by downloading it from the Play Store or Apple App
              Store
            </p>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-amber-700 hover:text-amber-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-4 md:py-7 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
          {/* Go Back Button */}
          <Button
            variant="ghost"
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 text-xs font-semibold py-1 px-3">
                  OFFICIAL GOVERNMENT APPLICATION
                </Badge>
                <h1 className="text-lg md:text-2xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                  Streamlined <span className="text-teal-600">Civic</span>{" "}
                  Services
                </h1>
              </div>

              <p className="text-base text-gray-600 max-w-lg">
                Access all government services conveniently through our official
                mobile application. Register once and gain access to multiple
                services with a single secure account.
              </p>

              <div className="">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-teal-100 rounded-full mr-4">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Secure digital reporting system
                  </span>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-teal-100 rounded-full mr-4">
                    <Zap className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Access to all government services
                  </span>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="p-2 bg-teal-100 rounded-full mr-4">
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    24/7 availability from your mobile device
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className="font-medium text-gray-700">
                  Download the official app:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 rounded-xl transition-all hover:scale-105"
                  >
                    <Apple className="w-5 h-5 mr-2" />
                    iOS App Store
                  </Button>
                  <Button
                    size="lg"
                    className="bg-teal-600 text-white hover:bg-teal-700 px-8 py-6 rounded-xl transition-all hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Google Play
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative flex justify-center">
              <div
                className="relative cursor-pointer"
                onClick={() => setImageModalOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-500 rounded-3xl -rotate-6 scale-105 opacity-20"></div>
                <Image
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Citizen registration app on smartphone"
                  width={350}
                  height={700}
                  className="rounded-3xl shadow-2xl relative z-10 hover:shadow-xl transition-shadow"
                />
                <div className="absolute -bottom-4 -right-4 bg-teal-600 text-white p-4 rounded-xl shadow-lg z-20">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="font-semibold">2M+ Registered Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              onClick={() => setImageModalOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Citizen registration app on smartphone - enlarged view"
                width={800}
                height={1600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 px-4 sm:px-8 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} CitizenServe. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
