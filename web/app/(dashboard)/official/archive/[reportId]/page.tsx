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
import { formatDate } from "@/lib/utils"

import defaultUser from "@/public/assests/default-user.jpg"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

interface Report {
  id: string
  title: string
  description: string
  imageUrls: string[]
  videoUrl: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED"
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
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-gray-100 text-gray-800",
  APPROVED: "bg-purple-100 text-purple-800",
}

const severityColors = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-orange-100 text-orange-800",
  LOW: "bg-green-100 text-green-800",
}

interface ReportDetailPageProps {
  params: {
    reportId: string
  }
}

// Replace this with your actual worker list from props or API
const workers = [
  { id: "45f5a1a6-85f6-48e8-9281-f0651cd8ff31", name: "Abel Bekele" },
  { id: "45f5a1a6-85f6-48e8-9281-f0651cd8ff31", name: "Mekdes Yilma" },
  { id: "45f5a1a6-85f6-48e8-9281-f0651cd8ff31", name: "Samuel Endale" },
]
const ReportDetailPage = ({ params }: ReportDetailPageProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { isLoading, report: reportData } = useGetReport(params.reportId)

  const [report, setReport] = useState<Report | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [initialIndex, setInitialIndex] = useState(0)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false)
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
          queryKey: ["Officer_Reports"],
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
            <Card className="shadow-none">
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
                      {formatDate(new Date(report.createdAt))}
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
                      className="flex items-center border border-green-400 bg-green-50"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setIsUpdateSheetOpen(true)}
                className="col-span-2 text-white bg-green-600 hover:bg-green-500 hover:text-white"
              >
                Update the status
              </Button>
            </div>

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
                      <p className="font-medium">
                        {report.isAnonymous
                          ? "Anonymous"
                          : report.reporter?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {report.isAnonymous
                          ? "Anonymous report"
                          : "Public report"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center mb-2 text-sm font-medium">
                    <HardHat className="w-4 h-4 mr-2" />
                    Assigned Official
                  </h4>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-3 text-blue-600 bg-blue-100 rounded-full">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium">You</p>
                      <p className="text-xs text-gray-500">
                        {report.assignedTo?.department || "Not specified"}
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
                      <Badge className="text-sm font-medium">
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
                      <div className="flex items-center justify-center w-8 h-8 mr-3 text-orange-500 bg-orange-100 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-orange-500">Pending</p>
                        <p className="text-xs text-gray-500">
                          Confidence: {report.confidenceScore}%
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-orange-700 bg-orange-50"
                    >
                      {report.spamScore < 50 ? "Low Risk" : "Needs Review"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
          </div>
        </div>
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
                      className="w-full justify-between"
                    >
                      {selectedWorker
                        ? workers.find((w) => w.id === selectedWorker)?.name
                        : "Select worker..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[350px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search worker..."
                        className="h-9"
                      />
                      <CommandEmpty>No worker found.</CommandEmpty>
                      <CommandGroup>
                        {workers.map((worker) => (
                          <CommandItem
                            key={worker.id}
                            onSelect={() => {
                              setSelectedWorker(worker.id)
                              setOpenWorkerPopover(false)
                            }}
                            className="flex items-center justify-between py-2"
                          >
                            <span className=""> {worker.name}</span>

                            <Badge className="text-green-700 bg-green-100 font-jakarta text-xs">
                              Active
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              className="bg-green-500 hover:bg-green-600 text-white"
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
                const resolvedData = {
                  status: "RESOLVED",
                  notes: resolutionNotes,
                }

                handleReportUpdate(
                  newStatus === "VERIFIED"
                    ? VerifiedData
                    : newStatus === "REJECTED"
                    ? rejectedData
                    : resolvedData
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
