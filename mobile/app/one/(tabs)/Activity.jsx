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
  Animated,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  X,
  Plus,
  SlidersHorizontal,
  Calendar,
} from "lucide-react-native"
import { Swipeable } from "react-native-gesture-handler"
import { LinearGradient } from "expo-linear-gradient"
import { getUserReports } from "../../../services/report"
import { storage } from "../../../store/slices/auth"

const statusIcons = {
  PENDING: AlertCircle,
  VERIFIED: CheckCircle,
  RESOLVED: CheckCircle,
  REJECTED: XCircle,
  NEEDS_MORE_INFO: AlertCircle,
  IN_PROGRESS: Clock,
}

const statusColors = {
  PENDING: { bg: "bg-amber-200", text: "text-amber-800" },
  VERIFIED: { bg: "bg-blue-200", text: "text-blue-800" },
  RESOLVED: { bg: "bg-emerald-200", text: "text-emerald-800" },
  REJECTED: { bg: "bg-rose-200", text: "text-rose-800" },
  NEEDS_MORE_INFO: { bg: "bg-gray-200", text: "text-gray-800" },
  IN_PROGRESS: { bg: "bg-green-200", text: "text-green-800" },
}

const ActivityScreen = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState("newest")
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState(null)

  // Temporary filter states
  const [tempStatusFilter, setTempStatusFilter] = useState("All")
  const [tempCategoryFilter, setTempCategoryFilter] = useState("All")
  const [tempSortOrder, setTempSortOrder] = useState("newest")

  const handleFetchReports = async () => {
    try {
      if (!user?.id) return

      const res = await getUserReports(user.id)
      if (res.success) {
        setReports(res.data || [])
        setFilteredReports(res.data || [])
      }
    } catch (error) {
      console.log("Error fetching reports:", error)
      setReports([])
      setFilteredReports([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await storage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (user?.id) {
      handleFetchReports()
    }
  }, [user?.id])

  useEffect(() => {
    filterReports()
  }, [reports, searchQuery, statusFilter, categoryFilter, sortOrder])

  const filterReports = () => {
    // Ensure reports is always an array
    let result = Array.isArray(reports) ? [...reports] : []

    if (searchQuery) {
      result = result.filter(
        (report) =>
          report?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report?.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "All") {
      result = result.filter((report) => report?.status === statusFilter)
    }

    if (categoryFilter !== "All") {
      result = result.filter((report) => report?.category === categoryFilter)
    }

    result.sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0).getTime()
      const dateB = new Date(b?.createdAt || 0).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredReports(result)
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    handleFetchReports().finally(() => {
      setRefreshing(false)
    })
  }, [user?.id])

  const handleReportPress = (reportId) => {
    router.push({
      pathname: "/one/report",
      params: {
        reportId: reportId,
      },
    })
  }

  const handleDeletePress = (reportId) => {
    setReportToDelete(reportId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (reportToDelete) {
      setReports((prev) =>
        prev.filter((report) => report.id !== reportToDelete)
      )
      setReportToDelete(null)
    }
    setIsDeleteModalOpen(false)
  }

  const resetFilters = () => {
    setTempStatusFilter("All")
    setTempCategoryFilter("All")
    setTempSortOrder("newest")
  }

  const applyFilters = () => {
    setStatusFilter(tempStatusFilter)
    setCategoryFilter(tempCategoryFilter)
    setSortOrder(tempSortOrder)
    setIsFilterOpen(false)
  }

  const openFilterModal = () => {
    setTempStatusFilter(statusFilter)
    setTempCategoryFilter(categoryFilter)
    setTempSortOrder(sortOrder)
    setIsFilterOpen(true)
  }

  const getCategoryOptions = () => {
    if (!Array.isArray(reports)) return ["All"]
    const categories = [
      ...new Set(reports.map((report) => report?.category).filter(Boolean)),
    ]
    return ["All", ...categories]
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
            onPress={() => handleDeletePress(reportId)}
          >
            <Trash2 size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
  const renderReportItem = ({ item }) => {
    const StatusIcon = statusIcons[item?.status] || AlertCircle

    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item.id)
        }
      >
        <View className="p-4 my-2 bg-white border border-gray-100 rounded-lg">
          <TouchableOpacity
            onPress={() => handleReportPress(item.id)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-lg font-medium text-gray-800 font-jakarta">
                    {item?.title}
                  </Text>
                </View>
                <Text className="text-base mt-2 font-jakarta font-medium text-gray-600 ">
                  {item?.description?.length > 50
                    ? item.description.substring(0, 50) + "..."
                    : item.description}
                </Text>
                <Text className="mt-1 text-base text-blue-500 font-geist">
                  {`${item?.category}`.charAt(0).toUpperCase() +
                    item?.category.slice(1).toLowerCase()}
                </Text>
              </View>

              <View
                className={`px-3 py-1 rounded-full flex-row items-center ${
                  statusColors[item.status]?.bg || "bg-gray-400"
                }`}
              >
                <StatusIcon size={14} color="black" className="mr-1" />
                <Text
                  className={`text-sm font-jakarta ml-2 ${
                    statusColors[item.status]?.text || "text-white"
                  }`}
                >
                  {`${item.status}`.charAt(0).toUpperCase() +
                    item.status.slice(1).toLowerCase().replace("_", " ")}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center">
                <Clock size={14} className="mr-1 text-gray-400" />
                <Text className="text-[13px] text-gray-500 font-jakarta ml-2">
                  {timeAgo(item?.createdAt)}
                </Text>
              </View>

              {item?.status === "PENDING" ||
                (item?.status === "IN_PROGRESS" && (
                  <View className="w-24">
                    <LinearGradient
                      colors={["#7C3AED", "#A78BFA"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="h-1.5 rounded-full"
                    />
                  </View>
                ))}
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    )
  }

  const renderEmptyState = () => (
    <View className="items-center justify-center flex-1 p-8">
      <View className="items-center">
        <ImageIcon size={48} className="mb-4 text-gray-300" />
        <Text className="mb-2 text-xl font-semibold text-gray-500 font-geist">
          No Reports Found
        </Text>
        <Text className="mb-6 text-center text-gray-400 font-geist">
          {statusFilter === "All" && categoryFilter === "All"
            ? "You haven't submitted any reports yet."
            : `No reports found with the current filters.`}
        </Text>
        <TouchableOpacity
          className="flex-row items-center px-6 py-3 bg-purple-600 rounded-full"
          onPress={() => router.push("/(tabs)")}
        >
          <Plus size={18} color="white" className="mr-2" />
          <Text className="text-white">Submit New Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const FilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterOpen}
        onRequestClose={() => setIsFilterOpen(false)}
      >
        <View className="justify-end flex-1 bg-black/50">
          <View className="p-6 bg-white rounded-t-3xl">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-800 font-geist">
                Filters
              </Text>
              <TouchableOpacity
                onPress={() => setIsFilterOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="mb-3 text-base font-semibold text-gray-800 font-geist">
                Status
              </Text>
              <View className="flex-row flex-wrap">
                {["All", "PENDING", "VERIFIED", "RESOLVED", "REJECTED"].map(
                  (status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setTempStatusFilter(status)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        tempStatusFilter === status
                          ? "bg-purple-600"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`font-sm font-geist ${
                          tempStatusFilter === status
                            ? "text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {`${status[0].toUpperCase()}${status.slice(1).toLowerCase()}`}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-3 text-lg font-semibold text-gray-800 font-geist">
                Category
              </Text>
              <View className="flex-row flex-wrap">
                {getCategoryOptions().map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setTempCategoryFilter(category)}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      tempCategoryFilter === category
                        ? "bg-purple-600"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-sm font-geist ${
                        tempCategoryFilter === category
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {`${category[0].toUpperCase()}${category.slice(1).toLowerCase()}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-3 text-lg font-semibold text-gray-800 font-geist">
                Sort By
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setTempSortOrder("newest")}
                  className={`flex-1 px-4 py-3 rounded-l-lg flex-row items-center justify-center ${
                    tempSortOrder === "newest" ? "bg-purple-600" : "bg-gray-100"
                  }`}
                >
                  <Calendar
                    size={16}
                    color={tempSortOrder === "newest" ? "white" : "#6b7280"}
                    className="mr-2"
                  />
                  <Text
                    className={`font-sm font-geist ${
                      tempSortOrder === "newest"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Newest
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setTempSortOrder("oldest")}
                  className={`flex-1 px-4 py-3 rounded-r-lg flex-row items-center justify-center ${
                    tempSortOrder === "oldest" ? "bg-purple-600" : "bg-gray-100"
                  }`}
                >
                  <Calendar
                    size={16}
                    color={tempSortOrder === "oldest" ? "white" : "#6b7280"}
                    className="mr-2"
                  />
                  <Text
                    className={`font-sm font-geist ${
                      tempSortOrder === "oldest"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Oldest
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="items-center flex-1 py-3 bg-gray-200 rounded-lg"
                onPress={resetFilters}
              >
                <Text className="font-semibold text-gray-800 font-geist">
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="items-center flex-1 py-3 bg-purple-600 rounded-lg"
                onPress={applyFilters}
              >
                <Text className="font-semibold text-white font-geist">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  const DeleteConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isDeleteModalOpen}
      onRequestClose={() => setIsDeleteModalOpen(false)}
    >
      <View className="items-center justify-center flex-1 p-5 bg-black/50">
        <View className="w-full max-w-md p-6 bg-white rounded-2xl">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800 font-geist">
              Delete Report
            </Text>
            <TouchableOpacity onPress={() => setIsDeleteModalOpen(false)}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-start mb-6">
            <View className="p-2 mr-3 bg-red-100 rounded-full">
              <Trash2 size={24} color="#ef4444" />
            </View>
            <Text className="flex-1 text-base text-gray-600 font-jakarta">
              Are you sure you want to delete this report? This action cannot be
              undone.
            </Text>
          </View>

          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity
              onPress={() => setIsDeleteModalOpen(false)}
              className="px-5 py-3 bg-gray-100 rounded-xl"
            >
              <Text className="font-medium text-gray-800 font-geist">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmDelete}
              className="px-5 py-3 bg-red-500 rounded-xl"
            >
              <Text className="font-medium text-white font-geist">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "My Reports" }} />

      {/* Search and Filter Bar */}
      <View className="p-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="relative flex-1">
            <View className="absolute z-10 left-3 top-3">
              <Search size={18} color="#9ca3af" />
            </View>
            <TextInput
              className="py-3 pl-10 pr-4 text-gray-800 bg-gray-100 rounded-lg font-jakarta"
              placeholder="Search reports..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity
            onPress={openFilterModal}
            className="p-3 ml-3 bg-purple-100 rounded-lg"
          >
            <SlidersHorizontal size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Active Filters Indicator */}
        {(statusFilter !== "All" || categoryFilter !== "All") && (
          <View className="flex-row items-center mt-3">
            <Text className="mr-2 text-sm text-gray-500">Active filters:</Text>
            {statusFilter !== "All" && (
              <View className="px-2 py-1 mr-2 bg-purple-100 rounded-full">
                <Text className="text-xs text-purple-700">
                  Status: {statusFilter}
                </Text>
              </View>
            )}
            {categoryFilter !== "All" && (
              <View className="px-2 py-1 bg-purple-100 rounded-full">
                <Text className="text-xs text-purple-700">
                  Category: {categoryFilter}
                </Text>
              </View>
            )}
          </View>
        )}
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
      <DeleteConfirmationModal />
    </View>
  )
}

export function timeAgo(timestamp) {
  const now = new Date()
  const past = new Date(timestamp)
  const diff = Math.floor((now - past) / 1000) // difference in seconds

  if (diff < 60) {
    return `${diff} second${diff !== 1 ? "s" : ""} ago`
  }

  const minutes = Math.floor(diff / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  }

  const days = Math.floor(hours / 24)
  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`
  }

  const weeks = Math.floor(days / 7)
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`
  }

  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`
  }

  const years = Math.floor(days / 365)
  return `${years} year${years !== 1 ? "s" : ""} ago`
}

export default ActivityScreen
