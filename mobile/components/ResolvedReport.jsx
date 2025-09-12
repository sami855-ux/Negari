import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated"
// import { launchImageLibrary } from "react-native-image-picker"
import { Check, Camera, X, ArrowRight, ArrowLeft } from "lucide-react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import ImagePickerComp from "./ImagePicker"
import { axiosInstance } from "../services/report"

const ResolveReportScreen = () => {
  const { reportId } = useLocalSearchParams()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [resolutionNote, setResolutionNote] = useState("")
  const [selectedImages, setSelectedImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)

  // Animation values
  const fadeAnim = useSharedValue(0)
  const slideAnim = useSharedValue(50)
  const successScale = useSharedValue(0)
  const checkScale = useSharedValue(0)

  const handleImageSelect = (uri) => {
    if (selectedImages.length < 4) {
      setSelectedImages((prev) => [...prev, uri])
    }
  }

  // Animate section entrance
  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 400 })
    slideAnim.value = withTiming(0, { duration: 400 })
  }, [currentStep])

  // Reset animations when step changes
  const resetAnimations = () => {
    fadeAnim.value = 0
    slideAnim.value = 50
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }))

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }))

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }))

  const handleNext = () => {
    if (currentStep === 1 && resolutionNote.trim()) {
      resetAnimations()
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      resetAnimations()
      setCurrentStep(1)
    }
  }

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("resolutionNote", resolutionNote)

      selectedImages.forEach((image, index) => {
        formData.append("resolutionImages", {
          uri: image.uri,
          type: image.type,
          name: image.fileName || `image_${index}.jpg`,
        })
      })

      const response = await axiosInstance.put(
        `/report/${reportId}/resolve`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      console.log(response)
      if (response.data.success) {
        setIsSuccess(true)
        successScale.value = withTiming(1, { duration: 300 })

        // Animate success check with bounce
        setTimeout(() => {
          checkScale.value = withSequence(
            withSpring(1.2, { damping: 8, stiffness: 200 }),
            withSpring(1, { damping: 8, stiffness: 200 })
          )
        }, 200)
      } else {
        throw new Error("Failed to resolve report")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resolve report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <Animated.View style={successAnimatedStyle} className="items-center">
          <Animated.View
            style={checkAnimatedStyle}
            className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-6"
          >
            <Check size={40} color="white" strokeWidth={3} />
          </Animated.View>
          <Text className="text-2xl font-bold text-gray-800 text-center font-jakarta">
            Report Resolved
          </Text>
          <Text className="text-gray-600 text-center mt-2 font-jakarta">
            Your resolution has been submitted successfully
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/worker/(tabs)")}
            className={`mt-6 py-4 px-6 rounded-lg space-x-2 flex-row items-center justify-center bg-blue-500 text-white`}
          >
            <ArrowLeft size={20} color="white" />
            <Text className={`font-semibold font-geist mr-2 text-white`}>
              Go to home
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 pt-12 pb-6 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            {currentStep > 1 && (
              <TouchableOpacity onPress={handleBack} className="p-2">
                <ArrowLeft size={24} color="#374151" />
              </TouchableOpacity>
            )}
            <Text className="text-xl font-bold text-gray-800 flex-1 text-center font-geist">
              Resolve Report
            </Text>
            <View className="w-10" />
          </View>

          {/* Progress indicator */}
          <View className="flex-row mt-4 space-x-2">
            {[1, 2, 3].map((step) => (
              <View
                key={step}
                className={`flex-1 h-2 rounded-full ${step <= currentStep ? "bg-blue-500" : "bg-gray-200"}`}
              />
            ))}
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Step 1: Resolution Note */}
          {currentStep === 1 && (
            <Animated.View style={animatedStyle}>
              <Text className="text-lg font-semibold text-gray-800 mb-2 font-geist">
                Resolution Note
              </Text>
              <Text className="text-gray-600 mb-4 font-jakarta">
                Describe how you resolved this report
              </Text>

              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-gray-800 min-h-32 font-jakarta"
                placeholder="Enter your resolution details..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={resolutionNote}
                onChangeText={setResolutionNote}
              />

              <TouchableOpacity
                onPress={handleNext}
                disabled={!resolutionNote.trim()}
                className={`mt-6 py-4 px-6 rounded-lg flex-row items-center justify-center ${
                  resolutionNote.trim() ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <Text
                  className={`font-semibold font-geist mr-2 ${resolutionNote.trim() ? "text-white" : "text-gray-500"}`}
                >
                  Next
                </Text>
                <ArrowRight
                  size={20}
                  color={resolutionNote.trim() ? "white" : "#6B7280"}
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Step 2: Image Upload */}
          {currentStep === 2 && (
            <Animated.View style={animatedStyle}>
              <Text className="text-lg font-semibold text-gray-800 mb-2 font-geist">
                Add Images
              </Text>
              <Text className="text-gray-600 mb-4 font-jakarta">
                Upload up to 5 images to support your resolution
              </Text>

              {/* Image Grid */}
              <View className="flex-row flex-wrap mb-4">
                {selectedImages.map((image, index) => (
                  <View key={index} className="w-20 h-20 mr-2 mb-2 relative">
                    <Image
                      source={{ uri: image.uri }}
                      className="w-full h-full rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                    >
                      <X size={12} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Add Image Button */}
                {selectedImages.length < 4 && (
                  <TouchableOpacity
                    onPress={() => setShowImagePicker(true)}
                    disabled={selectedImages.length >= 4}
                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center"
                  >
                    <Camera size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-sm text-gray-500 mb-6 font-geist">
                {selectedImages.length}/4 images selected
              </Text>

              <TouchableOpacity
                onPress={() => {
                  resetAnimations()
                  setCurrentStep(3)
                }}
                className={`mt-6 py-4 px-6 rounded-lg flex-row items-center justify-center ${
                  selectedImages.length ? "bg-blue-500" : "bg-gray-300"
                }`}
                disabled={!selectedImages.length}
              >
                <Text
                  className={`font-semibold font-geist mr-2 ${selectedImages.length ? "text-white" : "text-gray-500"}`}
                >
                  Continue
                </Text>
                <ArrowRight size={20} color="white" />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Step 3: Submit */}
          {currentStep === 3 && (
            <Animated.View style={animatedStyle}>
              <Text className="text-lg font-semibold text-gray-800 mb-4 font-geist">
                Review & Submit
              </Text>

              {/* Resolution Note Preview */}
              <View className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="font-medium text-gray-700 mb-2 font-jakarta">
                  Resolution Note:
                </Text>
                <Text className="text-gray-600 font-jakarta">
                  {resolutionNote}
                </Text>
              </View>

              {/* Images Preview */}
              {selectedImages.length > 0 && (
                <View className="bg-gray-50 p-4 rounded-lg mb-6">
                  <Text className="font-medium text-gray-700 mb-2 font-jakarta">
                    Images ({selectedImages.length}):
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {selectedImages.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image.uri }}
                        className="w-16 h-16 rounded-lg mr-2"
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`py-4 px-6 rounded-lg items-center ${isSubmitting ? "bg-gray-400" : "bg-green-500"}`}
              >
                <Text className="text-white font-semibold text-base font-jakarta">
                  {isSubmitting ? "Submitting..." : "Submit Resolution"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </View>

      <ImagePickerComp
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={handleImageSelect}
      />
    </SafeAreaView>
  )
}

export default ResolveReportScreen
