"use client"
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
  ShieldAlert,
  AlertTriangle,
  MailWarning,
  Gauge,
  ChevronDown,
  Compass,
  Landmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StaticLocationMap } from "@/components/StaticLocationMap"
import useGetAllReports from "@/hooks/useGetAllReports"
import { DeleteConfirmationModal } from "@/components/DeleteModal"

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
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
  if (!score) return "bg-gray-200"
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

export default function UserReportsPage({ params }) {
  const router = useRouter()
  const { isLoading, reports } = useGetAllReports()
  const [userReports, setUserReports] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState(null)
  const [expandedReport, setExpandedReport] = useState(null)

  useEffect(() => {
    if (reports?.length) {
      const matchedReports = reports.filter(
        (r) => r.reporterId === params.userId
      )
      setUserReports(matchedReports)
    }
  }, [reports, params.userId])

  const toggleReportExpansion = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId)
  }

  const handleDeleteClick = (report) => {
    setReportToDelete(report)
    setIsModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    console.log("Deleting report:", reportToDelete.id)
    // Implement delete logic here
    setIsModalOpen(false)
    setReportToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="mr-2 animate-spin" size={33} />
      </div>
    )
  }

  if (!userReports.length) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-lg font-medium">No reports found for this user</p>
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

        <div className="my-6">
          <section className="flex gap-3">
            <User size={30} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Reports</h1>
              <p className="text-gray-600 py-2 font-jakarta text-[15px]">
                Showing all reports submitted by{" "}
                {userReports[0]?.reporter?.username || "this user"}
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {userReports.map((report) => (
            <Card
              key={report.id}
              className="relative overflow-hidden border-gray-200 shadow-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>
                        {format(
                          new Date(report.createdAt),
                          "MMM dd, yyyy h:mm a"
                        )}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {report.isAnonymous
                          ? "Anonymous"
                          : report.reporter?.username}
                      </span>
                    </div>
                  </div>
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
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 line-clamp-2">
                    {report.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReportExpansion(report.id)}
                    className="text-primary hover:bg-transparent"
                  >
                    {expandedReport === report.id ? "Show less" : "Show more"}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${
                        expandedReport === report.id ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>

                {expandedReport === report.id && (
                  <div className="mt-4 space-y-6">
                    <Separator />

                    {/* AI Analysis Section */}
                    {report.status === "PENDING" && (
                      <div className="grid grid-cols-1 gap-4 p-4 rounded-lg bg-blue-50 md:grid-cols-2">
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
                        </div>
                      </div>
                    )}

                    {/* Media Section */}
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
                                className="object-cover w-full h-full"
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

                    {/* Tags Section */}
                    {report.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {report.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Location Section */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Location</h3>
                      <StaticLocationMap
                        latitude={report.location.latitude}
                        longitude={report.location.longitude}
                        address={report.location.address}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    </div>

                    {/* Status Details Section */}
                    <div className="p-4 space-y-4 rounded-lg bg-blue-50">
                      <h3 className="font-medium">Status Details</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            Current Status
                          </p>
                          <Badge
                            className={`mt-1 ${statusColors[report.status]}`}
                          >
                            {statusIcons[report.status]}
                            <span className="ml-1">
                              {report.status.replace("_", " ")}
                            </span>
                          </Badge>
                        </div>

                        {report.assignedTo && (
                          <div>
                            <p className="text-sm text-gray-500">Assigned To</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={report.assignedTo.profilePicture}
                                />
                                <AvatarFallback>
                                  {report.assignedTo.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <p className="font-medium">
                                {report.assignedTo.username}
                              </p>
                            </div>
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

                        {report.rejectedAt && (
                          <div>
                            <p className="text-sm text-gray-500">Rejected At</p>
                            <p>
                              {format(
                                new Date(report.rejectedAt),
                                "MMM dd, yyyy h:mm a"
                              )}
                            </p>
                          </div>
                        )}

                        {report.resolutionNote && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">
                              Resolution Notes
                            </p>
                            <p className="p-3 mt-1 bg-white rounded-lg">
                              {report.resolutionNote}
                            </p>
                          </div>
                        )}

                        {report.rejectionReason && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">
                              Rejection Reason
                            </p>
                            <p className="p-3 mt-1 bg-white rounded-lg">
                              {report.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Feedback Section */}
                    {report.feedback && (
                      <div className="p-4 space-y-4 border-green-200 rounded-lg bg-green-50">
                        <h3 className="font-medium text-green-800">Feedback</h3>
                        <div className="flex items-center">
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
                          <div className="p-3 bg-white rounded-lg">
                            <p className="text-green-800">
                              {report.feedback.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions Section */}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        // onClick={() => handleDeleteClick(report)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
