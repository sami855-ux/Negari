// import { useState, useEffect } from "react"
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   ScrollView,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Alert,
//   Platform,
// } from "react-native"
// // import MapView, { Marker, PROVIDER_GOOGLE, Heatmap } from "react-native-maps"
// import * as Location from "expo-location"
// import { FireExtinguisher, MapPin, Settings, X } from "lucide-react-native"
// import { G } from "react-native-svg"

// let MapView, Marker, Heatmap, PROVIDER_GOOGLE

// const { width, height } = Dimensions.get("window")

// // Color palette
// const colors = {
//   primary: "#2563eb", // Blue
//   secondary: "#059669", // Green
//   accent: "#0891b2", // Cyan
//   success: "#10b981",
//   warning: "#f59e0b",
//   danger: "#ef4444",
//   background: "#f8fafc",
//   surface: "#ffffff",
//   text: "#1e293b",
//   textSecondary: "#64748b",
//   border: "#e2e8f0",
// }

// // Issue types with colors and icons
// const issueTypes = {
//   pothole: { color: "#ef4444", icon: "🕳️", label: "Pothole" },
//   streetlight: { color: "#f59e0b", icon: "💡", label: "Broken Streetlight" },
//   trash: { color: "#8b5cf6", icon: "🗑️", label: "Overflowing Trash" },
//   vandalism: { color: "#ec4899", icon: "🎨", label: "Vandalism" },
//   noise: { color: "#06b6d4", icon: "🔊", label: "Noise Complaint" },
//   crime: { color: "#dc2626", icon: "🚨", label: "Crime Report" },
//   flood: { color: "#0ea5e9", icon: "🌊", label: "Flooded Roads" },
//   animals: { color: "#65a30d", icon: "🐕", label: "Stray Animals" },
//   fire: { color: "#ea580c", icon: "🔥", label: "Fire Hazard" },
// }

// // Sample data
// const sampleIssues = [
//   {
//     id: "1",
//     type: "pothole",
//     title: "Large pothole on Main St",
//     description: "Deep pothole causing vehicle damage",
//     latitude: 37.78825,
//     longitude: -122.4324,
//     severity: "high",
//     status: "pending",
//     reportedAt: "2024-01-15",
//   },
//   {
//     id: "2",
//     type: "streetlight",
//     title: "Broken streetlight",
//     description: "Street light not working for 3 days",
//     latitude: 37.78925,
//     longitude: -122.4334,
//     severity: "medium",
//     status: "acknowledged",
//     reportedAt: "2024-01-14",
//   },
//   {
//     id: "3",
//     type: "trash",
//     title: "Overflowing dumpster",
//     description: "Trash bin overflowing, attracting pests",
//     latitude: 37.78725,
//     longitude: -122.4314,
//     severity: "medium",
//     status: "resolved",
//     reportedAt: "2024-01-13",
//   },
//   {
//     id: "4",
//     type: "flood",
//     title: "Flooded intersection",
//     description: "Water accumulation after rain",
//     latitude: 37.78625,
//     longitude: -122.4344,
//     severity: "high",
//     status: "pending",
//     reportedAt: "2024-01-16",
//   },
//   {
//     id: "5",
//     type: "crime",
//     title: "Suspicious activity",
//     description: "Reported suspicious behavior",
//     latitude: 37.78525,
//     longitude: -122.4354,
//     severity: "high",
//     status: "acknowledged",
//     reportedAt: "2024-01-15",
//   },
//   {
//     id: "6",
//     type: "animals",
//     title: "Stray dogs in park",
//     description: "Multiple stray dogs roaming in the park area",
//     latitude: 37.78425,
//     longitude: -122.4364,
//     severity: "low",
//     status: "pending",
//     reportedAt: "2024-01-17",
//   },
//   {
//     id: "7",
//     type: "fire",
//     title: "Electrical hazard",
//     description: "Exposed electrical wires near playground",
//     latitude: 37.78325,
//     longitude: -122.4374,
//     severity: "high",
//     status: "acknowledged",
//     reportedAt: "2024-01-16",
//   },
// ]

// const Map = () => {
//   const [userLocation, setUserLocation] = useState(null)
//   const [selectedIssue, setSelectedIssue] = useState(null)
//   const [showFilters, setShowFilters] = useState(false)
//   const [showHeatmap, setShowHeatmap] = useState(false)
//   const [locationPermission, setLocationPermission] = useState(null)
//   const [filters, setFilters] = useState({
//     categories: Object.keys(issueTypes),
//     severities: ["low", "medium", "high"],
//     statuses: ["pending", "acknowledged", "resolved"],
//     dateRange: "all",
//   })

