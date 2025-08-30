import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
} from "react-native"
import {
  Bell,
  ChevronDown,
  EllipsisVertical,
  Heart,
  MapPin as Locate,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Share2,
  Play,
  Mic,
  Bookmark,
  Flag,
  ExternalLink,
} from "lucide-react-native"

const { width } = Dimensions.get("window")

// Mock data - each post has only ONE media type
const mockReports = [
  {
    id: "1",
    title: "Pothole on Main Street",
    description:
      "Large pothole causing traffic issues and potential vehicle damage. Located near the intersection with Oak Avenue.",
    category: "Roads",
    status: "pending",
    location: "Downtown, Main St",
    mediaType: "photo",
    mediaUrl: "https://picsum.photos/600/400?random=1",
    createdAt: "3 h ago",
    user: { name: "John Doe", avatar: "https://picsum.photos/80/80?random=1" },
    likes: 12,
    comments: 5,
  },
  {
    id: "2",
    title: "Street Light Not Working",
    description:
      "Street light has been out for over a week, making the area unsafe at night.",
    category: "Electricity",
    status: "in_progress",
    location: "Riverside, Pine St",
    mediaType: "video",
    mediaUrl: "https://example.com/video1.mp4",
    createdAt: "1 d ago",
    user: {
      name: "Sarah Wilson",
      avatar: "https://picsum.photos/80/80?random=2",
    },
    likes: 8,
    comments: 3,
  },
  {
    id: "3",
    title: "Water Pipe Burst",
    description: "Major water leak flooding the sidewalk and road.",
    category: "Water",
    status: "resolved",
    location: "Northside, Elm Ave",
    mediaType: "voice",
    mediaUrl: "https://example.com/voice1.mp3",
    createdAt: "2 d ago",
    user: {
      name: "Mike Johnson",
      avatar: "https://picsum.photos/80/80?random=3",
    },
    likes: 25,
    comments: 12,
  },
  {
    id: "4",
    title: "Broken Traffic Signal",
    description:
      "Traffic light stuck on red for over 30 minutes causing major delays.",
    category: "Roads",
    status: "pending",
    location: "Central Ave & 5th St",
    mediaType: "photo",
    mediaUrl: "https://picsum.photos/600/400?random=4",
    createdAt: "5 h ago",
    user: { name: "Lisa Chen", avatar: "https://picsum.photos/80/80?random=4" },
    likes: 6,
    comments: 2,
  },
]

const categories = ["All", "Roads", "Crime", "Water", "Electricity", "Other"]

const statusColors = {
  pending: "bg-red-500",
  in_progress: "bg-orange-500",
  resolved: "bg-green-500",
  rejected: "bg-gray-500",
}

const statusText = {
  pending: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
}

// Voice Note Player Component
const VoiceNotePlayer = ({ voiceUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration] = useState("0:45")

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <View className="flex-row items-center gap-3 p-4 rounded-lg bg-gray-50">
      <TouchableOpacity
        className="items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm shadow-black/10"
        onPress={togglePlay}
      >
        {isPlaying ? (
          <View className="w-4 h-4 bg-blue-600 rounded" />
        ) : (
          <Play size={16} color="#2563EB" fill="#2563EB" />
        )}
      </TouchableOpacity>
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-2">
          <Mic size={16} color="#2563EB" />
          <Text className="font-medium text-gray-700">Voice Note</Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full">
          <View className="w-1/3 h-2 bg-blue-600 rounded-full" />
        </View>
      </View>
      <Text className="text-gray-500">{duration}</Text>
    </View>
  )
}

