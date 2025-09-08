import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import {
  MapPin,
  Clock,
  User,
  Shield,
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  Image as ImageIcon,
  Video,
  Tag,
  ChevronLeft,
  Eye,
} from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { getReportById } from "../../services/report"
const Report = () => {
  const { reportId } = useLocalSearchParams()
  const router = useRouter()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [reportId])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await getReportById(reportId)
      if (response.success) {
        setReport(response.data)
      } else {
        Alert.alert("Error", "Failed to load report details")
        router.back()
      }
    } catch (error) {
      console.error("Error fetching report:", error)
      Alert.alert("Error", "Failed to load report details")
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500"
      case "VERIFIED":
        return "bg-blue-500"
      case "RESOLVED":
        return "bg-emerald-500"
      case "REJECTED":
        return "bg-rose-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "LOW":
        return "bg-green-500"
      case "MEDIUM":
        return "bg-amber-500"
      case "HIGH":
        return "bg-orange-500"
      case "CRITICAL":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} color="white" />
      case "VERIFIED":
        return <Shield size={16} color="white" />
      case "RESOLVED":
        return <Shield size={16} color="white" />
      case "REJECTED":
        return <AlertTriangle size={16} color="white" />
      default:
        return <Clock size={16} color="white" />
    }
  }

  const handleContactOfficer = () => {
    router.push({
      pathname: "/one/chat",
      params: {
        conversationId: report.assignedTo.id,
        officer: JSON.stringify(report.assignedTo),
      },
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="mt-4 text-gray-600 font-geist">
          Loading report details...
        </Text>
      </View>
    )
  }

  if (!report) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <Text className="text-gray-600">Report not found</Text>
        <TouchableOpacity
          className="px-6 py-3 mt-4 bg-purple-600 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 font-geist">
            Report Details
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Report Images */}
          {report.imageUrls && report.imageUrls.length > 0 && (
            <View className="mb-6">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="py-3"
              >
                {report.imageUrls.map((imageUrl, index) => (
                  <View
                    key={index}
                    className="ml-4 mr-4 overflow-hidden rounded-lg"
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      className="w-80 h-60"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Main Content */}
          <View className="px-4 pb-8">
            {/* Title and Status */}
            <View className="mb-6">
              <Text className="mb-2 text-2xl font-bold text-gray-800 font-geist">
                {report.title}
              </Text>
              <View className="flex-row flex-wrap">
                <View
                  className={`px-3 py-1 rounded-full ${getStatusColor(report.status)} flex-row items-center mr-2 mb-2`}
                >
                  {getStatusIcon(report.status)}
                  <Text className="ml-1 text-sm text-white capitalize font-jakarta">
                    {report.status.toLowerCase()}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${getSeverityColor(report.severity)} flex-row items-center mr-2 mb-2`}
                >
                  <AlertTriangle size={14} color="white" />
                  <Text className="ml-1 text-sm text-white capitalize font-jakarta">
                    {report.severity.toLowerCase()}
                  </Text>
                </View>
                {report.isPublic && (
                  <View className="flex-row items-center px-3 py-1 mb-2 bg-purple-500 rounded-full">
                    <Eye size={14} color="white" />
                    <Text className="ml-1 text-sm text-white font-jakarta">
                      Public
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="mb-2 text-lg font-semibold text-gray-800 font-geist">
                Description
              </Text>
              <Text className="leading-6 text-gray-600 font-jakarta">
                {report.description}
              </Text>
            </View>

            {/* AI Analysis Section */}
            <View className="p-4 mb-6 border border-blue-100 bg-blue-50 rounded-xl">
              <Text className="mb-3 text-lg font-semibold text-blue-800 font-geist">
                AI Analysis
              </Text>
              <View className="flex-row justify-between mb-3">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600 font-jakarta">
                    {(report.confidenceScore * 100).toFixed(0)}%
                  </Text>
                  <Text className="text-xs text-blue-500 font-geist">
                    Confidence
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600 font-jakarta">
                    {(report.toxicityScore * 100).toFixed(0)}%
                  </Text>
                  <Text className="text-xs text-blue-500 font-jakarta">
                    Toxicity
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-blue-600 font-jakarta">
                    {(report.spamScore * 100).toFixed(0)}%
                  </Text>
                  <Text className="text-xs text-blue-500 font-jakarta">
                    Spam Score
                  </Text>
                </View>
              </View>
              <View className="p-3 bg-white rounded-lg">
                <Text className="text-sm text-blue-700 font-jakarta">
                  Our AI system has analyzed this report and found it to be
                  highly credible with low risk of spam or toxic content.
                </Text>
              </View>
            </View>

            {/* Metadata */}
            <View className="mb-6">
              <Text className="mb-3 text-lg font-semibold text-gray-800 font-geist">
                Report Details
              </Text>
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Clock size={18} color="#6b7280" />
                  <Text className="ml-2 text-gray-600 font-geist">
                    Created: {formatDate(report.createdAt)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={18} color="#6b7280" />
                  <Text className="ml-2 text-gray-600 font-geist">
                    Updated: {formatDate(report.updatedAt)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MapPin size={18} color="#6b7280" />
                  <Text className="ml-2 text-gray-600 font-geist">
                    Location:{" "}
                    {report.locationId ? "Registered Location" : "Unknown"}
                  </Text>
                </View>
                {report.tags && report.tags.length > 0 && (
                  <View className="flex-row items-start">
                    <Tag size={18} color="#6b7280" className="mt-1" />
                    <View className="flex-row flex-wrap ml-2">
                      {report.tags.map((tag, index) => (
                        <View
                          key={index}
                          className="px-2 py-1 mb-2 mr-2 bg-gray-100 rounded-full"
                        >
                          <Text className="text-xs text-gray-600 font-geist">
                            #{tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Resolution Section if resolved */}
            {report.status === "RESOLVED" && report.resolutionNote && (
              <View className="p-4 mb-6 border border-green-200 bg-green-50 rounded-xl">
                <Text className="mb-2 text-lg font-semibold text-green-800 font-geist">
                  Resolution Details
                </Text>
                <Text className="mb-2 text-green-700 font-geist">
                  Resolved on: {formatDate(report.resolvedAt)}
                </Text>
                <Text className="text-green-700 font-geist">
                  {report.resolutionNote}
                </Text>
                {report.resolutionImages &&
                  report.resolutionImages.length > 0 && (
                    <View className="mt-3">
                      <Text className="mb-2 text-sm font-medium text-green-800">
                        Resolution Images:
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      >
                        {report.resolutionImages.map((imageUrl, index) => (
                          <Image
                            key={index}
                            source={{ uri: imageUrl }}
                            className="w-20 h-20 mr-2 rounded-lg"
                            resizeMode="cover"
                          />
                        ))}
                      </ScrollView>
                    </View>
                  )}
              </View>
            )}

            {/* Contact Officer Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 mb-6 bg-purple-600 rounded-xl"
              onPress={handleContactOfficer}
            >
              <MessageCircle size={20} color="white" />
              <Text className="ml-2 font-semibold text-white font-geist">
                Contact Assigned Officer
              </Text>
            </TouchableOpacity>

            {/* Additional Actions */}
            <View className="flex-row justify-between">
              <TouchableOpacity className="items-center flex-1 p-3 mr-2 bg-gray-100 rounded-xl">
                <Phone size={20} color="#6b7280" />
                <Text className="mt-1 text-sm text-gray-600 font-geist">
                  Emergency Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center flex-1 p-3 ml-2 bg-gray-100 rounded-xl">
                <Mail size={20} color="#6b7280" />
                <Text className="mt-1 text-sm text-gray-600 font-geist">
                  Email Support
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default Report
