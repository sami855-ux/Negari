"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
} from "react-native"
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  VideoIcon,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  Plus,
  X,
  ChevronDown,
  Edit3,
  PencilRuler,
  Sparkles,
  ChevronUp,
  Map,
  UserX,
} from "lucide-react-native"
import ImagePickerComp from "@/components/ImagePicker"
import VideoPickerComponent from "../components/VideoPicker"
import { createReport } from "@/services/report"
import { useSelector } from "react-redux"

const categories = [
  "AI suggest",
  "Roads",
  "Water",
  "Electricity",
  "Crime",
  "Waste Management",
  "Public Transport",
  "Other",
]

const CreateScreen = () => {
  const { user } = useSelector((store) => store.auth)

  const [currentStep, setCurrentStep] = useState(1)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showVideoPicker, setShowVideoPicker] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "Roads",
      images: [],
      video: null,
      location: "Addis Ababa, Ethiopia",
      anonymous: false,
      date: new Date().toDateString(),
      time: new Date().toTimeString().slice(0, 5),
      visibility: "public",
      tags: [],
      newTag: "",
    },
  })

  const formValues = watch()
  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const nextStep = () =>
    currentStep < totalSteps && setCurrentStep(currentStep + 1)
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1)

  const handleImageSelect = (uri) => {
    if (formValues.images.length < 4) {
      setValue("images", [...formValues.images, uri])
    }
  }

  const handleVideoSelect = (uri) => {
    setValue("video", uri)
  }

  const removeImage = (index) => {
    const newImages = [...formValues.images]
    newImages.splice(index, 1)
    setValue("images", newImages)
  }

  const removeVideo = () => {
    setValue("video", null)
  }

  const addTag = () => {
    if (
      formValues.newTag.trim() &&
      !formValues.tags.includes(formValues.newTag.trim())
    ) {
      setValue("tags", [...formValues.tags, formValues.newTag.trim()])
      setValue("newTag", "")
    }
  }

  const removeTag = (tagToRemove) => {
    setValue(
      "tags",
      formValues.tags.filter((tag) => tag !== tagToRemove)
    )
  }

  const onSubmit = async (data) => {
    try {
      const reportData = {
        title: data.title,
        description: data.description,
        category: "INFRASTRUCTURE",
        imageUrls: data.images,
        videoUrl: data.video,
        location: {
          latitude: 9.0321,
          longitude: 38.7547,
          address: "Main Street, Addis Ababa",
          city: "Addis Ababa",
          region: "Addis Ababa",
        },
        severity: "HIGH",
        isAnonymous: data.anonymous,
        tags: data.tags,
        reporterId: user?.id,
      }

      const formData = new FormData()

      formData.append("title", reportData.title)
      formData.append("description", reportData.description)
      formData.append("category", reportData.category)
      formData.append("severity", reportData.severity)
      formData.append("isAnonymous", reportData.isAnonymous)
      formData.append("reporterId", reportData.reporterId)

      // JSON objects/arrays must be stringified
      formData.append("tags", JSON.stringify(reportData.tags))
      formData.append("location", JSON.stringify(reportData.location))

      // Handle images (can be File objects or Blobs)
      if (reportData.imageUrls && reportData.imageUrls.length > 0) {
        reportData.imageUrls.forEach((file) => {
          formData.append("images", file) // must be File/Blob
        })
      }

      // Handle video (single file)
      if (reportData.videoUrl) {
        formData.append("video", reportData.videoUrl) // must be File/Blob
      }

      console.log(JSON.stringify(reportData))

      const res = await createReport(formData)
      if (res.success) {
        Alert.alert("Success", "Report created successfully!")
        setCurrentStep(1)
        progress = 0
      } else {
        Alert.alert("Error", res.message)
      }
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const ProgressBar = () => (
    <View className="px-5 py-4">
      <View className="h-2 mb-2 bg-gray-200 rounded-full">
        <View
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: "#7C3AED" }}
        />
      </View>
      <Text className="text-center text-gray-500 font-geist">
        Step <Text className="font-semibold text-[#7C3AED]">{currentStep}</Text>{" "}
        of {totalSteps}
      </Text>
    </View>
  )

  const NavigationButtons = () => (
    <View className="flex-row justify-between px-6 mt-6 mb-4">
      {/* Back Button */}
      <TouchableOpacity
        onPress={prevStep}
        disabled={currentStep === 1}
        className={`flex-row items-center px-9 py-2 rounded-lg border ${
          currentStep === 1
            ? "bg-gray-200 border-gray-200"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <ArrowLeft
          size={20}
          color={currentStep === 1 ? "#94A3B8" : "#64748B"}
        />
        <Text
          className={`ml-2 text-[15px] font-geist ${
            currentStep === 1 ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Back
        </Text>
      </TouchableOpacity>

      {/* Next / Submit Button */}
      <TouchableOpacity
        onPress={currentStep === totalSteps ? handleSubmit(onSubmit) : nextStep}
        className="flex-row items-center py-2 space-x-2 rounded-lg px-9 "
        style={{
          backgroundColor: "#7C3AED",
        }}
      >
        <Text className="text-white text-[15px] font-geist">
          {currentStep === totalSteps ? "Submit Report" : "Next"}
        </Text>
        {currentStep !== totalSteps && (
          <ArrowRight size={14} color="#FFFFFF" className="ml-2" />
        )}
      </TouchableOpacity>
    </View>
  )

  const renderStep1 = () => (
    <ScrollView className="px-5 pt-5">
      <Text className="mb-2 text-base font-semibold text-gray-900 font-geist">
        Title of Issue
        <Text className="text-red-600">*</Text>
      </Text>
      <Controller
        control={control}
        rules={{ required: true }}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="h-10 px-4 py-5 mb-2 text-gray-900 bg-white border border-gray-100 rounded-md font-geist"
            placeholder="Brief summary of the issue"
            placeholderTextColor="#94A3B8"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.title && (
        <Text className="mb-4 text-sm text-red-500">Title is required</Text>
      )}
      <Text className="mb-6 text-sm text-gray-500 font-geist">
        <Text className="text-red-500">Remember: </Text> Keep it understandable,
        short and descriptive.
      </Text>
    </ScrollView>
  )

  const renderStep2 = () => (
    <ScrollView className="px-5 pt-5">
      <Text className="mb-2 text-base font-semibold text-gray-900 font-geist">
        Description
      </Text>
      <Controller
        control={control}
        name="description"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="h-40 px-4 py-4 mb-2 text-gray-900 bg-white border border-gray-100 rounded-md font-geist"
            placeholder="Explain the problem in detail..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      {errors.description && (
        <Text className="mb-4 text-sm text-red-500">
          Description is required
        </Text>
      )}
      <Text className="mb-6 text-sm text-gray-500 font-geist">
        Provide as many details as possible.
      </Text>

      <Text className="mt-6 mb-2 text-base font-semibold text-gray-900 font-geist">
        Category
      </Text>
      <View className="relative z-10">
        <TouchableOpacity
          className="flex-row items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-md"
          onPress={() => setIsOpen(!isOpen)}
        >
          <View className="flex-1">
            {formValues.category === "AI suggest" ? (
              <View className="flex-row items-center">
                <Sparkles size={16} color="#7C3AED" />
                <Text
                  className="text-[#d7c6f4] text-sm ml-2 font-geist"
                  style={{
                    color: "#7C3AED",
                  }}
                >
                  Let the AI detect
                </Text>
              </View>
            ) : (
              <Text className="text-sm text-gray-800 font-geist">
                {formValues.category}
              </Text>
            )}
          </View>
          {isOpen ? (
            <ChevronUp size={20} color="#64748B" />
          ) : (
            <ChevronDown size={20} color="#64748B" />
          )}
        </TouchableOpacity>

        {isOpen && (
          <View className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg top-14">
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                className={`flex-row items-center px-4 py-2 ${formValues.category === item ? "bg-gray-50" : ""}`}
                onPress={() => {
                  setValue("category", item)
                  setIsOpen(false)
                }}
              >
                {item === "AI suggest" ? (
                  <View className="flex-row items-center">
                    <Sparkles size={16} color="#7C3AED" />
                    <Text
                      className="ml-2 text-sm font-geist"
                      style={{
                        color: "#7C3AED",
                      }}
                    >
                      Let the AI detect
                    </Text>
                  </View>
                ) : (
                  <Text className="text-sm text-gray-800 font-geist">
                    {item}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )

  const renderStep3 = () => (
    <ScrollView className="px-5 pt-5">
      <Text className="mb-2 text-base font-semibold text-gray-800 font-geist">
        Upload Media
      </Text>
      <Text className="mb-4 text-sm text-gray-500 font-geist">
        You can upload up to 4 images and a video
      </Text>

      {/* Video Preview */}
      {formValues.video && (
        <View className="relative mb-4">
          <View className="items-center justify-center w-full h-40 bg-gray-100 rounded-lg">
            <VideoIcon size={40} color="#64748B" />
          </View>
          <TouchableOpacity
            className="absolute items-center justify-center w-6 h-6 bg-red-500 rounded-full -top-2 -right-2"
            onPress={removeVideo}
          >
            <X size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Upload Buttons */}
      <View className="flex-row items-center justify-center mb-6 space-x-4">
        {/* Image Button */}
        <TouchableOpacity
          className={`w-44 flex-row items-center justify-center py-4 border border-dashed border-gray-200 rounded-md bg-white ${
            formValues.images.length >= 4 ? "opacity-50" : "hover:bg-blue-50"
          }`}
          onPress={() => setShowImagePicker(true)}
          disabled={formValues.images.length >= 4}
          style={{ borderColor: "#d7c6f4" }}
        >
          <Camera size={24} color="#7C3AED" />
          <View className="flex flex-col items-center pt-1 ml-2">
            <Text className="text-blue-500 font-geist">
              {formValues.images.length > 0 ? "Add More Photos" : "Add Photos"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Video Button */}
        <TouchableOpacity
          className={`w-44 flex-row items-center justify-center py-4 border  border-gray-200 rounded-md bg-white  ${
            formValues.video ? "opacity-50" : "hover:bg-gray-100"
          }`}
          onPress={() => setShowVideoPicker(true)}
          disabled={!!formValues.video}
          style={{ borderColor: "#d7c6f4" }}
        >
          <VideoIcon size={24} color="#7C3AED" />
          <Text className="ml-2 text-blue-500 font-geist">
            {formValues.video ? "Video Added" : "Add Video"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Previews */}
      {formValues.images.length > 0 && (
        <View className="flex-row flex-wrap gap-3 mb-4">
          {formValues.images.map((uri, index) => (
            <View key={index} className="relative">
              <Image source={{ uri }} className="w-40 h-40 rounded-lg" />
              <TouchableOpacity
                className="absolute items-center justify-center w-6 h-6 bg-red-500 rounded-full -top-2 -right-2"
                onPress={() => removeImage(index)}
              >
                <X size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )

  const renderStep4 = () => (
    <ScrollView className="px-5 pt-5">
      <Text className="mb-3 text-base font-medium text-gray-800 font-geist">
        Location of Issue
      </Text>
      <View className="flex-row gap-3 mb-3">
        <TouchableOpacity className="flex-row items-center justify-center flex-1 py-3 bg-green-100 border border-gray-200 rounded-md">
          <MapPin size={20} color={"#f3c53c"} />
          <Text className="ml-2 text-green-500 font-geist">
            Use Current Location
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-center flex-1 py-3 border border-gray-200 rounded-md">
          <Map size={20} className="text-[#f3c53c]" color={"#f3c53c"} />
          <Text className="ml-2 text-green-500 font-geist">Pick on Map</Text>
        </TouchableOpacity>
      </View>
      <Text className="mb-6 text-sm text-gray-500 font-jakarta">
        Selected: {formValues.location}
      </Text>

      <View className="flex-row items-center justify-between py-4 mb-6 bg-white border border-gray-100 rounded-xl">
        <View className="flex-row items-center">
          <View className="items-center justify-center w-10 h-10 mr-3 rounded-lg bg-indigo-50">
            <UserX size={20} color="#4F46E5" />
          </View>
          <View>
            <Text className="text-gray-900 font-medium text-[15px] font-geist">
              Anonymous Mode
            </Text>
            <Text className="text-xs text-gray-400 font-geist">
              Keep your identity private
            </Text>
          </View>
        </View>
        <Controller
          control={control}
          name="anonymous"
          render={({ field: { onChange, value } }) => (
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{
                false: "#E2E8F0",
                true: "#10B981",
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E8F0"
              style={{
                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
              }}
            />
          )}
        />
      </View>

      <View className="my-9">
        <Text className="mb-3 text-base font-medium tracking-wider text-gray-800 font-geist">
          Time of Issue
        </Text>
        <View className="flex-row gap-3">
          {/* Date Picker */}
          <TouchableOpacity
            className="flex-row items-center flex-1 px-4 py-3 bg-white border border-gray-100 rounded-xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="items-center justify-center w-10 h-10 py-2 mr-3 bg-blue-50 rounded-xl">
              <Calendar size={16} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-xs text-gray-500 font-geist">Date</Text>
              <Text className="font-medium text-gray-800 font-geist">
                {formValues.date}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Time Picker */}
          <TouchableOpacity
            className="flex-1 flex-row items-center py-3.5 px-4 border border-gray-100 rounded-xl bg-white"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="items-center justify-center w-8 h-8 mr-3 rounded-lg bg-blue-50">
              <Clock size={16} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-xs text-gray-500 font-geist">Time</Text>
              <Text className="font-medium text-gray-900 font-geist">
                {formValues.time}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )

  const renderStep5 = () => (
    <ScrollView className="px-5 pt-5">
      <Text className="mb-3 text-base font-medium text-gray-800 font-geist">
        Tags
      </Text>
      <View className="flex-row mb-3 space-x-3">
        <Controller
          control={control}
          name="newTag"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="flex-1 px-4 py-2 text-gray-800 bg-white border border-gray-200 rounded-md font-geist "
              placeholder="Add a tag..."
              placeholderTextColor="#94A3B8"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <TouchableOpacity
          className="items-center justify-center w-10 h-10 ml-4 bg-blue-500 rounded-md"
          style={{ backgroundColor: "#7C3AED" }}
          onPress={addTag}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {formValues.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-6">
          {formValues.tags.map((tag, index) => (
            <View
              key={index}
              className="flex-row items-center px-3 py-1.5 bg-blue-50 rounded-full"
            >
              <Text className="text-sm font-medium text-blue-500 font-geist">
                #{tag}
              </Text>
              <TouchableOpacity className="ml-1" onPress={() => removeTag(tag)}>
                <X size={14} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Text className="my-3 text-base font-medium text-gray-800 font-geist">
        Review Your Report
      </Text>
      <View className="p-4 mb-6 bg-white rounded-xl">
        <View className="mb-3">
          <Text className="text-sm text-gray-500 font-geist">Title</Text>
          <Text className="text-gray-900 font-jakarta">
            {formValues.title || "Not provided"}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500 font-geist">Description</Text>
          <Text className="text-gray-900 font-jakarta" numberOfLines={3}>
            {formValues.description || "Not provided"}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500 font-geist">Category</Text>
          <Text className="text-gray-900 font-jakarta">
            {formValues.category}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500 font-geist">Location</Text>
          <Text className="text-gray-900 font-jakarta">
            {formValues.location}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500 font-geist">Anonymous</Text>
          <Text className="text-gray-900 font-jakarta">
            {formValues.anonymous ? "Yes" : "No"}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500 font-geist">Visibility</Text>
          <Text className="text-gray-900 font-jakarta">
            {formValues.visibility === "public" ? "Public" : "Private"}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-gray-500 font-geist">Tags</Text>
          <Text className="text-gray-900 font-jakarta">
            {formValues.tags.length > 0
              ? formValues.tags.map((tag) => `#${tag}`).join(", ")
              : "None"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center py-3 mb-6 bg-white border border-gray-200 rounded-md"
        style={{ backgroundColor: "#7C3AED" }}
        onPress={() => setCurrentStep(1)}
      >
        <PencilRuler size={20} color="white" />
        <Text className="ml-2 font-medium text-white font-geist">
          Edit Report
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      default:
        return renderStep1()
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity className="p-2 rounded-lg">
          <ArrowLeft size={24} color="gray" />
        </TouchableOpacity>
        <Text className="text-[16px] text-gray-800 font-geist">
          Create Report
        </Text>
        <View className="w-10" />
      </View>

      <ProgressBar />
      <View className="flex-1">{renderCurrentStep()}</View>
      <NavigationButtons />

      <ImagePickerComp
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={handleImageSelect}
      />

      <VideoPickerComponent
        visible={showVideoPicker}
        onClose={() => setShowVideoPicker(false)}
        onVideoSelected={handleVideoSelect}
      />
    </SafeAreaView>
  )
}

export default CreateScreen
