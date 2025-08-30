"use client"

import { Navigation, Globe } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Custom icon using Lucide's MapPin
const createCustomIcon = (color = "#3b82f6") => {
  return L.divIcon({
    html: `
      <div class="relative">
        <MapPin class="w-8 h-8" style="color: ${color}" />
        <div class="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    `,
    className: "bg-transparent border-none",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })
}

interface StaticLocationMapProps {
  latitude: number
  longitude: number
  address?: string
  className?: string
}

export function StaticLocationMap({
  latitude,
  longitude,
  address,
  className = "h-64",
}: StaticLocationMapProps) {
  if (typeof window === "undefined") {
    return (
      <div
        className={`relative flex items-center justify-center bg-blue-50 rounded-lg ${className}`}
      >
        <Globe className="w-8 h-8 text-blue-300" />
      </div>
    )
  }

  return (
    <div className="relative">
      <MapContainer
        center={[latitude, longitude]}
        zoom={17}
        scrollWheelZoom={true}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        className={`rounded-lg z-0 ${className}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={createCustomIcon()}>
          {address && <Popup>{address}</Popup>}
        </Marker>
      </MapContainer>

      {/* Static position indicator */}
      <div className="absolute bottom-2 right-2 bg-white p-2 rounded-lg shadow-md flex items-center gap-1">
        <Navigation className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-medium">Static View</span>
      </div>
    </div>
  )
}