// Video Player Component
const VideoPlayer = ({ videoUrl }) => {
  return (
    <View className="relative w-full h-48 overflow-hidden rounded-lg">
      <Image
        source={{ uri: "https://picsum.photos/600/400?random=video" }}
        className="w-full h-full"
      />
      <View className="absolute inset-0 items-center justify-center bg-black/30">
        <TouchableOpacity className="items-center justify-center w-16 h-16 rounded-full bg-black/60">
          <Play size={32} color="#FFFFFF" fill="#FFFFFF" className="ml-1" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Photo Component
const PhotoDisplay = ({ photoUrl }) => {
  return <Image source={{ uri: photoUrl }} className="w-full h-64 rounded-lg" />
}

// Dropdown Menu Component
const DropdownMenu = ({ reportId }) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleMenuAction = (action) => {
    setIsVisible(false)
    console.log(`${action} for report ${reportId}`)
  }

  return (
    <View className="relative">
      <TouchableOpacity
        className="p-2"
        onPress={() => setIsVisible(!isVisible)}
      >
        <EllipsisVertical size={16} color="#6B7280" />
      </TouchableOpacity>
      {isVisible && (
        <View className="absolute top-8 right-0 bg-white rounded-lg shadow-lg shadow-black/20 min-w-[180px] z-50">
          <TouchableOpacity
            className="flex-row items-center gap-3 px-4 py-3"
            onPress={() => handleMenuAction("view")}
          >
            <ExternalLink size={16} color="#6B7280" />
            <Text className="text-gray-700">View Full Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-3 px-4 py-3"
            onPress={() => handleMenuAction("report")}
          >
            <Flag size={16} color="#6B7280" />
            <Text className="text-gray-700">Report Inappropriate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-3 px-4 py-3"
            onPress={() => handleMenuAction("share")}
          >
            <Share2 size={16} color="#6B7280" />
            <Text className="text-gray-700">Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-3 px-4 py-3"
            onPress={() => handleMenuAction("save")}
          >
            <Bookmark size={16} color="#6B7280" />
            <Text className="text-gray-700">Save/Bookmark</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

// Report Card Component
const ReportCard = ({ report }) => {
  const renderMedia = () => {
    switch (report.mediaType) {
      case "photo":
        return <PhotoDisplay photoUrl={report.mediaUrl} />
      case "video":
        return <VideoPlayer videoUrl={report.mediaUrl} />
      case "voice":
        return <VoiceNotePlayer voiceUrl={report.mediaUrl} />
      default:
        return null
    }
  }

  return (
    <View className="p-4 bg-white shadow-sm rounded-xl shadow-black/5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: report.user.avatar }}
            className="w-10 h-10 mr-3 rounded-full"
          />
          <View className="flex-1">
            <Text className="font-semibold text-gray-900">
              {report.user.name}
            </Text>
            <Text className="text-xs text-gray-500">
              {report.createdAt} • {report.location}
            </Text>
          </View>
        </View>
        <DropdownMenu reportId={report.id} />
      </View>

      {/* Content */}
      <Text className="mb-2 text-lg font-bold text-gray-900">
        {report.title}
      </Text>

      <View className="flex-row items-center justify-between mb-3">
        <View className="px-3 py-1 rounded-full bg-blue-50">
          <Text className="text-xs font-medium text-blue-700">
            {report.category}
          </Text>
        </View>
        <View
          className={`${statusColors[report.status]} px-3 py-1 rounded-full`}
        >
          <Text className="text-xs font-semibold text-white">
            {statusText[report.status]}
          </Text>
        </View>
      </View>

      {/* Media */}
      <View className="mb-3">{renderMedia()}</View>

      <Text className="mb-1 text-sm text-gray-600" numberOfLines={3}>
        {report.description}
      </Text>
      <TouchableOpacity>
        <Text className="text-sm font-medium text-blue-600">See More</Text>
      </TouchableOpacity>

      {/* Actions */}
      <View className="flex-row justify-around pt-3 mt-3 border-t border-gray-100">
        <TouchableOpacity className="flex-row items-center gap-1 p-2">
          <Heart size={16} color="#6B7280" />
          <Text className="text-sm text-gray-500">{report.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center gap-1 p-2">
          <MessageCircle size={16} color="#6B7280" />
          <Text className="text-sm text-gray-500">{report.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <Share2 size={16} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2">
          <MapPin size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Category Dropdown Component
const CategoryDropdown = ({
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View className="relative z-10">
      <TouchableOpacity
        className="flex-row items-center px-4 py-2 bg-blue-600 rounded-full"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text className="mr-2 font-medium text-white">{activeCategory}</Text>
        <ChevronDown size={16} color="#FFFFFF" />
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute left-0 w-48 bg-white rounded-lg shadow-lg top-12 shadow-black/20">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              className={`px-4 py-3 ${activeCategory === category ? "bg-blue-50" : ""}`}
              onPress={() => {
                setActiveCategory(category)
                setIsOpen(false)
              }}
            >
              <Text
                className={`${activeCategory === category ? "text-blue-600 font-medium" : "text-gray-700"}`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

export default function Feed() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredReports = mockReports.filter(
    (r) => activeCategory === "All" || r.category === activeCategory
  )

  const renderReport = ({ item }) => <ReportCard report={item} />

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-blue-800 shadow-md rounded-b-2xl shadow-black/20">
        <View className="flex-row items-center">
          <View className="p-2 bg-green-500 rounded-lg">
            <Text className="text-lg font-bold text-white">CityCare</Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <TouchableOpacity className="p-2">
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity className="relative p-2">
            <Bell size={20} color="#FFFFFF" />
            <View className="absolute w-2 h-2 bg-green-400 rounded-full top-1 right-1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <CategoryDropdown
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <TouchableOpacity className="flex-row items-center px-3 py-2 bg-green-500 rounded-full">
          <Locate size={16} color="#FFFFFF" />
          <Text className="ml-1 font-medium text-white">Nearby</Text>
        </TouchableOpacity>
      </View>

      {/* Reports Feed */}
      <FlatList
        data={filteredReports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        className="flex-1"
      />

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute items-center justify-center bg-blue-600 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 shadow-black/30">
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}
