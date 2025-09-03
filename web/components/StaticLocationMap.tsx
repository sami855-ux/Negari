"use client"

import { Navigation, Globe } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Custom icon using Lucide's MapPin
const createCustomIcon = (color = "#3b82f6") => {
  const svg = `
    <div class="relative flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" 
        viewBox="0 0 24 24" fill="url(#grad)" stroke="white" stroke-width="1.5" 
        stroke-linecap="round" stroke-linejoin="round" 
        class="drop-shadow-lg animate-bounce">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/>
        <circle cx="12" cy="10" r="3" fill="white"/>
      </svg>
    </div>
  `
  return L.divIcon({
    html: svg,
    className: "bg-transparent border-none",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
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
        zoom={27}
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
          {address && (
            <Popup className="custom-popup">
              <div className="p-2 bg-white rounded-lg shadow-md">
                <h3 className="text-sm font-semibold text-gray-800">
                  📍 Location
                </h3>
                <p className="text-xs text-gray-600">{address}</p>
                <p className="mt-1 text-[11px] text-gray-400">
                  Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>

      {/* Static position indicator */}
      <div className="absolute flex items-center gap-1 p-2 bg-white rounded-lg shadow-md bottom-2 right-2">
        <Navigation className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-medium">Static View</span>
      </div>
    </div>
  )
}