//   useEffect(() => {
//     requestLocationPermission()
//   }, [])

//   useEffect(() => {
//     if (Platform.OS !== "web") {
//       import("react-native-maps").then((Maps) => {
//         MapView = Maps.default
//         Marker = Maps.Marker
//         Heatmap = Maps.Heatmap
//         PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE
//       })
//     }
//   }, [])

//   const requestLocationPermission = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync()
//       setLocationPermission(status === "granted")

//       if (status === "granted") {
//         getCurrentLocation()
//       } else {
//         Alert.alert(
//           "Location Permission",
//           "Location permission is required to show your current position on the map.",
//           [{ text: "OK" }]
//         )
//       }
//     } catch (error) {
//       console.error("Error requesting location permission:", error)
//     }
//   }

//   const getCurrentLocation = async () => {
//     try {
//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       })

//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       })
//     } catch (error) {
//       console.error("Error getting current location:", error)
//       Alert.alert("Location Error", "Unable to get your current location.")
//     }
//   }

//   const filteredIssues = sampleIssues.filter((issue) => {
//     return (
//       filters.categories.includes(issue.type) &&
//       filters.severities.includes(issue.severity) &&
//       filters.statuses.includes(issue.status)
//     )
//   })

//   const getMarkerColor = (issue) => {
//     const baseColor = issueTypes[issue.type]?.color || colors.primary
//     if (issue.status === "resolved") return colors.success
//     if (issue.severity === "high") return colors.danger
//     return baseColor
//   }

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case "high":
//         return colors.danger
//       case "medium":
//         return colors.warning
//       case "low":
//         return colors.success
//       default:
//         return colors.textSecondary
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "resolved":
//         return colors.success
//       case "acknowledged":
//         return colors.warning
//       case "pending":
//         return colors.danger
//       default:
//         return colors.textSecondary
//     }
//   }

//   const toggleFilter = (filterType, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [filterType]: prev[filterType].includes(value)
//         ? prev[filterType].filter((item) => item !== value)
//         : [...prev[filterType], value],
//     }))
//   }

//   const heatmapData = filteredIssues.map((issue) => ({
//     latitude: issue.latitude,
//     longitude: issue.longitude,
//     weight: issue.severity === "high" ? 3 : issue.severity === "medium" ? 2 : 1,
//   }))

//   const FilterModal = () => (
//     <Modal
//       visible={showFilters}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setShowFilters(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.filterModal}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle} className="font-geist">
//               Filters
//             </Text>
//             <TouchableOpacity
//               onPress={() => setShowFilters(false)}
//               style={styles.closeButton}
//             >
//               <Text style={styles.closeButtonText} className="font-geist">
//                 <X size={20} />
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             style={styles.filterContent}
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Categories */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle} className="font-geist">
//                 Categories
//               </Text>
//               <View style={styles.filterGrid}>
//                 {Object.entries(issueTypes).map(([key, type]) => (
//                   <TouchableOpacity
//                     key={key}
//                     style={[
//                       styles.filterChip,
//                       filters.categories.includes(key) &&
//                         styles.filterChipActive,
//                     ]}
//                     onPress={() => toggleFilter("categories", key)}
//                   >
//                     <Text style={styles.filterChipIcon}>{type.icon}</Text>
//                     <Text
//                       style={[
//                         styles.filterChipText,
//                         filters.categories.includes(key) &&
//                           styles.filterChipTextActive,
//                       ]}
//                       className="font-geist"
//                     >
//                       {type.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Severity */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Severity</Text>
//               <View style={styles.filterRow}>
//                 {["low", "medium", "high"].map((severity) => (
//                   <TouchableOpacity
//                     key={severity}
//                     style={[
//                       styles.severityChip,
//                       { borderColor: getSeverityColor(severity) },
//                       filters.severities.includes(severity) && {
//                         backgroundColor: getSeverityColor(severity),
//                       },
//                     ]}
//                     onPress={() => toggleFilter("severities", severity)}
//                   >
//                     <Text
//                       style={[
//                         styles.severityChipText,
//                         { color: getSeverityColor(severity) },
//                         filters.severities.includes(severity) && {
//                           color: "white",
//                         },
//                       ]}
//                       className="font-geist"
//                     >
//                       {severity.toUpperCase()}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* Status */}
//             <View style={styles.filterSection}>
//               <Text style={styles.filterSectionTitle}>Status</Text>
//               <View style={styles.filterRow}>
//                 {["pending", "acknowledged", "resolved"].map((status) => (
//                   <TouchableOpacity
//                     key={status}
//                     style={[
//                       styles.statusChip,
//                       { borderColor: getStatusColor(status) },
//                       filters.statuses.includes(status) && {
//                         backgroundColor: getStatusColor(status),
//                       },
//                     ]}
//                     onPress={() => toggleFilter("statuses", status)}
//                   >
//                     <Text
//                       style={[
//                         styles.statusChipText,
//                         { color: getStatusColor(status) },
//                         filters.statuses.includes(status) && { color: "white" },
//                       ]}
//                       className="font-geist"
//                     >
//                       {status.toUpperCase()}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   )

