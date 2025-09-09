"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  MapPin,
  Trash2,
  Edit3,
  Shield,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Map,
  Building2,
  UserCog,
  Eye,
  MoreVertical,
  BadgeCheck,
  MailWarning,
  MapPinned,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import RegionAssignmentDialog from "@/components/official/RegionMap"
import { axiosInstance } from "@/services/auth"
import LoadingSpinner from "@/components/LoadingSpinner"
import { getSingleUser } from "@/services/getUsers"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

// Define TypeScript interfaces
interface Region {
  id: string
  name: string
  code: string
  center: [number, number]
  reports: number
}

interface UserData {
  id: string
  username: string
  email: string
  profilePicture: string | null
  role: string
  isVerified: boolean
  createdAt: string
  regionId: string | null
  region: Region | null
  reportsSubmitted: []
  reportsAssignedToMe: []
  reportsAssignedToWorker: []
}

// Mock reports data
const mockReports = [
  {
    id: 1,
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    status: "urgent",
    category: "Infrastructure",
    location: [9.012, 38.799],
    assignedTo: "John Smith",
    createdAt: "2024-01-15",
    priority: "high",
  },
  {
    id: 2,
    title: "Broken Street Light",
    description: "Street light not working on Oak Avenue",
    status: "pending",
    category: "Utilities",
    location: [9.015, 38.756],
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-14",
    priority: "medium",
  },
]

function featureToPolygon(feature) {
  if (
    feature.type === "Feature" &&
    feature.geometry &&
    feature.geometry.type === "Polygon"
  ) {
    return {
      type: feature.geometry.type,
      coordinates: feature.geometry.coordinates,
    }
  } else {
    throw new Error("Invalid feature: must be a Polygon Feature")
  }
}

