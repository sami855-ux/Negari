"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Trash2, Mail, Shield, Calendar } from "lucide-react"
import dynamic from "next/dynamic"
import { useQuery } from "@tanstack/react-query"
import { getAllRegion } from "@/services/region"
import ReactDOMServer from "react-dom/server"
import Image from "next/image"

// Dynamically import leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const FeatureGroup = dynamic(
  () => import("react-leaflet").then((mod) => mod.FeatureGroup),
  { ssr: false }
)
const EditControl = dynamic(
  () => import("react-leaflet-draw").then((mod) => mod.EditControl),
  { ssr: false }
)
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
)

interface UserData {
  id: string
  username: string
  email: string
  profilePicture: string | null
  role: string
  isVerified: boolean
  createdAt: string
  regionId: string | null
  reportsSubmitted: []
  reportsAssignedToMe: []
  reportsAssignedToWorker: []
}

interface RegionData {
  id: string
  name: string
  polygon: {
    type: "Polygon"
    coordinates: number[][][]
  }
  users: {
    id: string
    username: string
    email: string
    profilePicture: string | null
    role: string
    isVerified: boolean
    createdAt: string
    regionId: string | null
  }[]
}

interface ApiResponse {
  data: RegionData[]
  // Add other properties if your API response has them
  // message?: string
  // status?: string
}

