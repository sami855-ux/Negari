import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
} from "react-native"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import {
  CheckCircle,
  XCircle,
  Circle,
  Clock,
  Calendar,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowLeft,
} from "lucide-react-native"
import { getUserDetails } from "../../services/user"

// Format date function
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format time since last seen
const formatLastSeen = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHrs / 24)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHrs < 24) return `${diffHrs} hr ago`
  return `${diffDays} days ago`
}

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <View className="flex-1 p-4 bg-gray-50">
      {/* Profile Skeleton */}
      <View className="items-center mb-6">
        <View className="w-24 h-24 mb-3 overflow-hidden bg-gray-200 rounded-full">
          <View
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ transform: [{ skewX: "-20deg" }] }}
          />
        </View>
        <View className="w-40 h-6 mb-2 overflow-hidden bg-gray-200 rounded-md">
          <View
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ transform: [{ skewX: "-20deg" }] }}
          />
        </View>
        <View className="w-56 h-4 mb-4 overflow-hidden bg-gray-200 rounded-md">
          <View
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ transform: [{ skewX: "-20deg" }] }}
          />
        </View>
        <View className="flex-row gap-2">
          <View className="w-20 h-6 overflow-hidden bg-gray-200 rounded-full">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
          <View className="w-24 h-6 overflow-hidden bg-gray-200 rounded-full">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
        </View>
      </View>

      {/* Stats Skeleton */}
      <View className="p-4 mb-6 bg-white shadow-sm rounded-xl">
        <View className="w-32 h-5 mb-4 overflow-hidden bg-gray-200 rounded-md">
          <View
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ transform: [{ skewX: "-20deg" }] }}
          />
        </View>
        <View className="flex-row justify-between mb-3">
          <View className="w-16 h-4 overflow-hidden bg-gray-200 rounded-md">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
          <View className="w-16 h-4 overflow-hidden bg-gray-200 rounded-md">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
          <View className="w-16 h-4 overflow-hidden bg-gray-200 rounded-md">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
        </View>
        <View className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
          <View
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ transform: [{ skewX: "-20deg" }] }}
          />
        </View>
      </View>

      {/* Details Skeleton */}
      <View className="p-4 mb-6 bg-white shadow-sm rounded-xl">
        <View className="w-40 h-5 mb-4 overflow-hidden bg-gray-200 rounded-md">
          <View
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ transform: [{ skewX: "-20deg" }] }}
          />
        </View>
        <View className="flex-row justify-between mb-3">
          <View className="w-24 h-4 overflow-hidden bg-gray-200 rounded-md">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
          <View className="w-32 h-4 overflow-hidden bg-gray-200 rounded-md">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="w-24 h-4 overflow-hidden bg-gray-200 rounded-md">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
          <View className="w-32 h-4 overflow-hidden bg-gray-200 rounded-md">
            <View
              className="absolute inset-0 bg-gray-300 animate-pulse"
              style={{ transform: [{ skewX: "-20deg" }] }}
            />
          </View>
        </View>
      </View>

      {/* Reports Skeleton */}
      <View className="p-4 bg-white shadow-sm rounded-xl">
        <View className="w-40 h-5 mb-4 overflow-hidden bg-gray-200 rounded-md">
          <View
            className="absolute inset-0 bg-gray-300 animate-pulse"
            style={{ transform: [{ skewX: "-20deg" }] }}
          />
        </View>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="p-3 mb-3 border border-gray-100 rounded-lg"
          >
            <View className="w-48 h-5 mb-2 overflow-hidden bg-gray-200 rounded-md">
              <View
                className="absolute inset-0 bg-gray-300 animate-pulse"
                style={{ transform: [{ skewX: "-20deg" }] }}
              />
            </View>
            <View className="w-32 h-4 overflow-hidden bg-gray-200 rounded-md">
              <View
                className="absolute inset-0 bg-gray-300 animate-pulse"
                style={{ transform: [{ skewX: "-20deg" }] }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { color: "bg-amber-100 text-amber-800", icon: Clock },
    IN_PROGRESS: { color: "bg-blue-100 text-blue-800", icon: AlertCircle },
    RESOLVED: { color: "bg-green-100 text-green-800", icon: CheckSquare },
    default: { color: "bg-gray-100 text-gray-800", icon: Square },
  }

  const config = statusConfig[status] || statusConfig.default
  const IconComponent = config.icon

  return (
    <View
      className={`flex-row items-center px-2 py-1 rounded-full ${config.color}`}
    >
      <IconComponent size={14} />
      <Text
        className={`text-xs ml-1 font-medium capitalize font-geist text-gray-800`}
      >
        {status.toLowerCase().replace("_", " ")}
      </Text>
    </View>
  )
}