//   const IssueDetailModal = () => (
//     <Modal
//       visible={!!selectedIssue}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={() => setSelectedIssue(null)}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.detailModal}>
//           {selectedIssue && (
//             <>
//               <View style={styles.modalHeader}>
//                 <View style={styles.issueHeader}>
//                   <Text style={styles.issueIcon}>
//                     {issueTypes[selectedIssue.type]?.icon}
//                   </Text>
//                   <View style={styles.issueTitleContainer}>
//                     <Text style={styles.issueTitle}>{selectedIssue.title}</Text>
//                     <Text style={styles.issueType}>
//                       {issueTypes[selectedIssue.type]?.label}
//                     </Text>
//                   </View>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => setSelectedIssue(null)}
//                   style={styles.closeButton}
//                 >
//                   <Text style={styles.closeButtonText}>✕</Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView
//                 style={styles.issueDetails}
//                 showsVerticalScrollIndicator={false}
//               >
//                 <Text style={styles.issueDescription}>
//                   {selectedIssue.description}
//                 </Text>

//                 <View style={styles.issueMetadata}>
//                   <View style={styles.metadataRow}>
//                     <Text style={styles.metadataLabel}>Severity:</Text>
//                     <View
//                       style={[
//                         styles.severityBadge,
//                         {
//                           backgroundColor: getSeverityColor(
//                             selectedIssue.severity
//                           ),
//                         },
//                       ]}
//                     >
//                       <Text style={styles.severityBadgeText}>
//                         {selectedIssue.severity.toUpperCase()}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={styles.metadataRow}>
//                     <Text style={styles.metadataLabel}>Status:</Text>
//                     <View
//                       style={[
//                         styles.statusBadge,
//                         {
//                           backgroundColor: getStatusColor(selectedIssue.status),
//                         },
//                       ]}
//                     >
//                       <Text style={styles.statusBadgeText}>
//                         {selectedIssue.status.toUpperCase()}
//                       </Text>
//                     </View>
//                   </View>

//                   <View style={styles.metadataRow}>
//                     <Text style={styles.metadataLabel}>Reported:</Text>
//                     <Text style={styles.metadataValue}>
//                       {selectedIssue.reportedAt}
//                     </Text>
//                   </View>
//                 </View>
//               </ScrollView>
//             </>
//           )}
//         </View>
//       </View>
//     </Modal>
//   )

