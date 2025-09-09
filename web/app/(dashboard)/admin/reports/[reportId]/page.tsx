"use client"

import dynamic from "next/dynamic"

const StaticLocationMap = dynamic(
  () =>
    import("@/components/StaticLocationMap").then(
      (mod) => mod.StaticLocationMap
    ),
  { ssr: false }
)

import {
  Compass,
  Landmark,
  Map,
  Gauge,
  ShieldAlert,
  AlertTriangle,
  MailWarning,
  VideoIcon,
  ImageIcon,
  UserCog,
  Box,
  Flag,
  CheckCircle,
  Edit2,
  ChevronDown,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageSquare,
  Star,
  Info,
  Hourglass,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { DeleteConfirmationModal } from "@/components/DeleteModal"
import useGetAllReports from "@/hooks/useGetAllReports"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { Label } from "@/components/ui/label"
import { cn, getTimeElapsed } from "@/lib/utils"
import { Location, User as UserType } from "@/lib/types"
import MediaViewer from "@/components/official/MediaViewer"
import { VideoViewer } from "@/components/official/VideoViewer"
import Image from "next/image"
import defaultUser from "@/public/assests/default-user.jpg"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllWorkers } from "@/services/getUsers"
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

interface Report {
  id: string
  title: string
  description: string
  imageUrls: string[]
  resolutionImages: string[]
  videoUrl: string
  status:
    | "PENDING"
    | "VERIFIED"
    | "REJECTED"
    | "RESOLVED"
    | "NEEDS_MORE_INFO"
    | "IN_PROGRESS"
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
  category: string
  aiAnalysis?: {
    urgency: number
    confidence: number
    similarPastIssues: number
    estimatedResolutionTime: string
    recommendedActions: string[]
  }
  feedback: {
    rating: number
    comment: string
    createdAt: string
  }
  AssignedReports_worker: string
}
const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  NEEDS_MORE_INFO: "bg-orange-100 text-orange-800",
}

const severityColors = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  CRITICAL: "bg-red-100 text-red-800",
}

const statusIcons = {
  PENDING: <Clock className="w-4 h-4" />,
  IN_PROGRESS: <AlertCircle className="w-4 h-4" />,
  RESOLVED: <CheckCircle2 className="w-4 h-4" />,
  REJECTED: <AlertCircle className="w-4 h-4" />,
  NEEDS_MORE_INFO: <AlertTriangle className="w-4 h-4" />,
}

const getScoreColor = (score: number) => {
  if (score >= 0.8) return "bg-red-500"
  if (score >= 0.5) return "bg-orange-500"
  if (score >= 0.3) return "bg-yellow-500"
  return "bg-green-500"
}