export default function UserProfilePage({ params }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [userData, setUserData] = useState<UserData | null>(null)

  const [isAssignRegionDialogOpen, setIsAssignRegionDialogOpen] =
    useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<UserData>>({})
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsUserLoading(true)
        const res = await getSingleUser(params.userId)

        if (res && res.user) {
          setUserData(res.user)
          setEditedUser(res.user)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsUserLoading(false)
      }
    }

    fetchUser()
  }, [params.userId])

  const handleDeleteUser = () => {
    console.log("Deleting user:")
    setIsDeleteDialogOpen(false)
    router.push("/admin/users")
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "OFFICER":
        return "default"
      case "WORKER":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-4 h-4" />
      case "urgent":
        return <AlertCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Handle region assignment
  const handleRegionAssign = async (customGeojson) => {
    setIsLoading(true)
    try {
      const payload = {
        polygon: featureToPolygon(customGeojson),
        name: "New Region",
        officialId: params.userId,
      }

      const response = await axiosInstance.post(
        "/user/assign-official",
        payload
      )

      if (response.data.success) {
        toast.success(response.data.message || "Region assigned successfully")

        queryClient.invalidateQueries({ queryKey: ["Region"] })
      }
    } catch (error) {
      console.error(
        "Error assigning region:",
        error.response?.data || error.message
      )
      // Show error notification
      toast.error(error.response?.data.message || "Error assigning region")
    } finally {
      setIsLoading(false)
    }
  }

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size={8} color="text-blue-600" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">User not found</p>
      </div>
    )
  }

  return (
    <div className="container py-6 mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-7 w-7" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          User Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left sidebar - User info */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={userData.profilePicture || ""} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userData.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="flex items-center justify-center gap-2">
                {userData.username}
                {userData.isVerified && (
                  <BadgeCheck className="w-5 h-5 text-blue-500" />
                )}
              </CardTitle>
              <CardDescription className="font-jakarta">
                {userData.email}
              </CardDescription>
              <div className="flex justify-center">
                <Badge
                  variant={getRoleBadgeVariant(userData.role)}
                  className="font-jakarta"
                >
                  {userData.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Joined</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(userData.createdAt), "MMM dd, yyyy")}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Admin Privileges</span>
                  <Switch
                    checked={userData.role === "ADMIN"}
                    disabled
                    className="ml-auto data-[state=checked]:bg-blue-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <MailWarning className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Email Verified</span>
                  <Switch
                    checked={userData.isVerified}
                    disabled
                    className="ml-auto"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </Button>
            </CardFooter>
          </Card>

          {/* Region Assignment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinned className="w-5 h-5" />
                Region Assignment
              </CardTitle>
              <CardDescription>
                {userData.region
                  ? `Assigned to ${userData.region.name}`
                  : "No region assigned"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userData.region ? (
                <div className="p-3 space-y-2 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{userData.region.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Reports in region:</span>
                    <Badge variant="outline">{userData.region.name}</Badge>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  <Map className="w-8 h-8 mx-auto mb-2" />
                  {userData.role === "ADMIN" ||
                  userData.role === "CITIZEN" ||
                  userData.role === "WORKER" ? (
                    <p>
                      {`${userData.role}`.charAt(0).toUpperCase() +
                        `${userData.role}`.slice(1).toLowerCase()}{" "}
                      are not assigned to a region.
                    </p>
                  ) : (
                    <p>This user has no region assigned.</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => setIsAssignRegionDialogOpen(true)}
                disabled={
                  userData.role === "ADMIN" ||
                  userData.role === "CITIZEN" ||
                  userData.role === "WORKER"
                }
              >
                <MapPin className="w-4 h-4 mr-2" />
                {userData.region ? "Change Region" : "Assign Region"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4 bg-white">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="border-blue-100">
                <CardHeader className="bg-blue-100 border-b border-blue-200">
                  <CardTitle className="text-gray-800">
                    User Information
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Detailed information about the user account
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="username"
                        className="font-medium text-gray-700"
                      >
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={editedUser.username || ""}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            username: e.target.value,
                          })
                        }
                        disabled={true}
                        className="text-gray-900 border-gray-200 bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="font-medium text-gray-700"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email || ""}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            email: e.target.value,
                          })
                        }
                        disabled={true}
                        className="text-gray-900 border-gray-200 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="role"
                        className="font-medium text-gray-700"
                      >
                        Role
                      </Label>
                      <Select
                        value={editedUser.role || ""}
                        onValueChange={(value) =>
                          setEditedUser({ ...editedUser, role: value })
                        }
                        disabled={true}
                      >
                        <SelectTrigger className="text-gray-900 border-gray-200 bg-gray-50">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="OFFICER">Officer</SelectItem>
                          <SelectItem value="WORKER">Worker</SelectItem>
                          <SelectItem value="CITIZEN">Citizen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="region"
                        className="font-medium text-gray-700"
                      >
                        Region
                      </Label>
                      <Input
                        id="region"
                        value={
                          userData.region
                            ? userData.region.name
                            : "Not assigned"
                        }
                        disabled
                        className="text-gray-900 border-gray-200 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="joined"
                      className="font-medium text-gray-700"
                    >
                      Joined Date
                    </Label>
                    <Input
                      id="joined"
                      value={format(new Date(userData.createdAt), "PPpp")}
                      disabled
                      className="text-gray-900 border-gray-200 bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100">
                <CardHeader className="bg-blue-100 border-b border-blue-200">
                  <CardTitle className="text-gray-800">Statistics</CardTitle>
                  <CardDescription className="text-gray-600">
                    User activity and report statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {userData.role === "CITIZEN" && (
                      <div className="p-4 space-y-2 border border-blue-200 rounded-lg bg-blue-25">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-800">
                            Reports Submitted
                          </span>
                          <Badge
                            variant="outline"
                            className="text-blue-800 bg-blue-100 border-blue-300"
                          >
                            {userData.reportsSubmitted.length}
                          </Badge>
                        </div>
                        <Progress
                          value={userData.reportsSubmitted.length * 10}
                          className="h-2 bg-blue-100"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    )}

                    {userData.role === "OFFICER" && (
                      <div className="p-4 space-y-2 border border-blue-200 rounded-lg bg-blue-25">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-800">
                            Assigned Reports
                          </span>
                          <Badge
                            variant="outline"
                            className="text-blue-800 bg-blue-100 border-blue-300"
                          >
                            {userData.reportsAssignedToMe.length}
                          </Badge>
                        </div>
                        <Progress
                          value={userData.reportsAssignedToMe.length * 10}
                          className="h-2 bg-blue-100"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    )}

                    {userData.role === "WORKER" && (
                      <div className="col-span-2 p-4 space-y-2 border border-blue-200 rounded-lg bg-blue-25">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-800">
                            Worker Assignments
                          </span>
                          <Badge
                            variant="outline"
                            className="text-blue-800 bg-blue-100 border-blue-300"
                          >
                            {userData.reportsAssignedToWorker.length}
                          </Badge>
                        </div>
                        <Progress
                          value={userData.reportsAssignedToWorker.length * 10}
                          className="h-2 bg-blue-100"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>User Reports</CardTitle>
                  <CardDescription>
                    Reports submitted by or assigned to this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {mockReports.length > 0 ? (
                    <div className="space-y-4">
                      {mockReports.map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                report.status === "resolved"
                                  ? "bg-green-100"
                                  : report.status === "urgent"
                                  ? "bg-red-100"
                                  : "bg-yellow-100"
                              }`}
                            >
                              {getStatusIcon(report.status)}
                            </div>
                            <div>
                              <p className="font-medium">{report.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {report.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                report.status === "resolved"
                                  ? "default"
                                  : report.status === "urgent"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {report.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <p>No reports found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    User&apos;s recent actions and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <UserCog className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Account created</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(userData.createdAt), "PPpp")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Email verified</p>
                        <p className="text-sm text-muted-foreground">
                          {userData.isVerified ? "Verified" : "Not verified"}
                        </p>
                      </div>
                    </div>

                    {userData.region && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Region assigned</p>
                          <p className="text-sm text-muted-foreground">
                            Assigned to {userData.region.name} region
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Region Assignment Dialog */}
      <RegionAssignmentDialog
        isOpen={isAssignRegionDialogOpen}
        setIsOpen={setIsAssignRegionDialogOpen}
        userData={userData}
        onRegionAssign={handleRegionAssign}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userData.username}&apos;s
              account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
