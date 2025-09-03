"use client"

import {
  MapPin,
  AlertTriangle,
  User,
  HardHat,
  ShieldAlert,
  Flag,
  CheckCircle,
  Clock,
  ChevronLeft,
  ImageIcon,
  VideoIcon,
  Tag,
  Landmark,
  Compass,
  Map,
  Loader2,
  Box,
  Edit2,
  ChevronDown,
  UserCog,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { StaticLocationMap } from "@/components/StaticLocationMap"
import { useEffect, useState } from "react"
import MediaViewer from "@/components/official/MediaViewer"
import { VideoViewer } from "@/components/official/VideoViewer"
import useGetReport from "@/hooks/useGetReport"
import { Location, User as UserType } from "@/lib/types"
import defaultUser from "@/public/assests/default-user.jpg"
import { cn, getTimeElapsed } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { updateReportDynamic } from "@/services/report"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Progress } from "@/components/ui/progress"
import { getAllWorkers } from "@/services/getUsers"
interface Report {
  id: string
  title: string
  description: string
  imageUrls: string[]
  videoUrl: string
  status:
    | "PENDING"
    | "REJECTED"
    | "RESOLVED"
    | "IN_PROGRESS"
    | "NEEDS_MORE_INFO"
    | "VERIFIED"
  severity: "LOW" | "MEDIUM" | "HIGH"
  spamScore: number
  confidenceScore: number
  isPublic: boolean
  toxicityScore: number
  resolutionNote: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
  isAnonymous: boolean
  tags: string[]
  locationId: string
  reporterId: string
  assignedToId: string
  rejectionReason: string | null
  rejectedAt: string | null
  categoryId: string
  regionId: string | null
  location: Location
  reporter: UserType
  assignedTo: UserType
  feedback: string | null
  category: string
  aiAnalysis?: {
    urgency: number
    confidence: number
    similarPastIssues: number
    estimatedResolutionTime: string
    recommendedActions: string[]
  }
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800  hover:bg-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  RESOLVED: "bg-green-100 text-green-800 hover:bg-green-200",
  REJECTED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  VERIFIED: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  NEEDS_MORE_INFO: "bg-yellow-100 text-yellow-800",
}