const getScoreIcon = (score: number, type: string) => {
  if (score >= 0.8) return <ShieldAlert className="w-5 h-5 text-red-600" />
  if (score >= 0.5) return <AlertTriangle className="w-5 h-5 text-orange-500" />
  if (type === "spam")
    return <MailWarning className="w-5 h-5 text-yellow-500" />
  return <Gauge className="w-5 h-5 text-green-500" />
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
interface ReportDetailPageProps {
  params: {
    reportId: string
  }
}

export default function ReportPage({ params }: ReportDetailPageProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { isLoading, reports } = useGetAllReports()
  const { isLoading: isWorkerLoading, data: workers } = useQuery({
    queryKey: ["workers"],
    queryFn: getAllWorkers,
  })

  const [report, setReport] = useState<Report | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  const [media, setMedia] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [initialIndex, setInitialIndex] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const [newStatus, setNewStatus] = useState(report?.status || "")
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [openWorkerPopover, setOpenWorkerPopover] = useState(false)

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
          queryKey: ["All_Reports"],
        })

        router.back()

        toast.success(res.message || "Report updated successfully!")
      } else {
        toast.error(res.message || "Failed to update report")
      }
    } catch (error) {
      toast.error(error.message || "Failed to update report")
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    if (reports?.length) {
      const matched = reports.find((r) => r.id === params.reportId)
      setReport(matched || null)
    }
  }, [reports, params.reportId])

  if (!report) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="mr-2 animate-spin" size={33} />
      </div>
    )
  }

  return (
    <>
      <div className="container px-4 pt-4 pb-8 mx-auto rounded-md bg-card-background">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              asChild
              className="p-1 rounded-md hover:bg-gray-200"
              onClick={() => router.back()}
            >
              <ArrowLeft size={30} className="cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center justify-between my-6">
          <div className="">
            <section className="flex gap-3">
              <Info size={30} />
              <h1 className="text-2xl font-bold text-gray-900">
                Report Details
              </h1>
            </section>
            <p className="text-gray-600 py-2 font-jakarta text-[15px]">
              All available information about this report is presented below for{" "}
              administrative action
            </p>
          </div>
          <div className="flex items-center gap-4 ">
            {report?.status === "PENDING" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      onClick={() => setIsUpdateSheetOpen(true)}
                      className="h-10 px-4 text-gray-800 bg-green-300 border border-green-400 rounded-md cursor-pointer w-fit hover:bg-green-200"
                    >
                      Update the status
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>update the status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {report?.status === "VERIFIED" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      onClick={() => setIsAssignOpen(true)}
                      className="h-10 px-4 text-gray-800 bg-orange-300 border border-orange-400 rounded-md cursor-pointer w-fit hover:bg-orange-200"
                    >
                      Assign to Another worker
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Assign worker</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-10 h-10"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete this report</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="mr-2 animate-spin" size={27} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Report Content */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-gray-100 shadow-none">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={statusColors[report.status]}>
                        {statusIcons[report.status]}
                        <span className="ml-1">
                          {report.status.replace("_", " ")}
                        </span>
                      </Badge>
                      <Badge className={severityColors[report.severity]}>
                        {report.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {report.isAnonymous
                      ? "Anonymous"
                      : report.reporter.username}
                    <span className="mx-2">•</span>
                    {format(new Date(report.createdAt), "MMM dd, yyyy h:mm a")}
                  </div>
                  <CardDescription className="mt-1 font-semibold text-orange-600">
                    Reported {getTimeElapsed(report.createdAt)} ago
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Description</h3>
                    <p className="text-gray-700">{report.description}</p>
                  </div>

                  <Card className="border-blue-100 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Gauge className="w-5 h-5" />
                        <span>AI Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getScoreIcon(report.spamScore, "spam")}
                            <h3 className="font-medium">Spam Score</h3>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getScoreColor(
                              report.spamScore
                            )} text-white`}
                          >
                            {(report.spamScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={report.spamScore * 100}
                          className={`h-2 ${getScoreColor(report.spamScore)}`}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {report.spamScore >= 0.8
                            ? "Highly likely to be spam"
                            : report.spamScore >= 0.5
                            ? "Potentially spammy content"
                            : "Likely legitimate"}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getScoreIcon(report.confidenceScore)}
                            <h3 className="font-medium">Confidence Score</h3>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getScoreColor(
                              report.confidenceScore
                            )} text-white`}
                          >
                            {(report.confidenceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={report.confidenceScore * 100}
                          className={`h-2 ${getScoreColor(
                            report.confidenceScore
                          )}`}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {report.confidenceScore >= 0.8
                            ? "Highly confident in report validity"
                            : report.confidenceScore >= 0.5
                            ? "Moderately confident"
                            : "Low confidence - needs review"}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getScoreIcon(report.toxicityScore)}
                            <h3 className="font-medium">Toxicity Score</h3>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getScoreColor(
                              report.toxicityScore
                            )} text-white`}
                          >
                            {(report.toxicityScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={report.toxicityScore * 100}
                          className={`h-2 ${getScoreColor(
                            report.toxicityScore
                          )}`}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {report.toxicityScore >= 0.8
                            ? "Highly toxic content detected"
                            : report.toxicityScore >= 0.5
                            ? "Potentially offensive content"
                            : "Minimal toxicity detected"}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                report.isPublic ? "default" : "secondary"
                              }
                            >
                              {report.isPublic ? "Public" : "Private"}
                            </Badge>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {report.isPublic
                            ? "This report is visible to the public"
                            : "This report is not visible to the public"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/*For each status  */}

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
                          The worker has not yet initiated action on this
                          report. It remains outside the active processing
                          workflow and may require your or administrative review
                          or reassignment.{" "}
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

                  {/* NEEDS_MORE_INFO */}
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
                          This report cannot proceed until additional details
                          are provided. Please review the missing information
                          and update the report.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* In progress */}

                  {report?.status === "IN_PROGRESS" && (
                    <div className="w-full p-5 mb-5 border rounded-xl border-muted bg-gradient-to-br from-green-50 to-emerald-50/30">
                      {/* Header Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative flex -space-x-2">
                            {[1, 2, 3].map((index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={defaultUser}
                                  alt={"Team member"}
                                  width={40}
                                  height={40}
                                  className="object-cover border-2 border-white rounded-full shadow-sm"
                                />
                                {index === 1 && (
                                  <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1">
                                    ✓
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">
                              {report.AssignedReports_worker}&apos;s Team
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Actively working on this task
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">
                          IN PROGRESS
                        </span>
                      </div>

                      {/* Status Message */}
                      <div className="p-3 mb-4 text-sm text-green-800 border rounded-lg bg-green-100/70 border-green-200/50">
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 mt-0.5 text-green-600 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>
                            The team has accepted this report and begun work
                          </p>
                        </div>
                      </div>

                      {/* Task Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-white border rounded-lg shadow-sm border-muted/30">
                          <p className="mb-1 text-xs text-muted-foreground">
                            Time Elapsed
                          </p>
                          <p className="text-sm font-medium">3 days</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="mb-4">
                        <h5 className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Recent Activity
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-xs">
                            <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">
                                Task assigned to{" "}
                                {report?.AssignedReports_worker}
                                &apos;s team
                              </p>
                              <p className="text-muted-foreground">
                                2 days ago
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">
                                Initial assessment completed
                              </p>
                              <p className="text-muted-foreground">1 day ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <div className="w-2 h-2 mt-1.5 bg-green-300 rounded-full"></div>
                            <div>
                              <p className="font-medium">
                                Implementation in progress
                              </p>
                              <p className="text-muted-foreground">Today</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resolved */}
                  {report?.status === "RESOLVED" && (
                    <div className="w-full p-5 mb-5 border rounded-xl border-muted bg-gradient-to-br from-blue-50 to-indigo-50/30">
                      {/* Header Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={defaultUser}
                              alt={"Team member"}
                              width={50}
                              height={50}
                              className="object-cover border-2 border-blue-100 rounded-full shadow-sm"
                            />
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-500 border-2 border-white rounded-full -bottom-1 -right-1">
                              ✓
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">
                              {report?.AssignedReports_worker}&apos;s Team
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Task completed successfully
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                          RESOLVED
                        </span>
                      </div>

                      {/* Completion Message */}
                      <div className="p-3 mb-4 text-sm text-blue-800 border rounded-lg bg-blue-100/70 border-blue-200/50">
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 mt-0.5 text-blue-600 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>
                            The task has been completed successfully and marked
                            as resolved
                          </p>
                        </div>
                      </div>

                      {/* Resolution Images Gallery */}
                      {report?.resolutionImages &&
                        report.resolutionImages.length > 0 && (
                          <div className="p-4 mb-4 bg-white border rounded-lg shadow-sm border-muted/30">
                            <h5 className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Resolution Images (
                              {report.resolutionImages.length})
                            </h5>
                            <div className="grid grid-cols-3 gap-2">
                              {report.resolutionImages
                                .slice(0, 3)
                                .map((image, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-square"
                                  >
                                    <Image
                                      src={image}
                                      alt={`Resolution image ${index + 1}`}
                                      fill
                                      className="object-cover border rounded-md cursor-pointer border-muted/30"
                                      onClick={() => {
                                        openMedia(index)
                                        setMedia(report?.resolutionImages)
                                      }}
                                    />
                                    {index === 2 &&
                                      report.resolutionImages.length > 3 && (
                                        <div
                                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md cursor-pointer"
                                          onClick={() => {
                                            // Function to open image gallery
                                            openMedia(index)
                                            setMedia(report?.resolutionImages)
                                          }}
                                        >
                                          <span className="text-sm font-medium text-white">
                                            +
                                            {report.resolutionImages.length - 3}
                                          </span>
                                        </div>
                                      )}
                                  </div>
                                ))}
                            </div>
                            {report.resolutionImages.length > 3 && (
                              <button
                                className="w-full py-2 mt-3 text-xs text-blue-600 transition-colors rounded-md bg-blue-50 hover:bg-blue-100"
                                onClick={() => {
                                  // Function to open image gallery with all images
                                  openMedia(2)
                                  setMedia(report?.resolutionImages)
                                }}
                              >
                                View all {report.resolutionImages.length} images
                              </button>
                            )}
                          </div>
                        )}

                      {/* Resolution Details */}
                      <div className="p-4 mb-4 bg-white border rounded-lg shadow-sm border-muted/30">
                        <h5 className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Resolution Summary
                        </h5>
                        <p className="text-sm capitalize">
                          {report?.resolutionNote}
                        </p>
                      </div>

                      {/* Completion Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-white border rounded-lg shadow-sm border-muted/30">
                          <p className="mb-1 text-xs text-muted-foreground">
                            Time to Resolution
                          </p>
                          <p className="text-sm font-medium">5 days</p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg shadow-sm border-muted/30">
                          <p className="mb-1 text-xs text-muted-foreground">
                            Completed On
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(report?.resolvedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button className="flex items-center justify-center flex-1 gap-2 py-2 text-sm font-medium text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          Send a message to the Reporter
                        </button>
                        <button
                          onClick={() => {
                            handleReportUpdate({
                              status: "PENDING",
                            })
                          }}
                          disabled={isUpdating}
                          className="flex items-center justify-center flex-1 gap-2 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Reopening...
                            </>
                          ) : (
                            "Reopen Report"
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Rejected */}
                  {report?.status === "REJECTED" && (
                    <div className="w-full p-5 mb-5 border rounded-xl border-muted bg-gradient-to-br from-rose-50 to-red-50/30">
                      {/* Header Section */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="text-sm font-semibold">
                              Report have been rejected
                            </h4>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-rose-500">
                          REJECTED
                        </span>
                      </div>

                      {/* Rejection Message */}
                      <div className="p-3 mb-4 text-sm border rounded-lg text-rose-800 bg-rose-100/70 border-rose-200/50">
                        <div className="flex items-start gap-2">
                          <svg
                            className="w-4 h-4 mt-0.5 text-rose-600 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <p>
                            The Officer has reviewed this report and decided not
                            to proceed with the reported issue
                          </p>
                        </div>
                      </div>

                      {/* Rejection Details */}
                      <div className="p-4 mb-4 bg-white border rounded-lg shadow-sm border-muted/30">
                        <h5 className="flex items-center gap-2 mb-3 text-xs font-medium text-muted-foreground">
                          <svg
                            className="w-4 h-4 text-rose-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Reason for Rejection
                        </h5>
                        <p className="text-sm text-rose-800">
                          {report?.rejectionReason || "No reason provided"}
                        </p>
                      </div>

                      {/* Rejection Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-white border rounded-lg shadow-sm border-muted/30">
                          <p className="mb-1 text-xs text-muted-foreground">
                            Rejected On
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(report?.rejectedAt)}
                          </p>
                        </div>
                        <div className="p-3 bg-white border rounded-lg shadow-sm border-muted/30">
                          <p className="mb-1 text-xs text-muted-foreground">
                            Time to Decision
                          </p>
                          <p className="text-sm font-medium">2 days</p>
                        </div>
                      </div>

                      {/* Next Steps */}
                      <div className="p-4 mb-4 border rounded-lg bg-amber-50 border-amber-200/50">
                        <h5 className="flex items-center gap-2 mb-2 text-xs font-medium text-amber-800">
                          <svg
                            className="w-4 h-4 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Recommended Next Steps
                        </h5>
                        <ul className="space-y-1 text-xs list-disc list-inside text-amber-700">
                          <li>Review the rejection reason provided</li>
                          <li>Consider editing and reopening the report</li>
                          <li>
                            Contact the reporter for clarification if needed
                          </li>
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button className="flex items-center justify-center flex-1 gap-2 py-2 text-sm font-medium transition-colors rounded-lg text-rose-700 bg-rose-100 hover:bg-rose-200">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          Request Clarification from reporter
                        </button>
                        <button
                          onClick={() => {
                            handleReportUpdate({
                              status: "PENDING",
                            })
                          }}
                          disabled={isUpdating}
                          className="flex items-center justify-center flex-1 gap-2 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-rose-600 hover:bg-rose-700"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Reopening...
                            </>
                          ) : (
                            "Reopen Report"
                          )}
                        </button>
                      </div>
                    </div>
                  )}

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
                          onClick={() => {
                            openMedia(index)
                            setMedia(report?.imageUrls)
                          }}
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

                  {report.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {report.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-blue-600" />
                    <span>Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StaticLocationMap
                    latitude={report.location.latitude}
                    longitude={report.location.longitude}
                    address={report.location.address}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Compass className="w-5 h-5 mt-0.5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Coordinates</p>
                        <p className="text-sm text-gray-600">
                          {report.location.latitude.toFixed(6)},{" "}
                          {report.location.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    {report.location.address && (
                      <div className="flex items-start gap-2">
                        <Landmark className="w-5 h-5 mt-0.5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-gray-600">
                            {report.location.address}
                          </p>
                          {(report.location.city || report.location.region) && (
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Hourglass size={22} color="blue" />
                  <CardTitle className="pb-1 text-xl text-gray-800">
                    Report Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <Badge className={`mt-1 ${statusColors[report.status]}`}>
                        {statusIcons[report.status]}
                        <span className="ml-1">
                          {report.status.replace("_", " ")}
                        </span>
                      </Badge>
                    </div>

                    {report.assignedTo && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Assigned Officer
                        </p>
                        <p className="font-medium text-gray-800">
                          {report.assignedTo.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.assignedTo.email}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="flex items-center mb-2 text-sm font-medium">
                        <User className="w-4 h-4 mr-2" />
                        Reporter
                      </h4>
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 mr-3 overflow-hidden rounded-full">
                          <Image
                            src={report.reporter?.profilePicture || defaultUser}
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

                    {report?.AssignedReports_worker && (
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
                              {report?.AssignedReports_worker}&apos;s Team
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                            <p className="font-medium">
                              {`${report.status}`.charAt(0) +
                                `${report.status}`.slice(1).toLowerCase()}
                            </p>
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
                    {report.resolvedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Resolved At</p>
                        <p>
                          {format(
                            new Date(report.resolvedAt),
                            "MMM dd, yyyy h:mm a"
                          )}
                        </p>
                      </div>
                    )}

                    {report.resolutionNote && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Resolution Notes
                        </p>
                        <p className="mt-1">{report.resolutionNote}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Card */}
              {report.feedback && (
                <Card className="border-green-200">
                  <CardHeader className="rounded-t-lg bg-green-50">
                    <CardTitle className="flex items-center text-green-800">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      <span>Feedback</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < report.feedback.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {format(
                          new Date(report.feedback.createdAt),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    {report.feedback.comment && (
                      <div className="p-3 mt-2 rounded-lg bg-green-50">
                        <p className="text-green-800">
                          {report.feedback.comment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Sheet */}
      <Sheet onOpenChange={setIsUpdateSheetOpen} open={isUpdateSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Edit2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <SheetTitle>Update Report Status</SheetTitle>
                <SheetDescription>
                  Current status:{" "}
                  <span className="font-semibold text-green-600">
                    {report?.status?.replace("_", " ")}
                  </span>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="grid gap-4 py-12">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Select New Status
              </Label>
              <Select
                value={newStatus}
                onValueChange={(value) => setNewStatus(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="NEEDS_MORE_INFO">
                    Needs more info
                  </SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditionally show Assign Worker if status is VERIFIED */}
            {newStatus === "VERIFIED" && (
              <div className="grid gap-4 py-12">
                <div className="space-y-2">
                  <Label
                    htmlFor="assignedWorker"
                    className="text-sm font-medium"
                  >
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
                          ? workers?.find((w) => w.id === selectedWorker)
                              ?.username
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
            )}

            {/* Resolution or Rejection Notes */}
            {(newStatus === "REJECTED" || newStatus === "RESOLVED") && (
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  {newStatus === "RESOLVED"
                    ? "Resolution Notes"
                    : "Rejection Reason"}
                  <span className="text-muted-foreground"> (required)</span>
                </Label>
                <Textarea
                  id="notes"
                  placeholder={
                    newStatus === "RESOLVED"
                      ? "Describe how the issue was resolved..."
                      : "Explain why this report is being rejected..."
                  }
                  className="min-h-[120px]"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                />
              </div>
            )}
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
              disabled={
                isUpdating ||
                (["REJECTED", "RESOLVED"].includes(newStatus) &&
                  !resolutionNotes)
              }
              onClick={() => {
                if (isUpdating) return

                const VerifiedData = {
                  status: "VERIFIED",
                  assignedToWorkerId: selectedWorker,
                }
                const rejectedData = {
                  status: "REJECTED",
                  notes: resolutionNotes,
                }
                const needMoreInfoData = {
                  status: "NEEDS_MORE_INFO",
                }

                handleReportUpdate(
                  newStatus === "VERIFIED"
                    ? VerifiedData
                    : newStatus === "REJECTED"
                    ? rejectedData
                    : needMoreInfoData
                )
              }}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Edit2 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <SheetTitle>Assign New Worker</SheetTitle>
              </div>
            </div>
          </SheetHeader>
          <SheetDescription className="mt-6 font-semibold">
            Current Worker:{" "}
            <span className="font-semibold text-red-600">
              {report.AssignedReports_worker}
            </span>
          </SheetDescription>
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
                        {workers
                          .filter(
                            (item) => item.id !== report?.assignedToWorkerId
                          )
                          ?.map((worker) => (
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

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          router.push("/admin/reports/pending")
        }}
        reportId={params.reportId}
        description="Are you sure you want to delete this report? This action cannot be undone."
      />

      <MediaViewer
        media={media}
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
