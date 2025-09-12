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
  Clock,
  Eye,
  FileText,
  Gauge,
  MapPin,
  NotepadText,
  RefreshCw,
  Trash,
} from "lucide-react-native"
import Swipeable from "react-native-gesture-handler/Swipeable"
import Animated, {
  FadeInDown,
  FadeInRight,
  LightSpeedInLeft,
  LightSpeedInRight,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

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

  const renderRightActions = () => {
    return (
      <Animated.View
        entering={LightSpeedInRight.duration(300)}
        className="justify-center my-2 ml-2 bg-red-500 px-9 rounded-r-3xl"
      >
        <Trash size={18} color="white" />
      </Animated.View>
    )
  }

  const renderLeftActions = () => {
    return (
      <Animated.View
        entering={LightSpeedInLeft.duration(300)}
        className="justify-center px-6 my-2 mr-2 rounded-lg bg-emerald-500"
      >
        <Text className="font-bold text-white font-jakarta">Restore</Text>
      </Animated.View>
    )
  }

  const handleFetchActiveReport = async () => {
    try {
      const res = await getAssignedReport()

      if (res.success) {
        setActiveReport(res.data)
      } else {
        setActiveReport(null)
      }
    } catch (error) {
      console.log(error)
      setActiveReport(null)
    } finally {
      setIsProgressLoading(false)
    }
  }
  const handleInprogressReport = async () => {
    try {
      const res = await getAssignedReportInprogress()

      if (res.success && res.data) {
        setProgressReport((prev) => {
          const alreadyExists = prev.some((report) => report.id === res.data.id)

          if (alreadyExists) {
            return prev
          }

          return [...prev, res.data]
        })
      } else {
        setProgressReport([])
      }
    } catch (error) {
      console.log(error)
      setProgressReport([])
    } finally {
      setIsActiveReportLoading(false)
    }
  }

  const handleFetchAllReport = async () => {
    try {
      const res = await getAllAssignedWorkerReports()

      if (res.success) {
        setAssignedReportsWorker(res.data || [])
      } else {
        setAssignedReportsWorker([])
      }
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
          params: {
            reportId: activeReport.id,
          },
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
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            className="mb-6 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl"
            style={{
              shadowColor: "#7d4f2b",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 8,
              backgroundColor: "#fff9f5",
            }}
          >
            {/* Severity Color Strip with decorative end */}
            <View className="flex-row">
              <View
                className={`h-2 w-full ${
                  severityColors[activeReport?.severity?.toLowerCase()] ||
                  "bg-amber-400"
                }`}
              />
              <View
                className={`h-2 w-4 rounded-r-full ${
                  severityColors[activeReport?.severity?.toLowerCase()] ||
                  "bg-amber-400"
                }`}
              />
            </View>

            <View className="p-4">
              {/* Title with decorative icon */}
              <View className="flex-row items-start mb-4">
                <AlertCircle size={24} className="mr-3 text-[#b5863d] mt-1" />
                <Text className="flex-1 text-2xl font-bold text-[#583727] font-jakarta">
                  {activeReport?.title}
                </Text>
              </View>

              {/* Location with more prominent styling */}
              <View className="flex-row items-center mb-2 p-3 bg-[#fff0e5] rounded-lg">
                <MapPin size={20} className="mr-3 text-[#d4a056]" />
                <View>
                  <Text className="text-sm font-medium text-gray-500 font-geist">
                    Location
                  </Text>
                  <Text className="text-gray-800 font-geist">
                    {activeReport?.location?.address ?? "No address"},{" "}
                    {activeReport?.location?.city ?? ""}
                  </Text>
                </View>
              </View>

              {/* Reported Time with calendar icon */}
              <View className="flex-row items-center mb-3 p-3 bg-[#fff0e5] rounded-lg">
                <Calendar size={20} className="mr-3 text-[#d4a056]" />
                <View>
                  <Text className="text-sm font-medium text-gray-500 font-geist">
                    Reported
                  </Text>
                  <Text className="text-gray-800 font-geist">
                    {timeAgo(activeReport?.createdAt)}
                  </Text>
                </View>
              </View>

              {/* Description with notepad icon */}
              <View className="mb-4 p-3 bg-[#fff0e5] rounded-lg">
                <View className="flex-row items-center mb-2">
                  <NotepadText size={20} className="mr-3 text-[#d4a056]" />
                  <Text className="text-sm font-medium text-gray-500 font-geist">
                    Description
                  </Text>
                </View>
                <Text className="text-gray-600 font-geist">
                  {activeReport?.description || "No description provided."}
                </Text>
              </View>

              {/* Severity Level with gauge icon */}
              <View className="mb-4 p-3 bg-[#fff0e5] rounded-lg">
                <View className="flex-row items-center">
                  <Gauge size={20} className="mr-3 text-[#d4a056]" />
                  <Text className="text-sm font-medium text-gray-500 font-geist">
                    Severity Level
                  </Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <View
                    className={`w-3 h-3 rounded-full mr-2 ${
                      severityColors[activeReport?.severity?.toLowerCase()] ||
                      "bg-amber-400"
                    }`}
                  />
                  <Text className={`font-bold font-geist text-[#583727]`}>
                    {activeReport?.severity?.charAt(0)?.toUpperCase() +
                      activeReport?.severity?.slice(1)?.toLowerCase()}
                  </Text>
                </View>
              </View>

              {/* Action Button with animation and icon */}
              <AnimatedTouchable
                entering={FadeInDown.delay(200).duration(500)}
                className="flex-row items-center justify-center py-3 rounded-md shadow-sm"
                style={{
                  backgroundColor: "#7d4f2b",
                  shadowColor: "#583727",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                }}
                activeOpacity={0.8}
                disabled={isUpdating} // prevent multiple presses while loading
                onPress={handleReportUpdate}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <ClipboardEdit size={20} className="mr-2 text-white" />
                    <Text className="font-medium text-white font-geist">
                      Start Working
                    </Text>
                  </>
                )}
              </AnimatedTouchable>
            </View>
          </Animated.View>
        ) : (
          <View className="items-center justify-center p-6 mb-6 bg-white rounded-2xl">
            <FileText size={48} color="#d4a056" />
            <Text className="mt-3 text-lg font-bold text-[#583727] font-jakarta">
              No Active Reports
            </Text>
            <Text className="mt-1 text-center text-gray-600 font-geist">
              You don't have any active reports assigned at the moment.
            </Text>
            <TouchableOpacity
              className="flex-row items-center px-4 py-2 mt-4 rounded-lg bg-amber-100"
              onPress={handleRefresh}
            >
              <RefreshCw size={16} color="#7d4f2b" className="mr-2" />
              <Text className="text-[#7d4f2b] font-geist">Refresh</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active reports */}
        <View className="px-2 my-4 bg-white rounded-lg">
          <Animated.Text
            entering={FadeInRight.delay(300).duration(500)}
            className="mt-4 mb-3 text-lg font-bold text-green-700 font-jakarta"
          >
            Active Reports
          </Animated.Text>

          <Animated.Text
            entering={FadeInRight.delay(400).duration(500)}
            className="mb-6 text-sm text-gray-600 font-jakarta"
          >
            Here are the reports that you are working right now.
          </Animated.Text>

          {isProgressLoading ? (
            <View className="items-center justify-center h-40">
              <ActivityIndicator size="large" color="#7d4f2b" />
              <Text className="mt-3 text-[#7d4f2b] font-geist">
                Loading resolved reports...
              </Text>
            </View>
          ) : progressReport.length > 0 ? (
            progressReport.map((report, index) => (
              <Swipeable
                key={report.id}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                overshootRight={false}
                overshootLeft={false}
              >
                <AnimatedReportCard
                  report={report}
                  index={index}
                  isActive={true}
                />
              </Swipeable>
            ))
          ) : (
            <View className="items-center justify-center p-6 bg-white rounded-2xl">
              <CalendarCheck size={48} color="green" />
              <Text className="mt-3 text-lg font-bold text-green-600 font-jakarta">
                No Active Reports
              </Text>
              <Text className="mt-1 text-center text-gray-600 font-geist">
                You have no active report at the moment.
              </Text>
            </View>
          )}
        </View>
        {/* Resolved Reports Section */}
        <Animated.Text
          entering={FadeInRight.delay(300).duration(500)}
          className="mt-4 mb-3 text-lg font-bold text-orange-700 font-jakarta"
        >
          Reports
        </Animated.Text>

        <Animated.Text
          entering={FadeInRight.delay(400).duration(500)}
          className="mb-6 text-sm text-gray-600 font-jakarta"
        >
          Here are the reports that you have been worked on recently.
        </Animated.Text>

        {isAssignedLoading ? (
          <View className="items-center justify-center h-40">
            <ActivityIndicator size="large" color="#7d4f2b" />
            <Text className="mt-3 text-[#7d4f2b] font-geist">
              Loading resolved reports...
            </Text>
          </View>
        ) : assignedReportsWorker.length > 0 ? (
          assignedReportsWorker.map((report, index) => (
            <Swipeable
              key={report.id}
              renderRightActions={renderRightActions}
              renderLeftActions={renderLeftActions}
              overshootRight={false}
              overshootLeft={false}
            >
              <AnimatedReportCard report={report} index={index} />
            </Swipeable>
          ))
        ) : (
          <View className="items-center justify-center p-6 bg-white rounded-2xl">
            <CalendarCheck size={48} color="#d4a056" />
            <Text className="mt-3 text-lg font-bold text-[#583727] font-jakarta">
              No Reports
            </Text>
            <Text className="mt-1 text-center text-gray-600 font-geist">
              You haven't work on any reports yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const AnimatedReportCard = ({ report, index, isActive = false }) => {
  const scale = useSharedValue(1)
  const router = useRouter()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      entering={FadeInRight.delay(300 + index * 100).duration(500)}
      style={[
        animatedStyle,
        {
          shadowColor: "#3b82f6",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        },
      ]}
      className="mb-4 overflow-hidden border border-blue-50 rounded-xl bg-gradient-to-b from-blue-50 to-white"
    >
      <View className="p-4">
        {/* Title with document icon */}
        <View className="flex-row items-start pb-3">
          <FileText size={18} className="mr-2 text-green-400 mt-0.5" />
          <Text className="flex-1 font-semibold text-[16px] text-gray-800 font-geist">
            {report.title}
          </Text>
        </View>

        {/* Description with notepad icon */}
        <View className="flex-row mb-3">
          <Text
            className="flex-1 text-sm text-gray-600 font-jakarta"
            numberOfLines={2}
          >
            {report.description || "No description available"}
          </Text>
        </View>

        {/* Resolved date with calendar check icon */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-sm font-semibold text-green-600 font-geist">
              Resolved
            </Text>
          </View>
          <Text className="text-xs font-medium text-gray-700 font-jakarta">
            {timeAgo(report.createdAt)}
          </Text>
        </View>

        <View className="flex-row items-center justify-start space-x-3">
          <TouchableOpacity
            className={
              "w-24  py-2 px-2 bg-blue-500 rounded-md mt-2 text-white font-geist text-xs"
            }
            onPress={() =>
              router.push({
                pathname: "/worker/ReportDetails",
                params: {
                  reportId: report.id,
                },
              })
            }
          >
            See details
          </TouchableOpacity>
          {isActive && (
            <TouchableOpacity
              className={
                "w-28  py-2 px-2 bg-orange-500 rounded-md mt-2 text-white font-geist text-xs"
              }
              onPress={() =>
                router.push({
                  pathname: "/worker/Resolve",
                  params: {
                    reportId: report.id,
                  },
                })
              }
            >
              Done Working
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

  if (secondsPast < 10) {
    return "just now"
  }
  if (secondsPast < 60) {
    return `${secondsPast} second${secondsPast !== 1 ? "s" : ""} ago`
  }
  const minutesPast = Math.floor(secondsPast / 60)
  if (minutesPast < 60) {
    return `${minutesPast} minute${minutesPast !== 1 ? "s" : ""} ago`
  }
  const hoursPast = Math.floor(minutesPast / 60)
  if (hoursPast < 24) {
    return `${hoursPast} hour${hoursPast !== 1 ? "s" : ""} ago`
  }
  const daysPast = Math.floor(hoursPast / 24)
  if (daysPast < 30) {
    return `${daysPast} day${daysPast !== 1 ? "s" : ""} ago`
  }
  const monthsPast = Math.floor(daysPast / 30)
  if (monthsPast < 12) {
    return `${monthsPast} month${monthsPast !== 1 ? "s" : ""} ago`
  }
  const yearsPast = Math.floor(monthsPast / 12)
  return `${yearsPast} year${yearsPast !== 1 ? "s" : ""} ago`
}
