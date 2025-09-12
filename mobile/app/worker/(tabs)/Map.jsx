import { useState, useEffect } from "react"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import MapView, { Marker } from "react-native-maps"
import { getAllAssignedWorkerReports } from "../../../services/report"

const ReportsMapPage = () => {
  const [assignedReportsWorker, setAssignedReportsWorker] = useState([])
  const [isAssignedLoading, setIsAssignedLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  // Fetch all reports
  const handleFetchAllReport = async () => {
    setIsAssignedLoading(true)
    try {
      const res = await getAllAssignedWorkerReports()
      const reports = res.success ? res.data || [] : []
      setAssignedReportsWorker(reports)

      // Update map region to the first report if available
      if (reports.length > 0) {
        const firstReport = reports[0]
        if (firstReport.location?.latitude && firstReport.location?.longitude) {
          setRegion({
            latitude: firstReport.location.latitude,
            longitude: firstReport.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          })
        }
      }
    } catch (error) {
      console.log(error)
      setAssignedReportsWorker([])
      Alert.alert("Error", "Failed to fetch reports")
    } finally {
      setIsAssignedLoading(false)
    }
  }

  useEffect(() => {
    handleFetchAllReport()
  }, [])

  const handleMarkerPress = (report) => {
    setSelectedReport(report)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedReport(null)
  }

  const getMarkerColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#FFA500"
      case "IN_PROGRESS":
        return "#0066CC"
      case "COMPLETED":
        return "#00AA00"
      case "REJECTED":
        return "#CC0000"
      default:
        return "#808080"
    }
  }

  const getSeverityText = (severity) => {
    return severity
      ? severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()
      : "Unknown"
  }

  if (isAssignedLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0066CC" />
        <Text className="mt-4 text-gray-600 text-base">Loading reports...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {assignedReportsWorker.map((report) => {
          if (!report.location?.latitude || !report.location?.longitude)
            return null
          return (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              title={report.title}
              description={report.description}
              pinColor={getMarkerColor(report.status)}
              onPress={() => handleMarkerPress(report)}
            />
          )
        })}
      </MapView>

      {/* Refresh Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          backgroundColor: "white",
          padding: 10,
          borderRadius: 30,
          elevation: 5,
        }}
        onPress={handleFetchAllReport}
      >
        <Text style={{ color: "#0066CC", fontWeight: "600" }}>Refresh</Text>
      </TouchableOpacity>

      {/* Reports Count */}
      <View
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 10,
          elevation: 5,
        }}
      >
        <Text style={{ color: "#333", fontWeight: "500" }}>
          {assignedReportsWorker.length} Reports
        </Text>
      </View>

      {/* Modal for Report Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            {selectedReport && (
              <>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-800 flex-1 pr-4">
                    {selectedReport.title}
                  </Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    className="bg-gray-200 rounded-full w-8 h-8 justify-center items-center"
                  >
                    <Text className="text-gray-600 font-bold text-lg">×</Text>
                  </TouchableOpacity>
                </View>

                {/* Status and Severity */}
                <View className="flex-row mb-4 space-x-2">
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: getMarkerColor(selectedReport.status),
                    }}
                  >
                    <Text className="text-white text-sm font-medium">
                      {selectedReport.status?.replace("_", " ")}
                    </Text>
                  </View>
                  {selectedReport.severity && (
                    <View className="bg-gray-200 px-3 py-1 rounded-full">
                      <Text className="text-gray-700 text-sm font-medium">
                        {getSeverityText(selectedReport.severity)}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="mb-4">
                  <Text className="text-gray-600 font-medium mb-2">
                    Description:
                  </Text>
                  <Text className="text-gray-800 text-base leading-6">
                    {selectedReport.description}
                  </Text>
                </View>

                <View className="mb-6">
                  <Text className="text-gray-600 font-medium mb-2">
                    Location:
                  </Text>
                  <Text className="text-gray-700 text-sm">
                    Lat: {selectedReport.location?.latitude?.toFixed(6)}, Lng:{" "}
                    {selectedReport.location?.longitude?.toFixed(6)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={closeModal}
                  className="bg-blue-600 rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ReportsMapPage
