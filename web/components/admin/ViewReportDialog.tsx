"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getReportsByUserId } from "@/lib/actions"
import type { Report, User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ViewReportsDialogProps {
  userId: string | null
  username: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  data: User[]
}

export function ViewReportsDialog({
  userId,
  username,
  isOpen,
  onOpenChange,
  data,
}: ViewReportsDialogProps) {
  const [allReports, setAllReports] = React.useState<Report[]>([])
  const [filteredReports, setFilteredReports] = React.useState<Report[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [reportStatusFilter, setReportStatusFilter] =
    React.useState<string>("all")

  const user = data?.find((user) => user.id === userId)

  React.useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true)
      setError(null)
      getReportsByUserId(userId, data)
        .then((data) => {
          setAllReports(data)
          setReportStatusFilter("all")
        })
        .catch((err) => {
          console.error("Failed to fetch reports:", err)
          setError("Failed to load reports.")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else if (!isOpen) {
      setAllReports([])
      setFilteredReports([])
      setError(null)
      setReportStatusFilter("all")
    }
  }, [isOpen, userId])

  React.useEffect(() => {
    if (reportStatusFilter === "all") {
      setFilteredReports(allReports)
    } else {
      setFilteredReports(
        allReports.filter((report) => report.status === reportStatusFilter)
      )
    }
  }, [allReports, reportStatusFilter])

  const getStatusBadgeVariant = (status: Report["status"]) => {
    switch (status) {
      case "VERIFIED":
        return "verified"
      case "PENDING":
        return "pending"
      case "FLAGGED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden bg-card-background border-border-line text-text-primary p-6">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Reports by {username || "User"}
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Overview of reports submitted by {username}.
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4 bg-border-line" />

        <div className="flex justify-end mb-4">
          <Select
            value={reportStatusFilter}
            onValueChange={setReportStatusFilter}
          >
            <SelectTrigger className="w-[180px] border-border-line text-text-primary">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card-background border-border-line">
              <SelectItem
                value="all"
                className="text-text-primary hover:bg-muted focus:bg-muted"
              >
                All Statuses
              </SelectItem>
              <SelectItem
                value="PENDING"
                className="text-text-primary hover:bg-muted focus:bg-muted"
              >
                Pending
              </SelectItem>
              <SelectItem
                value="VERIFIED"
                className="text-text-primary hover:bg-muted focus:bg-muted"
              >
                Verified
              </SelectItem>
              <SelectItem
                value="FLAGGED"
                className="text-text-primary hover:bg-muted focus:bg-muted"
              >
                Flagged
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p>Loading reports...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-flagged-reports">
            <p>{error}</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
            <p>No reports found for this user with the selected filter.</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(80vh-240px)] pr-4">
            <div className="grid gap-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg border-border-line bg-muted/50"
                >
                  {/* Title + Status */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-text-primary">
                      {report.title || "Untitled Report"}
                    </h4>
                    <Badge
                      variant={getStatusBadgeVariant(report.status)}
                      className="px-2 py-0.5 text-xs"
                    >
                      {report.status}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="mb-2 text-sm text-text-secondary">
                    {report.description || "No description provided."}
                  </p>

                  {/* Extra Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1 text-xs text-text-secondary">
                    <span>Category: {fromateCatagory(report.category)}</span>
                    <span>Severity: {report.severity || "Normal"}</span>
                    <span>Location: {getLocationName(report.locationId)}</span>
                  </div>

                  {/* Anonymous + Submitted */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
                    <span>
                      {report.isAnonymous
                        ? "Submitted anonymously"
                        : "Submitted by:  " + user.username}
                    </span>
                    <span>
                      Submitted: {formatDate(new Date(report.createdAt))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

function getLocationName(locationId: string) {
  // Lookup or return fallback
  return "Unknown location"
}

function fromateCatagory(cat: string) {
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
}