export default function RegionAssignmentDialog({
  isOpen,
  setIsOpen,
  userData,
  onRegionAssign,
  isLoading,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  userData: UserData
  onRegionAssign: (customGeojson) => void
  isLoading: boolean
}) {
  const [drawnPolygons, setDrawnPolygons] = useState<[]>([])
  const [, setIsMobile] = useState(false)

  const { data: regionsData, isLoading: isLoadingRegions } =
    useQuery<ApiResponse>({
      queryKey: ["Region"],
      queryFn: getAllRegion,
    })

  useEffect(() => {
    if (typeof window === "undefined") return // safety for SSR

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleCreated = (e) => {
    const layer = e.layer
    const geojson = layer.toGeoJSON()
    setDrawnPolygons([{ id: Date.now(), geojson, layer }])
  }

  const handleDeleted = () => {
    setDrawnPolygons([])
  }

  const clearAllPolygons = () => setDrawnPolygons([])

  const handleAssignRegion = () => {
    if (drawnPolygons.length > 0) {
      onRegionAssign(drawnPolygons[0].geojson)
      setDrawnPolygons([])
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to style the GeoJSON regions
  const regionStyle = (region: RegionData) => {
    const isAssignedToCurrentUser = region.users.some(
      (user) => user.id === userData.id
    )

    return {
      color: isAssignedToCurrentUser ? "#ef4444" : "#3b82f6", // red if assigned to current user, blue otherwise
      weight: 3,
      opacity: 0.9,
      fillColor: isAssignedToCurrentUser ? "#f87171" : "#60a5fa",
      fillOpacity: 0.4,
    }
  }

  // Function to add popup to each region - FIXED VERSION
  const onEachRegion = (region: RegionData, layer: L.Layer) => {
    // Check if the layer has the bindPopup method (it should be a Leaflet layer)
    if (layer && typeof layer.bindPopup === "function") {
      const assignedUsers = region.users.map((user) => user.username).join(", ")
      layer.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${region.name}</h3>
          <p class="text-sm mt-1">Assigned to: ${assignedUsers || "None"}</p>
        </div>
      `)
    }
  }

  const RegionPopup = ({ region }: { region: RegionData }) => {
    return (
      <Card className="w-56 border-none">
        <CardHeader>
          <CardTitle className="text-lg">{region.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {region.users.length > 0 ? (
              region.users.map((user) => (
                <div key={user.username} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} />
                    ) : (
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm">{user.username}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Assigned to: None</p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Alternative approach using event handlers
  const handleRegionClick = (region: RegionData) => {
    return (e) => {
      const popupContent = ReactDOMServer.renderToString(
        <RegionPopup region={region} />
      )

      L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(e.target._map)
    }
  }

  if (isLoadingRegions || !regionsData) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] h-full md:max-w-[90vw] md:w-[90vw] md:h-[85vh] p-0 overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <svg
                className="w-8 h-8 text-blue-600 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading regions...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Extract the actual regions array from the API response
  const regions = regionsData.data || []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] w-full max-h-[90vh] h-full md:max-w-[90vw] md:w-[90vw] md:h-[85vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full md:flex-row">
          {/* User info sidebar - hidden on mobile, shown on desktop */}
          <div className="flex-col hidden p-4 overflow-y-auto border-r md:flex w-80 bg-muted/40">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  {userData.profilePicture ? (
                    <Image
                      src={userData.profilePicture || "/default-avatar.png"}
                      alt={userData.username}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    userData.username.charAt(0).toUpperCase()
                  )}
                </div>
                {userData.isVerified && (
                  <div className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -bottom-1 -right-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-center">
                {userData.username}
              </h3>
              <p className="text-sm text-center text-muted-foreground">
                {userData.role}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm break-all text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {userData.role.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Joined</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-700">
                      Reports Submitted
                    </p>
                    <Badge
                      variant="outline"
                      className="text-blue-700 bg-blue-100"
                    >
                      {userData.reportsSubmitted.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-amber-700">
                      Assigned Reports
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-700"
                    >
                      {userData.reportsAssignedToMe.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Display existing regions */}
            {regions.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-2 text-sm font-medium">Existing Regions</h4>
                <div className="space-y-2">
                  {regions.map((region) => (
                    <div
                      key={region.id}
                      className="p-2 text-sm rounded-md bg-slate-100"
                    >
                      <p className="font-medium">{region.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {region.users.length} user
                        {region.users.length !== 1 ? "s" : ""} assigned
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex flex-col flex-1 h-full">
            <DialogHeader className="px-4 pt-4 pb-2 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-xl">Assign Region</DialogTitle>
                  <DialogDescription className="mt-1">
                    Draw a region boundary on the map to assign to{" "}
                    <span className="font-semibold text-foreground">
                      {userData.username}
                    </span>
                  </DialogDescription>
                </div>
              </div>

              {/* Mobile user info */}
              <div className="flex items-center gap-2 p-2 mt-3 rounded-lg md:hidden bg-muted">
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  {userData.profilePicture ? (
                    <Image
                      src={userData.profilePicture || "/default-avatar.png"}
                      alt={userData.username}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    userData.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{userData.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
                {userData.isVerified && (
                  <Badge variant="secondary" className="ml-auto">
                    Verified
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="flex flex-col flex-1 p-4 overflow-hidden">
              <div className="relative flex-1 overflow-hidden border rounded-lg">
                <MapContainer
                  center={[9.03, 38.74]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Render existing regions */}
                  {regions.map((region) => (
                    <GeoJSON
                      key={region.id}
                      data={region.polygon}
                      style={() => regionStyle(region)}
                      onEachFeature={(feature, layer) =>
                        onEachRegion(region, layer)
                      }
                      eventHandlers={{
                        click: handleRegionClick(region),
                      }}
                    />
                  ))}

                  <FeatureGroup>
                    <EditControl
                      position="topright"
                      onCreated={handleCreated}
                      onDeleted={handleDeleted}
                      draw={{
                        rectangle: false,
                        circle: false,
                        marker: false,
                        polyline: false,
                        circlemarker: false,
                        polygon: {
                          shapeOptions: {
                            color: "#3b82f6", // blue-500
                            weight: 3,
                            opacity: 0.9,
                            fillColor: "#60a5fa", // blue-400
                            fillOpacity: 0.4,
                          },
                          allowIntersection: false,
                          showArea: true,
                          showLength: true,
                          metric: true,
                          guideLayers: true,
                        },
                      }}
                      edit={{
                        remove: true,
                        edit: false,
                      }}
                    />
                  </FeatureGroup>
                </MapContainer>

                {/* Drawing instructions overlay */}
                {drawnPolygons.length === 0 && (
                  <div className="absolute z-[9999] max-w-xs p-3 border rounded-md shadow-sm top-2 left-2 bg-background/90 backdrop-blur-sm">
                    <p className="flex items-center gap-1 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Drawing Instructions
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Click to place vertices and complete the polygon by
                      clicking the first point.
                    </p>
                    {regions.length > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Colored areas show existing regions. Click on them for
                        details.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {drawnPolygons.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 mt-3 border border-blue-200 rounded-md bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-full">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Region Drawn
                      </p>
                      <p className="text-xs text-blue-600">
                        {drawnPolygons[0].geojson.geometry.coordinates[0]
                          .length - 1}{" "}
                        points
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllPolygons}
                    className="h-8 gap-1 bg-white hover:bg-blue-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-col-reverse gap-2 px-4 py-3 border-t bg-muted/30 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  setDrawnPolygons([])
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRegion}
                disabled={drawnPolygons.length === 0 || isLoading}
                className="flex items-center justify-center w-full gap-1 bg-blue-600 sm:w-auto hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <svg
                    className="w-4 h-4 mr-2 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  <MapPin className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Assigning..." : "Assign Region"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
