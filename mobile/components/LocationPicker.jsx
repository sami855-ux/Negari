"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Platform
} from "react-native"
import * as Location from "expo-location"
import { Marker } from "react-native-maps"
import { MapPin, Map, Navigation, CheckCircle, X } from "lucide-react-native"

let MapView
if (Platform.OS !== "web") {
  MapView = require("react-native-maps").default
}
const LocationPicker = ({ setValue }) => {
  const [currentLoc, setCurrentLoc] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMapVisible, setIsMapVisible] = useState(false)
  const [mapRegion, setMapRegion] = useState(null)
  const [pickedLocation, setPickedLocation] = useState(null)

  // Get current region for map initial view
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({})
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        })
      }
    })()
  }, [])

  // Handle current location button
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
      Alert.alert("Location Error", "Unable to fetch your current location.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle pick on map
  const handlePickOnMap = () => {
    setIsMapVisible(true)
  }

  // Confirm location from map
  const handleConfirmMapLocation = async () => {
    if (!pickedLocation) {
      Alert.alert("No Location", "Please tap on the map to select a location.")
      return
    }

    const [addressInfo] = await Location.reverseGeocodeAsync(pickedLocation)

    const locationData = {
      latitude: pickedLocation.latitude,
      longitude: pickedLocation.longitude,
      address: addressInfo?.name || "",
      city: addressInfo?.city || "",
      region: addressInfo?.region || "",
    }

    setCurrentLoc(locationData)
    setValue("location", locationData)
    setIsMapVisible(false)
  }



if (Platform.OS !== "web") {
  return <MapModal ... />
} else {
  return <Text>Map picker works only on mobile</Text>
}



  return (
    <View className="mb-6">
      <Text className="mb-4 text-xl font-bold text-gray-900 font-geist">
        📍 Location of Issue
      </Text>

      <View className="flex-row gap-4 mb-4">
        {/* Current Location Button */}
        <TouchableOpacity
          className={`flex-row items-center justify-center flex-1 py-5 rounded-2xl font-geist shadow-lg ${
            isLoading
              ? "bg-gradient-to-r from-blue-400 to-blue-500"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          } border-0`}
          onPress={handleUseCurrentLocation}
          disabled={isLoading}
          style={{
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <MapPin size={24} color={"#ffffff"} />
          )}
          <Text className="ml-3 text-base font-semibold text-white font-geist">
            {isLoading ? "Locating..." : "Current Location"}
          </Text>
        </TouchableOpacity>

        {/* Map Selection Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center flex-1 py-5 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl"
          onPress={handlePickOnMap}
          style={{
            shadowColor: "#8b5cf6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Map size={24} color={"#ffffff"} />
          <Text className="ml-3 text-base font-semibold text-white font-geist">
            Pick on Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Display */}
      {currentLoc && (
        <View
          className="p-5 border border-green-200 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl"
          style={{
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center mb-3">
            <View className="p-1 mr-3 bg-green-500 rounded-full">
              <CheckCircle size={20} color="#ffffff" />
            </View>
            <Text className="text-lg font-bold text-green-800 font-geist">
              Location Selected ✓
            </Text>
          </View>

          <View className="p-4 bg-white border border-green-100 rounded-xl">
            <Text className="mb-2 text-base font-medium text-gray-800 font-jakarta">
              📍 {currentLoc.address && `${currentLoc.address}, `}
              {currentLoc.city && `${currentLoc.city}, `}
              {currentLoc.region}
            </Text>
            <View className="flex-row items-center">
              <View className="p-1 mr-2 bg-gray-100 rounded-full">
                <Navigation size={12} color="#6b7280" />
              </View>
              <Text className="font-mono text-sm text-gray-600 font-jakarta">
                {currentLoc.latitude.toFixed(5)},{" "}
                {currentLoc.longitude.toFixed(5)}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Modal for Map Picker */}
      <Modal visible={isMapVisible} animationType="slide">
        <View style={{ flex: 1 }}>
          {mapRegion && (
            <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={mapRegion}
              onPress={(e) => setPickedLocation(e.nativeEvent.coordinate)}
            >
              {pickedLocation && <Marker coordinate={pickedLocation} />}
            </MapView>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsMapVisible(false)}
            >
              <X size={22} color="#fff" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirmMapLocation}
            >
              <CheckCircle size={22} color="#fff" />
              <Text style={styles.buttonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalButtons: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cancelButton: {
    backgroundColor: "#ef4444",
    shadowColor: "#ef4444",
  },
  confirmButton: {
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "700",
  },
})

export default LocationPicker
