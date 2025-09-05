import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native"
import * as Location from "expo-location"
import { MapPin, Map, Navigation, CheckCircle } from "lucide-react-native"

const LocationPicker = ({ setValue }) => {
  const [currentLoc, setCurrentLoc] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUseCurrentLocation = async () => {
    setIsLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable location permissions to use this feature.",
          [{ text: "OK" }]
        )
        setIsLoading(false)
        return
      }

      const loc = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = loc.coords

      // Reverse geocode to get address details
      const [addressInfo] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })

      const locationData = {
        latitude,
        longitude,
        address: addressInfo?.name || "",
        city: addressInfo?.city || "",
        region: addressInfo?.region || "",
      }

      setCurrentLoc(locationData)
      setValue("location", locationData)
    } catch (error) {
      console.error("Error fetching location:", error)
      Alert.alert(
        "Location Error",
        "Unable to fetch your current location. Please try again.",
        [{ text: "OK" }]
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePickOnMap = () => {
    // Navigate to a map screen to pick location
    // After user picks, setValue("location", selectedLocation)
    Alert.alert(
      "Pick on Map",
      "Map selection feature would be implemented here."
    )
  }

  return (
    <View className="mb-5">
      <Text className="mb-3 text-lg font-semibold text-gray-800 font-geist">
        Location of Issue
      </Text>

      <View className="flex-row gap-3 mb-3">
        {/* Current Location Button */}
        <TouchableOpacity
          className={`flex-row items-center justify-center flex-1 py-4 rounded-xl font-geist ${
            isLoading ? "bg-blue-100" : "bg-blue-50"
          } border border-blue-100`}
          onPress={handleUseCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#3b82f6" />
          ) : (
            <MapPin size={22} color={"#3b82f6"} />
          )}
          <Text className="ml-2 text-blue-700 font-geist">
            {isLoading ? "Locating..." : "Current Location"}
          </Text>
        </TouchableOpacity>

        {/* Map Selection Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center flex-1 py-4 bg-white border border-gray-200 rounded-xl"
          onPress={handlePickOnMap}
        >
          <Map size={22} color={"#8b5cf6"} />
          <Text className="ml-2 text-purple-700 font-geist">Pick on Map</Text>
        </TouchableOpacity>
      </View>

      {/* Location Display */}
      {currentLoc && (
        <View className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <View className="flex-row items-start mb-2">
            <CheckCircle size={18} color="#10b981" className="mt-0.5 mr-2" />
            <Text className="text-base font-medium text-green-800 font-geist">
              Location Selected
            </Text>
          </View>

          <View className="pl-6">
            <Text className="text-sm text-gray-700 font-jakarta">
              {currentLoc.address && `${currentLoc.address}, `}
              {currentLoc.city && `${currentLoc.city}, `}
              {currentLoc.region}
            </Text>
            <View className="flex-row items-center mt-1">
              <Navigation size={14} color="#6b7280" />
              <Text className="ml-1 text-xs text-gray-500 font-jakarta">
                {currentLoc.latitude.toFixed(5)},{" "}
                {currentLoc.longitude.toFixed(5)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default LocationPicker
