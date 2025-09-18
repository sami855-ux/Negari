"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Map } from "lucide-react"
import { useEffect, useState } from "react"

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconRetinaUrl: "/images/marker-icon-2x.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface ReportLocation {
  id: string
  latitude: number
  longitude: number
  title: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
}

export default function ReportsMap() {
  const [locations, setLocations] = useState<ReportLocation[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Mock data - replace with your actual data fetching
    setLocations([
      {
        id: "1",
        latitude: 51.505,
        longitude: -0.09,
        title: "Pothole on Main Street",
        status: "OPEN",
      },
      {
        id: "2",
        latitude: 51.51,
        longitude: -0.1,
        title: "Broken traffic light",
        status: "IN_PROGRESS",
      },
      {
        id: "3",
        latitude: 51.515,
        longitude: -0.08,
        title: "Graffiti reported",
        status: "RESOLVED",
      },
    ])
  }, [])

  if (!isClient) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" /> Reports Distribution Map
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
          <div className="text-center text-gray-500">
            <p>Loading map...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5" /> Reports Distribution Map
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 p-0">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", borderRadius: "0.375rem" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
            >
              <Popup>
                <div className="space-y-1">
                  <h3 className="font-medium">{location.title}</h3>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        location.status === "OPEN"
                          ? "bg-red-100 text-red-800"
                          : location.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {location.status.replace("_", " ")}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  )
}
