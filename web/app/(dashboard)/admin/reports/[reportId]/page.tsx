"use client"

import { StaticLocationMap } from "@/components/StaticLocationMap"
import {
  Compass,
  Landmark,
  Map,
  Gauge,
  ShieldAlert,
  AlertTriangle,
  MailWarning,
  Worm,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  User,
  MapPin,
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
}

const getScoreColor = (score) => {
  if (score >= 0.8) return "bg-red-500"
  if (score >= 0.5) return "bg-orange-500"
  if (score >= 0.3) return "bg-yellow-500"
  return "bg-green-500"
}

const getScoreIcon = (score, type) => {
  if (score >= 0.8) return <ShieldAlert className="w-5 h-5 text-red-600" />
  if (score >= 0.5) return <AlertTriangle className="w-5 h-5 text-orange-500" />
  if (type === "spam")
    return <MailWarning className="w-5 h-5 text-yellow-500" />
  return <Gauge className="w-5 h-5 text-green-500" />
}

export default function ReportPage({ params }) {
  const router = useRouter()

  const { isLoading, reports } = useGetAllReports()
  const [report, setReport] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  const [newStatus, setNewStatus] = useState(report?.status || "")
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

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
                      Assign to the worker
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
              {report.status === "PENDING" && (
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
                        className={`h-2 ${getScoreColor(report.toxicityScore)}`}
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
                            variant={report.isPublic ? "default" : "secondary"}
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
              )}

              <Card className="border-gray-200 shadow-none">
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
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Description</h3>
                    <p className="text-gray-700">{report.description}</p>
                  </div>

                  {report.imageUrls.length > 0 && (
                    <div>
                      <h3 className="mb-2 font-medium">Media</h3>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                        {report.imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative overflow-hidden rounded-lg aspect-square"
                          >
                            <img
                              src={url}
                              alt={`Report image ${index + 1}`}
                              className="object-cover w-[300px] h-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.videoUrl && (
                    <div className="mt-4">
                      <video controls className="w-full rounded-lg">
                        <source src={report.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

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
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="font-medium">{report.assignedTo.name}</p>
                        <p className="text-sm text-gray-500">
                          {report.assignedTo.email}
                        </p>
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
              <div className={`p-2 rounded-lg ${statusColors[report?.status]}`}>
                {statusIcons[report?.status]}
              </div>
              <div>
                <SheetTitle>Update Report Status</SheetTitle>
                <SheetDescription>
                  Current status: {report?.status.replace("_", " ")}
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
                  {/* {Object.entries(statusColors).map(([status, colorClass]) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="flex items-center gap-2"
                    >
                      <span>{status.replace("_", " ")}</span>
                    </SelectItem>
                  ))} */}

                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="NEEDS_MORE_INFO">
                    Needs more info
                  </SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newStatus === "REJECTED" || newStatus === "RESOLVED" ? (
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
            ) : null}
          </div>

          <SheetFooter className="flex flex-row justify-between">
            <Button
              variant="outline"
              onClick={() => setIsUpdateSheetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              // onClick={handleStatusUpdate}
              disabled={
                isUpdating ||
                (["REJECTED", "RESOLVED"].includes(newStatus) &&
                  !resolutionNotes)
              }
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
        <SheetContent>
          <SheetHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg `}>
                <Worm size={30} color="orange" />
              </div>
              <div>
                <SheetTitle>Assign Worker</SheetTitle>
                <SheetDescription>
                  Current status: {report?.status.replace("_", " ")}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
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
    </>
  )
}
