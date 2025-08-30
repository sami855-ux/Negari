import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  Video,
  Trash2,
  X,
  ChevronDown,
  Plus,
} from "lucide-react-native"
import { Swipeable } from "react-native-gesture-handler"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

const statusIcons = {
  Pending: AlertCircle,
  Approved: CheckCircle,
  Resolved: CheckCircle,
  Rejected: XCircle,
}

const statusColors = {
  Pending: "bg-amber-400 text-amber-800",
  Approved: "bg-blue-400 text-blue-800",
  Resolved: "bg-emerald-400 text-emerald-800",
  Rejected: "bg-rose-400 text-rose-800",
}

const statusTextColors = {
  Pending: "text-amber-800",
  Approved: "text-blue-800",
  Resolved: "text-emerald-800",
  Rejected: "text-rose-800",
}

const mockReports = [
  {
    id: "1",
    title: "Pothole on Main Street",
    category: "Road Damage",
    status: "Pending",
    date: "2023-05-15",
    type: "image",
    description: "Large pothole causing traffic issues",
    location: "Main Street, Downtown",
    assignedOfficer: "Officer Smith",
  },
  {
    id: "2",
    title: "Broken Traffic Light",
    category: "Traffic",
    status: "Approved",
    date: "2023-05-10",
    type: "video",
    description: "Traffic light not working properly",
    location: "5th Avenue",
    assignedOfficer: "Officer Johnson",
  },
  {
    id: "3",
    title: "Garbage Accumulation",
    category: "Sanitation",
    status: "Resolved",
    date: "2023-05-01",
    type: "image",
    description: "Garbage not collected for 2 weeks",
    location: "Park Lane",
    assignedOfficer: "Officer Williams",
  },
  {
    id: "4",
    title: "Illegal Parking",
    category: "Traffic",
    status: "Rejected",
    date: "2023-04-28",
    type: "video",
    description: "Cars parked in no-parking zone",
    location: "Market Square",
  },
]

