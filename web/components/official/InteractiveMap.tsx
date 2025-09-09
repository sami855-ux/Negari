"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import L from "leaflet"

// Fix marker icon issue with Leaflet in Next.js
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const AddisCoords: [number, number] = [9.03, 38.74] // Addis Ababa

export default function MapCard() {
  const router = useRouter()

  return (
    <Card className="border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-gray-700 sm:text-lg">
          <MapPin className="w-5 h-5" />
          Interactive Map
        </CardTitle>
        <CardDescription className="text-sm">
          Your patrol area and active incidents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Map Preview */}
        <div className="overflow-hidden border border-blue-200 rounded-lg aspect-video">
          <MapContainer
            center={AddisCoords}
            zoom={12}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={AddisCoords} icon={markerIcon}>
              <Popup>Addis Ababa</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Button */}
        <div className="mt-3 flex justify-center">
          <Button
            onClick={() => router.push("/official/map")}
            className="text-sm text-gray-800 bg-gradient-to-r from-green-200 to-green-400 hover:from-green-300 hover:to-green-500"
          >
            Open Full Map
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
