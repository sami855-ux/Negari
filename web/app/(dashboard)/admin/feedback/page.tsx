"use client"

import RatingTable from "@/components/admin/RatingTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useGetAllRatings from "@/hooks/useGetAllRating"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

const getRatingBadge = (rating: number) => {
  if (rating >= 4.5) {
    return (
      <Badge className="text-white bg-gradient-to-r from-emerald-500 to-teal-600">
        Excellent
      </Badge>
    )
  } else if (rating >= 4.0) {
    return (
      <Badge className="text-white bg-gradient-to-r from-blue-500 to-cyan-500">
        Great
      </Badge>
    )
  } else if (rating >= 3.0) {
    return (
      <Badge className="text-white bg-gradient-to-r from-purple-500 to-indigo-500">
        Good
      </Badge>
    )
  } else if (rating >= 2.0) {
    return (
      <Badge className="text-white bg-gradient-to-r from-amber-500 to-orange-500">
        Fair
      </Badge>
    )
  } else {
    return (
      <Badge className="text-white bg-gradient-to-r from-rose-500 to-pink-500">
        Poor
      </Badge>
    )
  }
}

export default function HomePage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isLoading, ratings, refetch } = useGetAllRatings()

  const refreshPendingData = async () => {
    setIsRefreshing(true)
    try {
      await refetch?.()
      toast.success("Rating refreshed successfully!")
    } catch {
      toast.error("Error while refreshing rating!")
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
      }, 500)
    }
  }
  const userData = [
    {
      id: "off-123",
      username: "official_berhanu",
      email: "berhanu@negari.gov.et",
      profilePicture: "/placeholder.svg?height=40&width=40",
      averageRating: 4.67,
      totalRatings: 3,
    },
    {
      id: "usr-456",
      username: "jane_doe",
      email: "jane.doe@example.com",
      profilePicture: "/placeholder.svg?height=40&width=40",
      averageRating: 3.9,
      totalRatings: 15,
    },
    {
      id: "dev-789",
      username: "dev_user",
      email: "dev.user@company.org",
      profilePicture: "/placeholder.svg?height=40&width=40",
      averageRating: 5.0,
      totalRatings: 1,
    },
    {
      id: "adm-010",
      username: "admin_alpha",
      email: "admin@system.com",
      profilePicture: "/placeholder.svg?height=40&width=40",
      averageRating: 4.2,
      totalRatings: 8,
    },
    {
      id: "tst-112",
      username: "test_account",
      email: "test@test.net",
      profilePicture: "/placeholder.svg?height=40&width=40",
      averageRating: 2.5,
      totalRatings: 2,
    },
  ]

  return (
    <div className="container px-2 mx-auto">
      <div className="flex  items-center justify-between p-6 mb-8 bg-white dark:bg-gray-800 rounded-xl">
        <div className="">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Customer Feedback Ratings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-[15px]">
            Insights from our valued community members
          </p>
        </div>
        <div>
          <Button
            onClick={refreshPendingData}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="flex items-center gap-2 text-blue-700 border-blue-300 bg-white/80 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-700 dark:bg-slate-800/80 dark:text-blue-300 dark:hover:bg-blue-900/30"
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform duration-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Officials Ratings Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userData.length} active profiles
            </p>
          </div>
          <div className="flex space-x-2">
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
              {userData.filter((u) => u.averageRating >= 4.5).length} Excellent
            </Badge>
            <Badge className="text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
              {
                userData.filter(
                  (u) => u.averageRating >= 4.0 && u.averageRating < 4.5
                ).length
              }{" "}
              Great
            </Badge>
          </div>
        </div>

        <RatingTable data={ratings} isLoading={isLoading} />
      </div>

      <div className="p-6 mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
        <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
          Rating Distribution
        </h3>
        <div className="flex flex-wrap gap-4">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = userData.filter(
              (u) => Math.floor(u.averageRating) === stars
            ).length
            return (
              <div key={stars} className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(stars)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-amber-400" />
                  ))}
                </div>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  {count} {count === 1 ? "user" : "users"}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  )
}
