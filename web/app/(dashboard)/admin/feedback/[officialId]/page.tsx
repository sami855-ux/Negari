"use client"

import {
  ArrowLeft,
  CalendarDays,
  Copy,
  Filter,
  Flag,
  Info,
  Loader2,
  MoreHorizontal,
  PieChart,
  RefreshCw,
  Star,
  TrendingUp,
  User,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import { getRatingsByUser } from "@/services/rating"
import { RatingResponse } from "@/lib/types"

export default function UserRatingPage({
  params,
}: {
  params: { officialId: string }
}) {
  const router = useRouter()
  const [rating, setRating] = useState<RatingResponse | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Excellent"
    if (rating >= 3.5) return "Good"
    if (rating >= 2.5) return "Average"
    return "Poor"
  }

  useEffect(() => {
    const fetchRating = async () => {
      setIsLoading(true)
      try {
        const res = await getRatingsByUser(params.officialId)
        setRating(res)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRating()
  }, [params.officialId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="mr-2 animate-spin" size={33} />
      </div>
    )
  }

  if (!rating) {
    return <div className="py-10 text-center">No ratings found.</div>
  }

  return (
    <div className="container max-w-6xl px-4 py-4 mx-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            asChild
            className="w-12 p-1 mb-4 bg-white rounded-md hover:bg-gray-200"
            onClick={() => router.back()}
          >
            <ArrowLeft size={30} className="cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Go back</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Header Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <Card className="border-0 md:col-span-2 bg-gradient-to-br from-blue-200/50 to-purple-200/75 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                Official Ratings
              </CardTitle>
            </div>

            <p className="pl-2 leading-relaxed text-muted-foreground">
              Detailed feedback history received by official{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {rating.officialId}
              </span>
              .
            </p>

            <div className="flex items-start gap-2 p-3 border rounded-lg bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50">
              <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                This dashboard helps administrators understand the
                official&apos;s feedback profile, including rating distribution
                and detailed reviews.
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Rating Summary Card */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
                Performance Summary
              </CardTitle>
              <PieChart className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent className="flex items-end justify-between">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {rating.averageRating.toFixed(1)}
                <span className="text-xl font-normal text-muted-foreground">
                  /5
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= Math.round(rating.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    rating.averageRating >= 4.5
                      ? "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : rating.averageRating >= 3.5
                      ? "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-300"
                      : rating.averageRating >= 2.5
                      ? "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-300"
                      : "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-300"
                  }`}
                >
                  {getRatingLabel(rating.averageRating)}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="mb-1 text-xs text-muted-foreground">Based on</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {rating.totalRatingsReceived}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  ratings
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${(rating.averageRating / 5) * 100}%`,
                  background:
                    rating.averageRating >= 4.5
                      ? "linear-gradient(90deg, #10b981, #3b82f6)"
                      : rating.averageRating >= 3.5
                      ? "linear-gradient(90deg, #3b82f6, #6366f1)"
                      : "linear-gradient(90deg, #f59e0b, #ef4444)",
                }}
              />
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border border-gray-200 shadow-none lg:col-span-1 dark:border-gray-700 h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Rating Distribution
              </CardTitle>
              <PieChart className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = rating.scoreDistribution[stars.toString()] || 0
              const percentage =
                rating.totalRatingsReceived > 0
                  ? (count / rating.totalRatingsReceived) * 100
                  : 0

              return (
                <div
                  key={stars}
                  className="grid items-center grid-cols-12 gap-3"
                >
                  <div className="flex items-center col-span-2 gap-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stars}
                    </span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>

                  <div className="flex items-center col-span-10 gap-2">
                    <Progress
                      value={percentage}
                      className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-400"
                    />
                    <span className="text-xs text-muted-foreground min-w-[40px]">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>

          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                <span>
                  Based on {rating.totalRatingsReceived} total ratings
                </span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span>Last 30 days</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Individual Ratings */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 shadow-none dark:border-gray-700">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Recent Feedback
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({rating.totalRatingsReceived} ratings)
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Filter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Date
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
              {rating.ratings.map((r, index) => (
                <div key={index} className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={r.ratedBy.profilePicture || undefined}
                        />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {r.ratedBy.username}
                          </p>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2 py-0.5 text-xs border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            User
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={`${
                                  star <= r.score
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          {r.comment || "No comment provided."}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Flag className="w-4 h-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy text
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Load more ratings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