const severityColors = {
  HIGH: "bg-red-100 text-red-800 hover:bg-red-200 font-jakarta",
  MEDIUM: "bg-orange-100 text-orange-800 hover:bg-orange-200 font-jakarta",
  LOW: "bg-green-100 text-green-800 hover:bg-green-200 font-jakarta",
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Replace this with your actual worker list from props or API
// const workers = [
//   { id: "45f5a1a6-85f6-48e8-9281-f0651cd8ff31", name: "Abel Bekele" },
//   { id: "45f5a1a6-85f6-48e8-9281-f0651cd8ff31", name: "Mekdes Yilma" },
//   { id: "45f5a1a6-85f6-48e8-9281-f0651cd8ff31", name: "Samuel Endale" },
// ]

interface ReportDetailPageProps {
  params: {
    reportId: string
  }
}

const ReportDetailPage = ({ params }: ReportDetailPageProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { isLoading, report: reportData } = useGetReport(params.reportId)
  const { isLoading: isWorkerLoading, data: workers } = useQuery({
    queryKey: ["workers"],
    queryFn: getAllWorkers,
  })

  const [report, setReport] = useState<Report | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [initialIndex, setInitialIndex] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [openWorkerPopover, setOpenWorkerPopover] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const openMedia = (index: number) => {
    setInitialIndex(index)
    setIsOpen(true)
  }

  //Function to handle report update
  const handleReportUpdate = async (data) => {
    try {
      setIsUpdating(true)

      const res = await updateReportDynamic(report?.id, data)

      if (res.success) {
        setIsUpdateSheetOpen(false)

        //Invalidate the query

        queryClient.invalidateQueries({
          queryKey: ["Single_Report", report?.id],
        })

        toast.success("New Worker assigned successfully!")
      } else {
        toast.error("Failed to assign worker")
      }
    } catch (error) {
      toast.error("Failed to assign worker")
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    if (reportData) {
      setReport(reportData)
    }
  }, [reportData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="mr-2 animate-spin" size={33} />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-lg font-medium">Report not found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container px-2 py-2 mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-white rounded-md"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to reports
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Report Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      {report.title}
                      <Badge
                        className={
                          statusColors[
                            report.status as keyof typeof statusColors
                          ]
                        }
                      >
                        {report.status?.replace("_", " ")}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Reported by {report.reporter?.username} •{" "}
                      {formatDate(report.createdAt)}
                    </CardDescription>
                    <CardDescription className="mt-1 text-orange-600">
                      {getTimeElapsed(report.createdAt)} ago
                    </CardDescription>
                  </div>
                  <Badge
                    className={
                      severityColors[
                        report.severity as keyof typeof severityColors
                      ]
                    }
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {report.severity} URGENCY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">{report.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {report.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Info */}
                {report?.status === "VERIFIED" && (
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-yellow-100 hover:border-yellow-200 bg-yellow-50 px-2 py-4 mb-5"
                    )}
                  >
                    <AlertTriangle className="text-yellow-600 " size={50} />

                    <div>
                      <p className="pb-2 text-sm font-semibold text-yellow-700">
                        This report is not in progress.
                      </p>
                      <p className="text-sm text-yellow-700">
                        The worker has not yet initiated action on this report.
                        It remains outside the active processing workflow and
                        may require your or administrative review or
                        reassignment.{" "}
                        <span
                          className="font-semibold cursor-pointer hover:underline"
                          onClick={() => setIsUpdateSheetOpen(true)}
                        >
                          Message the worker
                        </span>
                      </p>

                      <p className="pt-2 text-sm font-semibold text-orange-700">
                        {getTimeElapsed(report.createdAt)} passed since report
                        submitted{" "}
                      </p>
                    </div>
                  </div>
                )}

                {report?.status === "NEEDS_MORE_INFO" && (
                  <div className="flex items-start gap-3 p-4 py-6 mb-3 border shadow-sm rounded-xl border-amber-100 bg-amber-50 text-amber-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mt-0.5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01M12 19c-3.866 0-7-3.134-7-7s3.134-7 
        7-7 7 3.134 7 7-3.134 7-7 7z"
                      />
                    </svg>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        More Information Required From the Reporter
                      </span>
                      <p className="mt-1 text-xs text-amber-700">
                        This report cannot proceed until additional details are
                        provided. Please review the missing information and
                        update the report.
                      </p>
                    </div>
                  </div>
                )}

                {report?.status === "IN_PROGRESS" && (
                  <div className="w-full p-4 mb-5 border rounded-xl border-muted bg-background bg-green-50">
                    {/* Team Info Section */}
                    <div className="flex items-center gap-3 px-4 pb-3 mb-4">
                      <div className="relative">
                        <Image
                          src={defaultUser}
                          alt={"Team member"}
                          width={50}
                          height={50}
                          className="object-cover border-2 border-green-100 rounded-full"
                        />
                        <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1">
                          ✓
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Samuel's Team</h4>
                        <p className="text-xs text-muted-foreground">
                          Assigned to task
                        </p>
                      </div>
                    </div>
                    <p className="px-2 py-2 my-2 text-sm text-green-700 bg-green-100 rounded-lg">
                      The team accepts the report and begins work at the
                      earliest convenience
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <svg
                          className="w-4 h-4 text-green-500 animate-pulse"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Work Progress
                      </span>
                      <span className="px-2 py-1 text-sm font-semibold text-green-600 rounded-full bg-green-50">
                        {20}%
                      </span>
                    </div>
                    <Progress
                      value={30}
                      className="h-3 rounded-full bg-muted/20"
                      indicatorClassName="bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-700 shadow-lg shadow-green-100"
                    />
                    <div className="mt-1 text-xs text-right text-green-600 animate-pulse">
                      {30 > 20 ? "Ahead of schedule" : "On track"}
                    </div>
                  </div>
                )}

                {/* Media Gallery */}
                <div className="mb-6">
                  <h3 className="flex items-center mb-3 font-medium">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Media Evidence
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {report.imageUrls?.map((image, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden border rounded-lg aspect-video"
                        onClick={() => openMedia(index)}
                      >
                        <Image
                          src={image}
                          alt={`Report evidence ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {report.videoUrl && (
                      <div
                        onClick={() => setIsVideoOpen(true)}
                        className="relative flex items-center justify-center overflow-hidden bg-gray-100 border rounded-lg cursor-pointer aspect-video"
                      >
                        <video
                          className="object-cover w-full h-full"
                          poster="https://via.placeholder.com/800x450.png?text=Video+Preview"
                          muted
                          playsInline
                          preload="none"
                        >
                          <source src={report.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        {/* Optional overlay to indicate video is present */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <VideoIcon className="w-8 h-8 text-white" />
                          <span className="ml-2 text-sm font-medium text-white">
                            Video Available. Click it to see
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Map Placeholder */}
                <Card className="p-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-blue-600" />
                      <span>Location</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <StaticLocationMap
                      latitude={report.location?.latitude}
                      longitude={report.location?.longitude}
                      address={report.location?.address}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Compass className="w-5 h-5 mt-0.5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Coordinates</p>
                          <p className="text-sm text-gray-600">
                            {report.location?.latitude?.toFixed(6)},{" "}
                            {report.location?.longitude?.toFixed(6)}
                          </p>
                        </div>
                      </div>

                      {report.location?.address && (
                        <div className="flex items-start gap-2">
                          <Landmark className="w-5 h-5 mt-0.5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-gray-600">
                              {report.location.address}
                            </p>
                            {(report.location.city ||
                              report.location.region) && (
                              <p className="text-sm text-gray-600">
                                {report.location.city}
                                {report.location.region
                                  ? `, ${report.location.region}`
                                  : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Action Buttons */}
            {(report?.status === "IN_PROGRESS" ||
              report?.status === "VERIFIED") && (
              <div className="grid grid-cols-1 gap-3">
                {report?.status === "VERIFIED" && (
                  <Button
                    variant="outline"
                    className="col-span-2 text-white bg-green-600 hover:bg-green-500 hover:text-white"
                    onClick={() => setIsUpdateSheetOpen(true)}
                  >
                    Assign to another Worker
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="col-span-2 text-white bg-orange-600 hover:bg-orange-500 hover:text-white"
                >
                  Message the Worker
                </Button>
              </div>
            )}

            {/* AI Analysis Card */}
            <Card className="bg-white border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 text-blue-600 bg-blue-100 rounded-full">
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
                      className="lucide lucide-brain-circuit"
                    >
                      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
                      <path d="M16 8V5c0-1.1.9-2 2-2" />
                      <path d="M12 13h4" />
                      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
                      <path d="M12 8h8" />
                      <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                      <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                      <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                      <path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                    </svg>
                  </div>
                  <span>AI Analysis</span>
                </CardTitle>
                <CardDescription>
                  Automated risk assessment and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white border rounded-lg">
                    <p className="text-xs text-gray-500">Spam Score</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: `${report.spamScore}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-medium">
                        {report.spamScore}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-white border rounded-lg">
                    <p className="text-xs text-gray-500">Confidence Level</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{ width: `${report.confidenceScore}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-medium">
                        {report.confidenceScore}
                      </span>
                    </div>
                  </div>
                </div>

                <>
                  <div className="p-3 bg-white border rounded-lg">
                    <p className="text-xs text-gray-500">Urgency</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-orange-500 h-2.5 rounded-full"
                          style={{ width: `${20}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 font-medium">{20}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border rounded-lg">
                    <p className="text-xs text-gray-500">
                      Estimated Resolution Time
                    </p>
                    <p className="mt-1 font-medium">30 min</p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium">
                      Recommended Actions
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Take immediate action</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                        <span className="text-sm">
                          Follow up with the reporter
                        </span>
                      </li>
                    </ul>
                  </div>
                </>
              </CardContent>
            </Card>

            {/* Report Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="flex items-center mb-2 text-sm font-medium">
                    <User className="w-4 h-4 mr-2" />
                    Reporter
                  </h4>
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 mr-3 overflow-hidden rounded-full">
                      <Image
                        src={report.reporter?.profileImage || defaultUser}
                        alt={report.reporter?.username || "Anonymous"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-jakarta">
                        {report.isAnonymous
                          ? "Anonymous"
                          : report.reporter?.username}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center mb-2 text-sm font-medium">
                    <HardHat className="w-4 h-4 mr-2" />
                    Assigned Officer
                  </h4>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 text-blue-600 bg-blue-100 rounded-full">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-jakarta">You</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center mb-2 text-sm font-medium">
                    <UserCog className="w-4 h-4 mr-2" />
                    Assigned Worker Team
                  </h4>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 text-orange-600 bg-orange-100 rounded-full">
                      <UserCog className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium font-jakarta">
                        Abebe's Team
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center mb-2 text-sm font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 lucide lucide-package"
                    >
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                    Category
                  </h4>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 text-purple-600 bg-purple-100 rounded-full">
                      <Box size={20} />
                    </div>
                    <div>
                      <Badge className="text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-50">
                        {report.category || "Uncategorized"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center mb-2 text-sm font-medium">
                    <Flag className="w-4 h-4 mr-2" />
                    Verification Status
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 mr-3 text-green-600 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">Verified</p>
                        <p className="text-xs text-gray-500">
                          Confidence: {report.confidenceScore}%
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-700 bg-green-50"
                    >
                      {report.spamScore < 50 ? "Low Risk" : "Needs Review"}
                    </Badge>
                  </div>
                </div>

                {report.resolutionNote && (
                  <div>
                    <h4 className="flex items-center mb-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolution Note
                    </h4>
                    <p className="p-3 text-sm rounded-lg bg-green-50">
                      {report.resolutionNote}
                    </p>
                    {report.resolvedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Resolved on {formatDate(report.resolvedAt)}
                      </p>
                    )}
                  </div>
                )}

                {report.rejectionReason && (
                  <div>
                    <h4 className="flex items-center mb-2 text-sm font-medium">
                      <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                      Rejection Reason
                    </h4>
                    <p className="p-3 text-sm rounded-lg bg-yellow-50">
                      {report.rejectionReason}
                    </p>
                    {report.rejectedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Rejected on {formatDate(report.rejectedAt)}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Sheet onOpenChange={setIsUpdateSheetOpen} open={isUpdateSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Edit2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <SheetTitle>Assign New Worker</SheetTitle>
                <SheetDescription>
                  Current Worker:{" "}
                  <span className="font-semibold text-red-600">
                    Samuel Tale Dejene
                  </span>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="grid gap-4 py-12">
            <div className="space-y-2">
              <Label htmlFor="assignedWorker" className="text-sm font-medium">
                Assign a Worker
              </Label>

              <Popover
                open={openWorkerPopover}
                onOpenChange={setOpenWorkerPopover}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-full"
                    disabled={isWorkerLoading}
                  >
                    {isWorkerLoading
                      ? "Loading workers..."
                      : selectedWorker
                      ? workers?.find((w) => w.id === selectedWorker)?.username
                      : "Select worker..."}
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[350px] p-0">
                  {isWorkerLoading ? (
                    // Skeleton loader
                    <div className="p-4 space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-8 bg-gray-200 rounded-md animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <Command>
                      <CommandInput
                        placeholder="Search worker..."
                        className="h-9"
                      />
                      <CommandEmpty>No worker found.</CommandEmpty>
                      <CommandGroup>
                        {workers?.map((worker) => (
                          <CommandItem
                            key={worker.id}
                            onSelect={() => {
                              setSelectedWorker(worker.id)
                              setOpenWorkerPopover(false)
                            }}
                            className="flex items-center justify-between py-2"
                          >
                            <span>{worker.username}</span>
                            <Badge className="text-xs text-green-700 bg-green-100 font-jakarta">
                              Active
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <SheetFooter className="flex flex-row justify-between">
            <Button
              variant="outline"
              onClick={() => setIsUpdateSheetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="text-white bg-green-500 hover:bg-green-600"
              disabled={isUpdating}
              onClick={() => {
                const data = {
                  assignedToWorkerId: selectedWorker,
                }
                handleReportUpdate(data)
              }}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Assigned worker"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <MediaViewer
        media={report.imageUrls}
        initialIndex={initialIndex}
        open={isOpen}
        onOpenChange={setIsOpen}
      />

      <VideoViewer
        videoUrl={report.videoUrl || ""}
        open={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        thumbnail={
          report.imageUrls?.[0] ||
          "https://via.placeholder.com/800x450.png?text=No+Thumbnail"
        }
      />
    </>
  )
}

export default ReportDetailPage
