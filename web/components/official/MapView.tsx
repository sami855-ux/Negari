"use client"

import { useEffect, useRef } from "react"
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

// Static polygon: example around Addis Ababa
const regionPolygon: [number, number][] = [
  [9.04, 38.69],
  [9.04, 38.88],
  [8.94, 38.88],
  [8.94, 38.69],
]

const regionBounds = L.latLngBounds(regionPolygon)

interface Report {
  id: number
  title: string
  description: string
  status: string
  category: string
  location: [number, number]
  assignedTo: string
  createdAt: string
  priority: string
}

interface MapViewProps {
  reports: Report[]
  onMarkerClick: (report: Report) => void
}

function MapController({ reports }: { reports: Report[] }) {
  const map = useMap()

  useEffect(() => {
    map.fitBounds(regionBounds)
    map.setMaxBounds(regionBounds) // Prevent panning outside
    map.setMinZoom(12) // Optional: control zoom in
    map.setMaxZoom(18) // Optional: control zoom out
  }, [map])

  return null
}

export default function MapView({ reports, onMarkerClick }: MapViewProps) {
  const mapRef = useRef<L.Map>(null)

  useEffect(() => {
    injectLeafletStylesheet()
  }, [])

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        key={Date.now()}
        ref={mapRef}
        center={[8.99, 38.78]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        maxBounds={regionBounds}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polygon positions={regionPolygon} pathOptions={{ color: "blue" }} />
        <MapController reports={reports} />

        {reports.map((report) => (
          <Marker
            key={report.id}
            position={report.location}
            icon={createCustomIcon(report.status)}
            eventHandlers={{
              click: () => onMarkerClick(report),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{report.title}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  {report.description}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      report.status === "resolved"
                        ? "bg-green-500"
                        : report.status === "urgent"
                        ? "bg-red-500"
                        : report.status === "pending"
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
