"use client"

import { useEffect, useRef, useMemo } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet"
import * as L from "leaflet"

// Inject Leaflet CSS dynamically
const injectLeafletStylesheet = () => {
  const id = "leaflet-stylesheet"
  if (!document.getElementById(id)) {
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
  }
}

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Create custom colored marker
const createCustomIcon = (status: string) => {
  const colors = {
    resolved: "#22c55e",
    urgent: "#ef4444",
    pending: "#eab308",
    default: "#6b7280",
  }
  const color = colors[status as keyof typeof colors] || colors.default

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    className: "custom-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

interface Report {
  id: string
  title: string
  description: string
  status: ReportStatus
  category: string
  locationId: string
  assignedTo: string
  createdAt: string
  priority: SeverityLevel
  severity: SeverityLevel
  spamScore?: number
  confidenceScore?: number
  isPublic?: boolean
  toxicityScore?: number
  resolutionNote?: string
  resolvedAt?: string
  updatedAt?: string
  isAnonymous?: boolean
  tags?: string[]
  imageUrls?: string[]
  videoUrl?: string
  location: {
    latitude: number
    longitude: number
    address?: string
    city?: string
  }
}
// Report status type
type ReportStatus =
  | "PENDING"
  | "NEEDS_MORE_INFO"
  | "VERIFIED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"

// Severity level type
type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

interface MapViewProps {
  reports: Report[]
  onMarkerClick: (report: Report) => void
  polygon: any // GeoJSON polygon
}

export default function MapView({
  reports,
  onMarkerClick,
  polygon,
}: MapViewProps) {
  const mapRef = useRef<L.Map>(null)

  console.log(reports)
  // Convert GeoJSON polygon (lng, lat) → Leaflet (lat, lng)
  const leafletPolygon = useMemo(() => {
    if (!polygon) return []
    // polygon is [[[lng, lat], [lng, lat], ...]]
    return polygon[0].map(([lng, lat]: [number, number]) => [lat, lng])
  }, [polygon])

  // Compute bounds based on polygon
  const regionBounds = useMemo(() => {
    if (!leafletPolygon.length) return L.latLngBounds([[0, 0]])
    return L.latLngBounds(leafletPolygon as [number, number][])
  }, [leafletPolygon])

  function MapController() {
    const map = useMap()

    useEffect(() => {
      if (leafletPolygon.length) {
        map.fitBounds(regionBounds)
        map.setMaxBounds(regionBounds)
        map.setMinZoom(12)
        map.setMaxZoom(18)
      }
    }, [map, regionBounds, leafletPolygon])

    return null
  }

  useEffect(() => {
    injectLeafletStylesheet()
  }, [])

  return (
    <div className="relative z-10 w-full h-full overflow-hidden rounded-lg">
      <MapContainer
        key={Date.now()}
        ref={mapRef}
        center={leafletPolygon[0] || [8.99, 38.78]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        maxBounds={regionBounds}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draw polygon if available */}
        {leafletPolygon.length > 0 && (
          <Polygon positions={leafletPolygon} pathOptions={{ color: "blue" }} />
        )}

        <MapController />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.latitude, report.location.longitude]}
            icon={createCustomIcon(report.status)}
            eventHandlers={{
              click: () => onMarkerClick(report),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="mb-1 text-sm font-semibold">{report.title}</h3>
                <p className="mb-2 text-xs text-gray-600">
                  {report.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      report.status === "RESOLVED"
                        ? "bg-green-500"
                        : report.status == "REJECTED"
                        ? "bg-red-500"
                        : report.status === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </span>
                  <span className="text-gray-500">{report.category}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