//   if (Platform.OS === "web") {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Map is not supported on the web platform.</Text>
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle} className="font-geist">
//           Incident Map
//         </Text>
//         <View style={styles.headerActions}>
//           <TouchableOpacity
//             style={[
//               styles.headerButton,
//               showHeatmap && styles.headerButtonActive,
//             ]}
//             onPress={() => setShowHeatmap(!showHeatmap)}
//           >
//             <Text style={styles.headerButtonText}>
//               <FireExtinguisher
//                 size={20}
//                 color={showHeatmap ? colors.surface : colors.primary}
//               />
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.headerButton}
//             onPress={() => setShowFilters(true)}
//           >
//             <Text style={styles.headerButtonText}>
//               <Settings size={20} />
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.headerButton}
//             onPress={getCurrentLocation}
//           >
//             <Text style={styles.headerButtonText}>
//               <MapPin size={20} />
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Map */}
//       <MapView
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         initialRegion={
//           userLocation || {
//             latitude: 37.78825,
//             longitude: -122.4324,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }
//         }
//         region={userLocation}
//         showsUserLocation={locationPermission}
//         showsMyLocationButton={false}
//         showsCompass={true}
//         showsScale={true}
//       >
//         {/* Issue Markers */}
//         {filteredIssues.map((issue) => (
//           <Marker
//             key={issue.id}
//             coordinate={{
//               latitude: issue.latitude,
//               longitude: issue.longitude,
//             }}
//             onPress={() => setSelectedIssue(issue)}
//           >
//             <View
//               style={[
//                 styles.customMarker,
//                 { backgroundColor: getMarkerColor(issue) },
//               ]}
//             >
//               <Text style={styles.markerIcon}>
//                 {issueTypes[issue.type]?.icon}
//               </Text>
//             </View>
//           </Marker>
//         ))}

//         {/* Heatmap */}
//         {showHeatmap && heatmapData.length > 0 && (
//           <Heatmap
//             points={heatmapData}
//             radius={50}
//             opacity={0.6}
//             gradient={{
//               colors: ["#00ff00", "#ffff00", "#ff0000"],
//               startPoints: [0.2, 0.5, 1.0],
//               colorMapSize: 256,
//             }}
//           />
//         )}
//       </MapView>

//       {/* Stats Bar */}
//       <View style={styles.statsBar}>
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber} className="font-geist">
//             {filteredIssues.length}
//           </Text>
//           <Text style={styles.statLabel} className="font-geist">
//             Total Issues
//           </Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text
//             style={[styles.statNumber, { color: colors.danger }]}
//             className="font-geist"
//           >
//             {filteredIssues.filter((i) => i.status === "pending").length}
//           </Text>
//           <Text style={styles.statLabel} className="font-geist">
//             Pending
//           </Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text
//             style={[styles.statNumber, { color: colors.warning }]}
//             className="font-geist"
//           >
//             {filteredIssues.filter((i) => i.status === "acknowledged").length}
//           </Text>
//           <Text style={styles.statLabel} className="font-geist">
//             In Progress
//           </Text>
//         </View>
//         <View style={styles.statItem}>
//           <Text
//             style={[styles.statNumber, { color: colors.success }]}
//             className="font-geist"
//           >
//             {filteredIssues.filter((i) => i.status === "resolved").length}
//           </Text>
//           <Text style={styles.statLabel} className="font-geist">
//             Resolved
//           </Text>
//         </View>
//       </View>

//       <FilterModal />
//       <IssueDetailModal />
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: colors.surface,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     color: colors.text,
//   },
//   headerActions: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   headerButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: colors.background,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: colors.border,
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   headerButtonActive: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   headerButtonText: {
//     fontSize: 18,
//   },
//   map: {
//     flex: 1,
//   },
//   customMarker: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: "white",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   markerIcon: {
//     fontSize: 16,
//   },
//   statsBar: {
//     flexDirection: "row",
//     backgroundColor: colors.surface,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: colors.primary,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     marginTop: 4,
//     textAlign: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "flex-end",
//   },
//   filterModal: {
//     backgroundColor: colors.surface,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.8,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//   },
//   detailModal: {
//     backgroundColor: colors.surface,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: height * 0.6,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 8,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   modalTitle: {
//     fontSize: 20,
//     color: colors.text,
//   },
//   closeButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: colors.background,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   closeButtonText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//   },
//   filterContent: {
//     padding: 20,
//   },
//   filterSection: {
//     marginBottom: 24,
//   },
//   filterSectionTitle: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: colors.text,
//     marginBottom: 12,
//   },
//   filterGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   filterRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   filterChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: colors.background,
//     borderWidth: 1,
//     borderColor: colors.border,
//     minWidth: width * 0.4,
//   },
//   filterChipActive: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   filterChipIcon: {
//     fontSize: 16,
//     marginRight: 6,
//   },
//   filterChipText: {
//     fontSize: 12,
//     color: colors.text,
//     flex: 1,
//   },
//   filterChipTextActive: {
//     color: "white",
//   },
//   severityChip: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     borderWidth: 1,
//     minWidth: 80,
//     alignItems: "center",
//   },
//   severityChipText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   statusChip: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     borderWidth: 1,
//     minWidth: 80,
//     alignItems: "center",
//   },
//   statusChipText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   issueHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   issueIcon: {
//     fontSize: 32,
//     marginRight: 12,
//   },
//   issueTitleContainer: {
//     flex: 1,
//   },
//   issueTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: colors.text,
//   },
//   issueType: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 2,
//   },
//   issueDetails: {
//     padding: 20,
//   },
//   issueDescription: {
//     fontSize: 16,
//     color: colors.text,
//     lineHeight: 24,
//     marginBottom: 20,
//   },
//   issueMetadata: {
//     gap: 12,
//   },
//   metadataRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   metadataLabel: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     fontWeight: "500",
//   },
//   metadataValue: {
//     fontSize: 14,
//     color: colors.text,
//   },
//   severityBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   severityBadgeText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "white",
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   statusBadgeText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "white",
//   },
// })

// export default Map

import { Text, View } from "react-native"

export default function Map() {
  return (
    <View>
      <Text> Map </Text>
    </View>
  )
}
