import { Text, View, ScrollView, TouchableOpacity } from "react-native"
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

// Mock data
const activeReport = {
  id: "AR-2023-045",
  title: "Leaking Water Pipe",
  description:
    "Several sections of the sidewalk along Pine Street have cracked and lifted due to tree root growth, creating tripping hazards for pedestrians. Repairs were made by leveling the sidewalk and trimming nearby roots to ensure safety.",
  imageUrls: [], // No thumbnail for active reports
  videoUrl: null,
  status: "PENDING", // enum: PENDING, IN_PROGRESS, RESOLVED, etc.
  severity: "MEDIUM", // enum: LOW, MEDIUM, HIGH, CRITICAL
  spamScore: 0.0,
  confidenceScore: 0.95,
  isPublic: true,
  toxicityScore: 0.0,
  resolutionNote: null,
  resolvedAt: null,
  createdAt: "2025-08-12T09:30:00Z",
  updatedAt: "2025-08-12T09:30:00Z",
  isAnonymous: false,
  tags: ["plumbing", "leak", "public-safety"],
  location: {
    id: "LOC-2025-001",
    latitude: 40.7128,
    longitude: -74.006,
    address: "Main Street, Block 12",
    city: "Negari City",
    region: "Central",
  },
  reporter: {
    id: "USR-2025-123",
    username: "citizen_john",
    profilePicture: "/avatars/john.png",
    role: "CITIZEN",
  },
  category: {
    id: "CAT-PLUMBING",
    name: "Plumbing",
    description: "Issues related to water supply, pipes, and leaks",
    icon: "fa-faucet",
    color: "#7d4f2b",
  },
  assignedToWorker: {
    id: "USR-2025-456",
    username: "worker_ali",
    profilePicture: "/avatars/ali.png",
    role: "WORKER",
  },
  regionId: "REG-2025-001",
}

const resolvedReports = [
  {
    id: "RR-2023-044",
    title: "Broken Streetlight",
    location: "Oak Avenue",
    resolvedDate: "Yesterday",
    severity: "low",
    description:
      "The streetlight at the intersection of Oak Avenue and 5th Street has stopped functioning. This has caused low visibility during nighttime, raising safety concerns for pedestrians and drivers. The bulb and wiring were inspected and replaced.",
  },
  {
    id: "RR-2023-043",
    title: "Pothole Repair",
    location: "Elm Street",
    resolvedDate: "2 days ago",
    severity: "high",
    description:
      "A large pothole located in the middle of Elm Street near the bus stop was causing significant traffic disruptions and potential vehicle damage. The maintenance team filled and resurfaced the affected area to restore safe passage.",
  },
  {
    id: "RR-2023-042",
    title: "Overflowing Trash Bin",
    location: "Maple Park",
    resolvedDate: "3 days ago",
    severity: "medium",
    description:
      "The trash bin near the main entrance of Maple Park was overflowing for several days, causing litter to scatter around and attracting pests. The sanitation department emptied the bin and scheduled more frequent pickups to prevent recurrence.",
  },
  {
    id: "RR-2023-041",
    title: "Damaged Sidewalk",
    location: "Pine Street",
    resolvedDate: "Last week",
    severity: "medium",
    description:
      "Several sections of the sidewalk along Pine Street have cracked and lifted due to tree root growth, creating tripping hazards for pedestrians. Repairs were made by leveling the sidewalk and trimming nearby roots to ensure safety.",
  },
]

const severityColors = {
  low: "bg-amber-400",
  medium: "bg-amber-600",
  high: "bg-amber-900",
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

export default function AssignedReports() {
  const renderRightActions = () => {
    return (
      <Animated.View
        entering={LightSpeedInRight.duration(300)}
        className="justify-center px-9 my-2 ml-2 bg-red-500 rounded-r-3xl"
      >
        <Trash size={18} color="white" />
        {/* <Text className="font-bold text-white font-jakarta">Delete</Text> */}
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

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(500)}
        className="flex-row items-center justify-between h-16 px-4 bg-[#ce7a3b]"
      >
        <Text className="text-lg font-bold text-white font-jakarta">Tasks</Text>
        <Bell className="absolute right-4" size={20} color="white" />
      </Animated.View>

      <ScrollView className="flex-1 p-4">
        {/* Active Report Card */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          className="mb-6 overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-lg"
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
              className={`h-2 w-full ${severityColors[activeReport.severity.toUpperCase()]}`}
            />
            <View
              className={`h-2 w-4 rounded-r-full ${severityColors[activeReport.severity.toUpperCase()]}`}
            />
          </View>

          <View className="p-4">
            {/* Title with decorative icon */}
            <View className="flex-row items-start mb-4">
              <AlertCircle size={24} className="mr-3 text-[#b5863d] mt-1" />
              <Text className="flex-1 text-2xl font-bold text-[#583727] font-jakarta">
                {activeReport.title}
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
                  {activeReport.location?.address ?? "No address"},{" "}
                  {activeReport.location?.city ?? ""}
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
                  {timeAgo(activeReport.createdAt)}
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
                {activeReport.description || "No description provided."}
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
              <View className="mt-1 flex-row items-center">
                <View
                  className={`w-3 h-3 rounded-full mr-2 ${severityColors[activeReport.severity.toUpperCase()]}`}
                />
                <Text className={`font-bold font-geist text-[#583727]`}>
                  {activeReport.severity.charAt(0).toUpperCase() +
                    activeReport.severity.slice(1).toLowerCase()}
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
              onPress={() => {
                console.log("View Report pressed for", activeReport.id)
              }}
            >
              <ClipboardEdit size={20} className="mr-2 text-white" />
              <Text className=" font-medium text-white font-geist">
                Mark as In Progress
              </Text>
            </AnimatedTouchable>
          </View>
        </Animated.View>

        {/* Resolved Reports Section */}
        <Animated.Text
          entering={FadeInRight.delay(300).duration(500)}
          className="mt-4 mb-3 text-lg font-bold text-green-700 font-jakarta"
        >
          Resolved Reports
        </Animated.Text>

        <Animated.Text
          entering={FadeInRight.delay(400).duration(500)}
          className="mb-6 text-sm text-gray-600 font-jakarta"
        >
          Here are the reports that have been successfully resolved recently.
        </Animated.Text>

        {resolvedReports.map((report, index) => (
          <Swipeable
            key={report.id}
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            overshootRight={false}
            overshootLeft={false}
          >
            <AnimatedReportCard report={report} index={index} />
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  )
}

const AnimatedReportCard = ({ report, index }) => {
  const scale = useSharedValue(1)

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
            {report.resolvedDate}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

function timeAgo(date) {
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
