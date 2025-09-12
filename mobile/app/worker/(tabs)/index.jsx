import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import {
  AlertCircle,
  Bell,
  Calendar,
  CalendarCheck,
  ClipboardEdit,
  FileText,
  Gauge,
  MapPin,
  NotepadText,
  RefreshCw,
} from "lucide-react-native"
import Swipeable from "react-native-gesture-handler/Swipeable"
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  getAllAssignedWorkerReports,
  getAssignedReport,
  getAssignedReportInprogress,
  makeReportInprogress,
} from "../../../services/report"

const severityColors = {
  low: "bg-amber-400",
  medium: "bg-amber-600",
  high: "bg-amber-900",
}

export default function AssignedReports() {
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [isActiveReportLoading, setIsActiveReportLoading] = useState(true)
  const [activeReport, setActiveReport] = useState(null)
  const [isAssignedLoading, setIsAssignedLoading] = useState(true)
  const [assignedReportsWorker, setAssignedReportsWorker] = useState([])
  const [progressReport, setProgressReport] = useState([])
  const [isProgressLoading, setIsProgressLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleFetchActiveReport = async () => {
    try {
      const res = await getAssignedReport()
      setActiveReport(res.success ? res.data : null)
    } catch (error) {
      console.log(error)
      setActiveReport(null)
    } finally {
      setIsActiveReportLoading(false)
    }
  }

  const handleInprogressReport = async () => {
    try {
      const res = await getAssignedReportInprogress()
      if (res.success && res.data) {
        setProgressReport((prev) => {
          const exists = prev.some((r) => r.id === res.data.id)
          if (exists) return prev
          return [...prev, res.data]
        })
      } else {
        setProgressReport([])
      }
    } catch (error) {
      console.log(error)
      setProgressReport([])
    } finally {
      setIsProgressLoading(false)
    }
  }

  const handleFetchAllReport = async () => {
    try {
      const res = await getAllAssignedWorkerReports()
      setAssignedReportsWorker(res.success ? res.data || [] : [])
    } catch (error) {
      console.log(error)
      setAssignedReportsWorker([])
    } finally {
      setIsAssignedLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setIsActiveReportLoading(true)
    setIsAssignedLoading(true)
    setIsProgressLoading(true)
    try {
      await Promise.all([
        handleFetchActiveReport(),
        handleFetchAllReport(),
        handleInprogressReport(),
      ])
    } catch (error) {
      console.log("Refresh error:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleReportUpdate = async () => {
    setIsUpdating(true)
    try {
      const res = await makeReportInprogress(activeReport.id)
      if (res.success) {
        router.push({
          pathname: "/worker/ReportDetails",
          params: { reportId: activeReport.id },
        })
        setActiveReport(null)
        handleInprogressReport()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    handleFetchActiveReport()
    handleFetchAllReport()
    handleInprogressReport()
  }, [])

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex-row items-center justify-between h-16 px-4 bg-[#ce7a3b]"
      >
        <Text className="text-lg font-bold text-white font-jakarta">Tasks</Text>
        <Pressable
          className="absolute right-4 top-4"
          onPress={() => router.push("/worker/notification")}
        >
          <Bell size={20} color="white" />
        </Pressable>
      </Animated.View>

      <ScrollView
        className="flex-1 p-4 px-2"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#7d4f2b"]}
            tintColor="#7d4f2b"
          />
        }
      >
        {/* Active Report Card */}
        {isActiveReportLoading ? (
          <View className="items-center justify-center h-64">
            <ActivityIndicator size="large" color="#7d4f2b" />
            <Text className="mt-3 text-[#7d4f2b] font-geist">
              Checking for newly assigned reports...
            </Text>
          </View>
        ) : activeReport ? (
          <ActiveReportCard
            report={activeReport}
            handleReportUpdate={handleReportUpdate}
            isUpdating={isUpdating}
          />
        ) : (
          <View className="items-center justify-center p-6 mb-6 bg-white rounded-2xl">
            <FileText size={48} color="#d4a056" />
            <Text className="mt-3 text-lg font-bold text-[#583727] font-jakarta">
              No Active Reports
            </Text>
            <TouchableOpacity
              className="flex-row items-center px-4 py-2 mt-4 rounded-lg bg-amber-100"
              onPress={handleRefresh}
            >
              <RefreshCw size={16} color="#7d4f2b" />
              <Text className="ml-2 text-[#7d4f2b] font-geist">Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Reports */}
        <ReportSection
          title="Active Reports"
          reports={progressReport}
          loading={isProgressLoading}
          isActive
        />

        {/* Resolved Reports */}
        <ReportSection
          title="Reports"
          reports={assignedReportsWorker}
          loading={isAssignedLoading}
        />
      </ScrollView>
    </View>
  )
}

const ActiveReportCard = ({ report, handleReportUpdate, isUpdating }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      className="mb-6 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl"
    >
      {/* Severity strip */}
      <View className="flex-row">
        <View
          className={`h-2 w-full ${
            severityColors[report?.severity?.toLowerCase()] || "bg-amber-400"
          }`}
        />
        <View
          className={`h-2 w-4 rounded-r-full ${
            severityColors[report?.severity?.toLowerCase()] || "bg-amber-400"
          }`}
        />
      </View>

      <View className="p-4">
        <View className="flex-row items-start mb-4">
          <AlertCircle size={24} color="#b5863d" />
          <Text className="flex-1 ml-3 text-2xl font-bold text-[#583727] font-jakarta">
            {report?.title}
          </Text>
        </View>

        {/* Location */}
        <View className="flex-row items-center mb-2 p-3 bg-[#fff0e5] rounded-lg">
          <MapPin size={20} color="#d4a056" className="mr-3" />
          <View>
            <Text className="text-sm font-medium text-gray-500 font-geist">
              Location
            </Text>
            <Text className="text-gray-800 font-geist">
              {report?.location?.address ?? "No address"},{" "}
              {report?.location?.city ?? ""}
            </Text>
          </View>
        </View>

        {/* Reported Time */}
        <View className="flex-row items-center mb-3 p-3 bg-[#fff0e5] rounded-lg">
          <Calendar size={20} color="#d4a056" className="mr-3" />
          <View>
            <Text className="text-sm font-medium text-gray-500 font-geist">
              Reported
            </Text>
            <Text className="text-gray-800 font-geist">
              {timeAgo(report?.createdAt)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-4 p-3 bg-[#fff0e5] rounded-lg">
          <View className="flex-row items-center mb-2">
            <NotepadText size={20} color="#d4a056" className="mr-3" />
            <Text className="text-sm font-medium text-gray-500 font-geist">
              Description
            </Text>
          </View>
          <Text className="text-gray-600 font-geist">
            {report?.description || "No description provided."}
          </Text>
        </View>

        {/* Severity */}
        <View className="mb-4 p-3 bg-[#fff0e5] rounded-lg">
          <View className="flex-row items-center">
            <Gauge size={20} color="#d4a056" className="mr-3" />
            <Text className="text-sm font-medium text-gray-500 font-geist">
              Severity Level
            </Text>
          </View>
          <View className="flex-row items-center mt-1">
            <View
              className={`w-3 h-3 rounded-full mr-2 ${
                severityColors[report?.severity?.toLowerCase()] ||
                "bg-amber-400"
              }`}
            />
            <Text className="font-bold font-geist text-[#583727]">
              {report?.severity}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-3 rounded-md shadow-sm"
          style={{ backgroundColor: "#7d4f2b" }}
          activeOpacity={0.8}
          disabled={isUpdating}
          onPress={handleReportUpdate}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <ClipboardEdit size={20} color="white" className="mr-2" />
              <Text className="font-medium text-white font-geist">
                Start Working
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const ReportSection = ({ title, reports, loading, isActive = false }) => {
  const router = useRouter()
  if (loading)
    return (
      <View className="items-center justify-center h-40">
        <ActivityIndicator size="large" color="#7d4f2b" />
      </View>
    )

  if (reports.length === 0)
    return (
      <View className="items-center justify-center p-6 bg-white rounded-2xl">
        <CalendarCheck size={48} color={isActive ? "green" : "#d4a056"} />
        <Text
          className={`mt-3 text-lg font-bold ${
            isActive ? "text-green-600" : "text-[#583727]"
          } font-jakarta`}
        >
          No {title}
        </Text>
      </View>
    )

  return (
    <View className="px-2 my-4 bg-white rounded-lg">
      <Animated.Text
        entering={FadeInRight.delay(300).duration(500)}
        className={`mt-4 mb-3 text-xl font-bold ${
          isActive ? "text-green-700" : "text-orange-700"
        } font-jakarta`}
      >
        {title}
      </Animated.Text>

      {reports.map((report, index) => (
        <Swipeable key={report.id} overshootRight={false} overshootLeft={false}>
          <ReportCard report={report} index={index} isActive={isActive} />
        </Swipeable>
      ))}
    </View>
  )
}

const ReportCard = ({ report, index, isActive }) => {
  const scale = useSharedValue(1)
  const router = useRouter()
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }))

  return (
    <Animated.View
      entering={FadeInRight.delay(300 + index * 100).duration(500)}
      style={animatedStyle}
      className="mb-4 overflow-hidden border border-blue-50 rounded-xl bg-white shadow-md"
    >
      <View className="p-4">
        <View className="flex-row items-start pb-3">
          <FileText size={18} color="#4ade80" className="mr-4" />
          <Text className="flex-1 font-semibold text-base text-gray-800 font-geist ml-2">
            {report.title}
          </Text>
        </View>

        <Text
          className="mb-3 text-sm text-gray-600 font-jakarta"
          numberOfLines={2}
        >
          {report.description || "No description available"}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-green-600 font-geist">
            Resolved
          </Text>
          <Text className="text-xs font-medium text-gray-700 font-jakarta">
            {timeAgo(report.createdAt)}
          </Text>
        </View>

        <View className="flex-row items-center justify-start space-x-3">
          <TouchableOpacity
            className="w-24 py-2 px-2 bg-blue-500 rounded-md mt-2"
            onPress={() =>
              router.push({
                pathname: "/worker/ReportDetails",
                params: { reportId: report.id },
              })
            }
          >
            <Text className="text-white text-center font-geist text-base">
              See details
            </Text>
          </TouchableOpacity>
          {isActive && (
            <TouchableOpacity
              className="w-28 py-2 px-2 bg-orange-500 rounded-md mt-2"
              onPress={() =>
                router.push({
                  pathname: "/worker/Resolve",
                  params: { reportId: report.id },
                })
              }
            >
              <Text className="text-white text-center font-geist text-xs">
                Done Working
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

function timeAgo(date) {
  if (!date) return "Unknown time"
  const now = new Date()
  const past = new Date(date)
  const secondsPast = Math.floor((now - past) / 1000)

  if (secondsPast < 10) return "just now"
  if (secondsPast < 60) return `${secondsPast}s ago`
  const minutes = Math.floor(secondsPast / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(months / 12)
  return `${years}y ago`
}