const ActivityScreen = () => {
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState("newest")
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedReports, setSelectedReports] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setReports(mockReports)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let result = [...reports]

    if (searchQuery) {
      result = result.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "All") {
      result = result.filter((report) => report.status === statusFilter)
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredReports(result)
  }, [reports, searchQuery, statusFilter, sortOrder])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const handleReportPress = (reportId) => {
    if (isSelectionMode) {
      toggleReportSelection(reportId)
    } else {
      router.push(`/activity/${reportId}`)
    }
  }

  const handleLongPress = (reportId) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true)
      setSelectedReports([reportId])
    }
  }

  const toggleReportSelection = (reportId) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    )
  }

  const exitSelectionMode = () => {
    setIsSelectionMode(false)
    setSelectedReports([])
  }

  const deleteSelectedReports = () => {
    Alert.alert(
      "Delete Reports",
      `Are you sure you want to delete ${selectedReports.length} report(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setReports((prev) =>
              prev.filter((report) => !selectedReports.includes(report.id))
            )
            exitSelectionMode()
          },
        },
      ]
    )
  }

  const renderRightActions = (progress, dragX, reportId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    })

    return (
      <View className="flex-row items-center justify-end my-2 bg-red-500 rounded-lg">
        <Animated.View style={{ transform: [{ scale }] }}>
          <TouchableOpacity
            className="justify-center h-full px-4"
            onPress={() => {
              Alert.alert(
                "Delete Report",
                "Are you sure you want to delete this report?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      setReports((prev) =>
                        prev.filter((report) => report.id !== reportId)
                      )
                    },
                  },
                ]
              )
            }}
          >
            <Trash2 size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }

  const renderReportItem = ({ item }) => {
    const StatusIcon = statusIcons[item.status]
    const TypeIcon = item.type === "image" ? ImageIcon : Video
    const isSelected = selectedReports.includes(item.id)

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          !isSelectionMode && renderRightActions(progress, dragX, item.id)
        }
        enabled={!isSelectionMode}
      >
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          className={`my-2 p-4 bg-white rounded-xl  border border-gray-100 ${
            isSelected ? "border-2 border-purple-600" : ""
          }`}
        >
          <TouchableOpacity
            onPress={() => handleReportPress(item.id)}
            onLongPress={() => handleLongPress(item.id)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <TypeIcon size={16} className="mr-2 text-gray-500" />
                  <Text className="text-base font-medium text-gray-800 font-geist">
                    {item.title}
                  </Text>
                </View>
                <Text className="mt-1 text-sm text-gray-500 font-jakarta">
                  {item.category}
                </Text>
              </View>

              <View
                className={`px-3 py-1 rounded-full ${
                  statusColors[item.status]
                } flex-row items-center`}
              >
                <StatusIcon size={14} color="white" className="mr-1" />
                <Text className={`text-xs text-white font-geist `}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center">
                <Clock size={14} className="mr-1 text-gray-400" />
                <Text className="text-[13px] text-gray-500 font-geist">
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>

              {item.status === "Pending" && (
                <View className="w-24">
                  <LinearGradient
                    colors={["#7C3AED", "#A78BFA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="h-1.5 rounded-full"
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Swipeable>
    )
  }

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="items-center justify-center flex-1 p-8"
    >
      <View className="items-center">
        <ImageIcon size={48} className="mb-4 text-gray-300" />
        <Text className="mb-2 text-xl font-semibold text-gray-500 font-geist">
          No Reports Found
        </Text>
        <Text className="mb-6 text-center text-gray-400 font-jakarta">
          {statusFilter === "All"
            ? "You haven't submitted any reports yet."
            : `No ${statusFilter.toLowerCase()} reports found.`}
        </Text>
        <TouchableOpacity
          className="flex-row items-center px-6 py-3 bg-purple-600 rounded-full"
          onPress={() => router.push("/(tabs)")}
        >
          <Plus size={18} color="white" className="mr-2" />
          <Text className="text-white font-geist">Submit New Report</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )

  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterOpen}
      onRequestClose={() => setIsFilterOpen(false)}
    >
      <View className="justify-end flex-1 bg-black/50">
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="p-6 bg-white rounded-t-3xl"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-800">Filters</Text>
            <TouchableOpacity onPress={() => setIsFilterOpen(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text className="mb-3 text-lg font-semibold text-gray-800">
            Status
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {["All", "Pending", "Approved", "Resolved", "Rejected"].map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    statusFilter === status ? "bg-purple-100" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      statusFilter === status
                        ? "text-purple-600"
                        : "text-gray-800"
                    }`}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <Text className="mb-3 text-lg font-semibold text-gray-800">
            Sort By
          </Text>
          <View className="flex-row mb-6">
            <TouchableOpacity
              onPress={() => setSortOrder("newest")}
              className={`px-4 py-2 rounded-l-lg ${
                sortOrder === "newest" ? "bg-purple-600" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  sortOrder === "newest" ? "text-white" : "text-gray-800"
                }`}
              >
                Newest First
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortOrder("oldest")}
              className={`px-4 py-2 rounded-r-lg ${
                sortOrder === "oldest" ? "bg-purple-600" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-medium ${
                  sortOrder === "oldest" ? "text-white" : "text-gray-800"
                }`}
              >
                Oldest First
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center py-3 bg-purple-600 rounded-lg"
            onPress={() => setIsFilterOpen(false)}
          >
            <Text className="font-semibold text-white">Apply Filters</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "My Reports",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              {isSelectionMode ? (
                <>
                  <TouchableOpacity
                    onPress={deleteSelectedReports}
                    style={{ marginRight: 16 }}
                  >
                    <Trash2 size={24} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={exitSelectionMode}>
                    <X size={24} color="#6b7280" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsFilterOpen(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#f3e8ff",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}
                >
                  <Filter
                    size={18}
                    color="#7C3AED"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      color: "#7C3AED",
                      fontWeight: "500",
                      fontSize: 14,
                    }}
                  >
                    Filter
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />

      <View className="p-4 bg-white border-b border-gray-100">
        <View className="relative">
          <View className="absolute z-10 left-3 top-3">
            <Search size={18} color="#9ca3af" />
          </View>
          <TextInput
            className="py-3 pl-10 pr-4 text-gray-800 bg-gray-100 rounded-md font-geist"
            placeholder="Search reports..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : filteredReports.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredReports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#7C3AED"]}
              tintColor="#7C3AED"
            />
          }
          ListFooterComponent={
            <View className="items-center py-4">
              <Text className="text-gray-400 font-geist">
                {filteredReports.length} reports shown
              </Text>
            </View>
          }
        />
      )}

      <FilterModal />
    </View>
  )
}

export default ActivityScreen