// User Detail Page Component
const UserDetailPage = () => {
  const router = useRouter()
  const { userId } = useLocalSearchParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadUserData = async () => {
    try {
      const data = await getUserDetails(userId)
      setUserData(data.user)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [userId])

  const onRefresh = () => {
    setRefreshing(true)
    loadUserData()
  }

  if (loading) {
    return <SkeletonLoader />
  }

  if (!userData) {
    return (
      <View className="items-center justify-center flex-1 p-4 bg-gray-50">
        <Text className="text-lg text-gray-800 font-geist">
          Failed to load user data
        </Text>
        <TouchableOpacity
          className="px-4 py-2 mt-4 bg-blue-500 rounded-lg"
          onPress={loadUserData}
        >
          <Text className="text-white font-jakarta">Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Calculate report statistics
  const reportStats = userData.reportsAssignedToWorker.reduce(
    (acc, report) => {
      acc.total++
      acc[report.status] = (acc[report.status] || 0) + 1
      return acc
    },
    { total: 0 }
  )

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-row items-center p-4 bg-orange-500">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-3 bg-gray-800 rounded-full"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text className="text-lg text-white font-geist">User Profile</Text>
        </View>
        <View className="p-4 px-0 pt-0">
          {/* Profile Header */}
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3",
            }}
            className="mb-6 overflow-hidden h-72"
            resizeMode="cover"
          >
            {/* Overlay for better text readability */}
            <View className="items-center w-full h-full p-6 bg-black/30">
              <Image
                source={{
                  uri:
                    userData?.profilePicture ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3",
                }}
                className="w-24 h-24 mb-4 border-4 border-white rounded-full shadow-lg"
              />

              <View className="flex-row items-center mb-1">
                <Text className="mr-2 text-2xl text-white font-geist-bold font-geist">
                  {userData.username}
                </Text>
                {userData.isVerified ? (
                  <CheckCircle size={20} color="#10B981" fill="white" />
                ) : (
                  <XCircle size={20} color="#EF4444" />
                )}
              </View>

              <Text className="mb-4 text-gray-200 font-jakarta">
                {userData.email}
              </Text>

              <View className="flex-row gap-2">
                {/* Online / Offline Badge */}
                <View
                  className={`flex-row items-center px-3 py-1 rounded-full ${
                    userData.isOnline ? "bg-green-500/30" : "bg-gray-500/30"
                  }`}
                >
                  <View
                    className={`w-2 h-2 rounded-full mr-1 ${
                      userData.isOnline ? "bg-green-300" : "bg-gray-300"
                    }`}
                  />
                  <Text
                    className={`text-xs font-medium font-geist ${
                      userData.isOnline ? "text-green-100" : "text-gray-100"
                    }`}
                  >
                    {userData.isOnline ? "Online" : "Offline"}
                  </Text>
                </View>

                {/* Role Badge */}
                <View className="px-3 py-1 rounded-full bg-blue-500/30">
                  <Text className="text-xs font-medium text-blue-100 capitalize font-geist">
                    {userData.role?.toLowerCase() || "Worker"}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>

          {/* Stats Card */}
          <View className="p-4 mb-6 bg-gray-100 rounded-xl">
            <Text className="mb-4 text-lg text-gray-900 font-geist-semibold font-geist">
              Report Statistics
            </Text>
            <View className="flex-row justify-between mb-3">
              <View className="items-center">
                <Text className="text-2xl text-gray-900 font-geist-bold font-geist">
                  {reportStats.total || 0}
                </Text>
                <Text className="text-xs text-gray-500 font-geist">Total</Text>
              </View>

              <View className="items-center">
                <Text className="text-2xl text-blue-600 font-geist-bold font-geist">
                  {reportStats.IN_PROGRESS || 0}
                </Text>
                <Text className="text-xs text-gray-500 font-geist">
                  In Progress
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl text-green-600 font-geist">
                  {reportStats.RESOLVED || 0}
                </Text>
                <Text className="text-xs text-gray-500 font-geist">
                  Resolved
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-geist-bold text-amber-600 font-geist">
                  {reportStats.REJECTED || 0}
                </Text>
                <Text className="text-xs text-gray-500 font-geist">
                  Rejected
                </Text>
              </View>
            </View>
            {reportStats.total > 0 && (
              <View className="w-full h-2 mt-2 overflow-hidden bg-gray-200 rounded-full">
                <View
                  className="h-full bg-green-500"
                  style={{
                    width: `${((reportStats.RESOLVED || 0) / reportStats.total) * 100}%`,
                  }}
                />
                <View
                  className="absolute top-0 h-full bg-blue-500"
                  style={{
                    left: `${((reportStats.RESOLVED || 0) / reportStats.total) * 100}%`,
                    width: `${((reportStats.IN_PROGRESS || 0) / reportStats.total) * 100}%`,
                  }}
                />
                <View
                  className="absolute top-0 h-full bg-amber-500"
                  style={{
                    left: `${(((reportStats.RESOLVED || 0) + (reportStats.IN_PROGRESS || 0)) / reportStats.total) * 100}%`,
                    width: `${((reportStats.PENDING || 0) / reportStats.total) * 100}%`,
                  }}
                />
              </View>
            )}
          </View>

          {/* Account Details */}
          <View className="p-4 mb-6 bg-gray-100 rounded-xl">
            <Text className="mb-4 text-lg text-gray-900 font-geist-semibold font-geist">
              Account Details
            </Text>
            <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-600 font-geist">Member since</Text>
              <View className="flex-row items-center">
                <Calendar size={16} color="#6B7280" className="mr-1" />
                <Text className="text-gray-900 font-geist">
                  {formatDate(userData.createdAt)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-gray-600 font-geist">Last active</Text>
              <View className="flex-row items-center">
                <Clock size={16} color="#6B7280" className="mr-1" />
                <Text className="text-gray-900 font-geist">
                  {userData.isOnline
                    ? "Now"
                    : formatLastSeen(userData.lastSeen)}
                </Text>
              </View>
            </View>
          </View>

          {/* Assigned Reports */}
          <View className="p-4 bg-gray-50 rounded-xl">
            <Text className="mb-4 text-lg text-gray-900 font-geist">
              Assigned Reports ({userData.reportsAssignedToWorker.length})
            </Text>
            {userData.reportsAssignedToWorker.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-gray-500 font-geist">
                  No reports assigned
                </Text>
              </View>
            ) : (
              userData.reportsAssignedToWorker.map((report) => (
                <View
                  key={report.id}
                  className="p-3 mb-3 bg-gray-100 border border-gray-200 rounded-lg"
                >
                  <View className="flex-row items-start justify-between mb-1">
                    <Text className="flex-1 mr-2 text-base text-gray-900 font-geist">
                      {report.title}
                    </Text>
                    <StatusBadge status={report.status} />
                  </View>
                  <Text
                    className="mb-2 text-xs text-gray-600 font-jakarta"
                    numberOfLines={2}
                  >
                    {report.description}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500 font-jakarta">
                      {formatDate(report.createdAt)}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded-full ${
                        report.severity === "HIGH"
                          ? "bg-red-100 text-red-800"
                          : report.severity === "MEDIUM"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <Text className="text-xs font-medium text-gray-700 capitalize font-geist">
                        {report.severity.toLowerCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default UserDetailPage
