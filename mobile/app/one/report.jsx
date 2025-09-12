"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import {
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  MessageCircle,
  Phone,
  Mail,
  Tag,
  ChevronLeft,
  Eye,
  Star,
  Send,
  ThumbsUp,
} from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  ZoomIn,
} from "react-native-reanimated"
import { getReportById ,feedBackOnReport} from "../../services/report"

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const FeedbackModal = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a rating before submitting.")
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ rating, comment })
      setRating(0)
      setComment("")
      onClose()
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <Animated.View entering={SlideInRight.duration(300)} className="bg-white rounded-t-3xl p-6 min-h-[400px]">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center font-jakarta">Rate This Resolution</Text>

          {/* Star Rating */}
          <View className="flex-row justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} className="mx-1">
                <Star
                  size={32}
                  color={star <= rating ? "#FFD700" : "#E5E7EB"}
                  fill={star <= rating ? "#FFD700" : "transparent"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment Input */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-3 font-geist">Additional Comments </Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Share your thoughts about the resolution..."
              multiline
              numberOfLines={4}
              className="border border-gray-200 rounded-xl p-4 text-gray-700 bg-gray-50 font-geist"
              textAlignVertical="top"
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={onClose} className="flex-1 py-4 bg-gray-100 rounded-xl">
              <Text className="text-center text-gray-600 font-semibold font-geist">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || !comment}
              className="flex-1 py-4 bg-purple-600 rounded-xl flex-row items-center justify-center"
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Send size={18} color="white" />
                  <Text className="text-white font-semibold ml-2 font-geist">Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const Report = () => {
  const { reportId } = useLocalSearchParams()
  const router = useRouter()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)

  // Animation values
  const headerOpacity = useSharedValue(0)
  const contentTranslateY = useSharedValue(50)

  useEffect(() => {
    fetchReport()
  }, [reportId])

  useEffect(() => {
    if (!loading) {
      // Animate header and content
      headerOpacity.value = withTiming(1, { duration: 600 })
      contentTranslateY.value = withSpring(0, { damping: 15 })
    }
  }, [loading])

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

  const handleFeedbackSubmit = async ({ rating, comment }) => {
    // Implement the feedback submission logic here
    // This would call your backend API similar to the controller you provided
    try {
      const response = await feedBackOnReport(reportId, {
        rating, comment
      }) 

      if (response.success) {
        Alert.alert("Success", "Thank you for your feedback!")
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      throw error
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

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }))

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }))

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gradient-to-br from-purple-50 to-blue-50">
        <Animated.View entering={ZoomIn.duration(400)} className="items-center">
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text className="mt-4 text-gray-600 font-medium text-lg font-jakarta">Loading report details...</Text>
        </Animated.View>
      </View>
    )
  }

  if (!report) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <Animated.View entering={FadeInUp.duration(400)} className="items-center">
          <Text className="text-gray-600 text-lg mb-4 font-jakarta">Report not found</Text>
          <TouchableOpacity className="px-6 py-3 bg-purple-600 rounded-full" onPress={() => router.back()}>
            <Text className="text-white font-semibold font-jakarta">Go Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-gray-50">
        {/* Animated Header */}
        <Animated.View style={headerAnimatedStyle} className="bg-white border-b border-gray-100">
          <LinearGradient
            colors={["#7C3AED", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-4 py-4 "
          >
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => router.back()} className="mr-4">
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-white flex-1 font-geist">Report Details</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View style={contentAnimatedStyle}>
            {/* Report Images with Animation */}
            {report.imageUrls && report.imageUrls.length > 0 && (
              <Animated.View entering={FadeInDown.delay(200).duration(600)} className="mb-6">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-3">
                  {report.imageUrls.map((imageUrl, index) => (
                    <Animated.View
                      key={index}
                      entering={SlideInRight.delay(300 + index * 100).duration(500)}
                      className="ml-4 mr-4 overflow-hidden rounded-md"
                    >
                      <Image source={{ uri: imageUrl }} className="w-80 h-64" resizeMode="cover" />
                    </Animated.View>
                  ))}
                </ScrollView>
              </Animated.View>
            )}

            {/* Main Content */}
            <View className="px-4 pb-8">
              {/* Title and Status */}
              <Animated.View entering={FadeInDown.delay(400).duration(600)} className="mb-6">
                <Text className="mb-3 text-3xl font-bold text-gray-800 leading-tight font-geist">{report.title}</Text>
                <View className="flex-row flex-wrap">
                  <View
                    className={`px-4 py-2 rounded-full ${getStatusColor(report.status)} flex-row items-center mr-3 mb-2 shadow-sm`}
                  >
                    {getStatusIcon(report.status)}
                    <Text className="ml-2 text-sm text-white capitalize font-semibold font-jakarta">
                      {report.status.toLowerCase()}
                    </Text>
                  </View>
                  <View
                    className={`px-4 py-2 rounded-full ${getSeverityColor(report.severity)} flex-row items-center mr-3 mb-2 shadow-sm`}
                  >
                    <AlertTriangle size={14} color="white" />
                    <Text className="ml-2 text-sm text-white capitalize font-semibold font-jakarta">
                      {report.severity.toLowerCase()}
                    </Text>
                  </View>
                </View>
              </Animated.View>

              {/* Description */}
              <Animated.View entering={FadeInDown.delay(500).duration(600)} className="mb-6">
                <View className="bg-white p-5 rounded-lg border border-gray-100">
                  <Text className="mb-3 text-lg font-semibold text-gray-800 font-geist">Description</Text>
                  <Text className="leading-7 text-gray-600 text-base font-geist">{report.description}</Text>
                </View>
              </Animated.View>

              {/* AI Analysis Section */}
              <Animated.View entering={FadeInDown.delay(600).duration(600)} className="mb-6">
                <LinearGradient
                  colors={["#EBF4FF", "#DBEAFE"]}
                  className="p-5 rounded-lg border border-blue-200 "
                >
                  <Text className="mb-4 text-lg font-semibold text-blue-800 font-geist"> AI Analysis</Text>
                  <View className="flex-row justify-between mb-4">
                    <View className="items-center">
                      <Text className="text-3xl font-bold text-blue-600">
                        {(report.confidenceScore * 100).toFixed(0)}%
                      </Text>
                      <Text className="text-sm text-blue-500 font-medium font-geist">Confidence</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-3xl font-bold text-blue-600">
                        {(report.toxicityScore * 100).toFixed(0)}%
                      </Text>
                      <Text className="text-sm text-blue-500 font-medium font-geist">Toxicity</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-3xl font-bold text-blue-600">{(report.spamScore * 100).toFixed(0)}%</Text>
                      <Text className="text-sm text-blue-500 font-medium font-geist">Spam Score</Text>
                    </View>
                  </View>
                  <View className="p-4 bg-white rounded-xl">
                    <Text className="text-sm text-blue-700 leading-6 font-jakarta">
                      Our AI system has analyzed this report and found it to be highly credible with low risk of spam or
                      toxic content.
                    </Text>
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Resolution Section with Feedback UI */}
              {report.status === "RESOLVED" && (
                <Animated.View entering={FadeInDown.delay(700).duration(600)} className="mb-6">
                  <LinearGradient
                    colors={["#ECFDF5", "#D1FAE5"]}
                    className="p-5 rounded-lg border border-green-200 "
                  >
                    <Text className="mb-3 text-lg font-semibold text-green-800 font-geist">Resolution Details</Text>
                    {report.resolutionNote && (
                      <>
                        <Text className="mb-2 text-green-700 font-medium font-geist">
                          Resolved on: {formatDate(report.resolvedAt)}
                        </Text>
                        <Text className="text-green-700 leading-6 mb-4 font-geist">{report.resolutionNote}</Text>
                      </>
                    )}

                    {/* Feedback Button - Only shows when status is RESOLVED */}
                    <AnimatedTouchableOpacity
                      entering={ZoomIn.delay(800).duration(400)}
                      onPress={() => setShowFeedback(true)}
                      className="bg-green-600 p-4 rounded-xl flex-row items-center justify-center"
                    >
                      <ThumbsUp size={20} color="white" />
                      <Text className="text-white font-semibold ml-2 text-base font-geist">Rate This Resolution</Text>
                    </AnimatedTouchableOpacity>
                  </LinearGradient>
                </Animated.View>
              )}

              {/* Metadata */}
              <Animated.View entering={FadeInDown.delay(800).duration(600)} className="mb-6">
                <View className="bg-white p-5 rounded-lg border border-gray-100">
                  <Text className="mb-4 text-lg font-semibold text-gray-800 font-geist">Report Details</Text>
                  <View className="space-y-4">
                    <View className="flex-row items-center">
                      <Clock size={18} color="#6b7280" />
                      <Text className="ml-3 text-gray-600 font-geist">Created: {formatDate(report.createdAt)}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock size={18} color="#6b7280" />
                      <Text className="ml-3 text-gray-600 font-geist">Updated: {formatDate(report.updatedAt)}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <MapPin size={18} color="#6b7280" />
                      <Text className="ml-3 text-gray-600 font-geist">
                        Location: {report.locationId ? `${report.location.city} ${report.location.region}` : "Unknown"}
                      </Text>
                    </View>
                    {report.tags && report.tags.length > 0 && (
                      <View className="flex-row items-start">
                        <Tag size={18} color="#6b7280" className="mt-1" />
                        <View className="flex-row flex-wrap ml-3">
                          {report.tags.map((tag, index) => (
                            <View key={index} className="px-3 py-1 mb-2 mr-2 bg-purple-100 rounded-full">
                              <Text className="text-xs text-purple-700 font-medium font-geist">#{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </Animated.View>

              {/* Action Buttons */}
              <Animated.View entering={FadeInDown.delay(900).duration(600)} className="space-y-4">
                <TouchableOpacity
                  className="bg-purple-600 p-4 rounded-2xl flex-row items-center justify-center shadow-lg"
                  onPress={handleContactOfficer}
                >
                  <MessageCircle size={20} color="white" />
                  <Text className="ml-3 font-semibold text-white text-base font-geist">Contact Assigned Officer</Text>
                </TouchableOpacity>

              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  )
}

export default Report
