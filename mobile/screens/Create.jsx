import { useEffect, useState } from "react"
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
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
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
import { getCategories } from "../services/category"
// import LocationPicker from "../components/LocationPicker"
import DateTimePickerComponent from "../components/DateTimePicker"
import InfoModal from "../utils/InfoModal"
import { storage } from "../store/slices/auth"

const CreateScreen = () => {
  const [user, setUser] = useState(null)

  const [categories, setCategories] = useState([])
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)

  const [currentStep, setCurrentStep] = useState(1)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showVideoPicker, setShowVideoPicker] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState("success") // "success" | "error" | "warning" | "info"
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "AI suggest",
      images: [],
      video: null,
      location: {},
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
  const handleGetCategories = async () => {
    try {
      setIsCategoryLoading(true)

      const res = await getCategories()

      setCategories(res)
      // setCategories((prv) => [...prv, "AI suggest"])
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsCategoryLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const reportData = {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrls: data.images,
        videoUrl: data.video,
        location: {
          latitude: 9.03,
          longitude: 38.74,
          address: "Main Street, Downtown",
          city: "Addis Ababa",
          region: "Nifas Silk-Lafto",
        },
        severity: "HIGH",
        isAnonymous: data.anonymous,
        tags: data.tags,
        reporterId: user?.id,
        useAiCategory: data.category === "AI suggest",
      }

      const formData = new FormData()

      formData.append("title", reportData.title)
      formData.append("description", reportData.description)
      formData.append("category", reportData.category)
      formData.append("severity", reportData.severity)
      formData.append("isAnonymous", reportData.isAnonymous)
      formData.append("useAiCategory", reportData.useAiCategory)
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
        setModalType("success")
        setModalTitle("Success")
        setModalMessage("Report created successfully!")
        setModalVisible(true)
        setCurrentStep(1)

        reset()
      } else {
        setModalType("error")
        setModalTitle("Error1")
        setModalMessage(res.message || "Something went wrong.")
        setModalVisible(true)
      }
    } catch (error) {
      console.log(error)
      setModalType("error")
      setModalTitle("Error2")
      setModalMessage(error.message || "Something went wrong.")
      setModalVisible(true)
    }
  }

  const handlePress = async () => {
    if (currentStep === totalSteps) {
      // Only for the final step
      setIsSubmitting(true)
      try {
        await handleSubmit(onSubmit)()
      } catch (err) {
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      nextStep()
    }
  }

  useEffect(() => {
    handleGetCategories()
  }, [])

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
        onPress={handlePress}
        className="flex-row items-center py-2 space-x-2 rounded-lg px-9"
        style={{
          backgroundColor: "#7C3AED",
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text className="text-white text-[15px] font-geist pl-2">
              Submitting...
            </Text>
          </>
        ) : (
          <>
            <Text className="text-white text-[15px] font-geist">
              {currentStep === totalSteps ? "Submit report" : "Next"}
            </Text>
            {currentStep !== totalSteps && (
              <ArrowRight size={14} color="#FFFFFF" className="ml-2" />
            )}
          </>
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
        key={`title-${1}`}
        control={control}
        rules={{ required: true }}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="px-4 mb-2 text-gray-900 bg-white border border-gray-100 rounded-md h-14 font-geist"
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
        key={`description-${1}`}
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
                  style={{ color: "#7C3AED" }}
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
          <View className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg top-14 max-h-56">
            {isCategoryLoading ? (
              <View className="flex-row items-center justify-center py-4">
                <ActivityIndicator size="small" color="#7C3AED" />
                <Text className="ml-2 text-sm text-gray-500 font-geist">
                  Loading categories...
                </Text>
              </View>
            ) : categories.length > 0 ? (
              categories.map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`flex-row items-center px-4 py-2 ${
                    formValues.category === item ? "bg-gray-50" : ""
                  }`}
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
                        style={{ color: "#7C3AED" }}
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
              ))
            ) : (
              <Text className="px-4 py-3 text-sm text-gray-500 font-geist">
                No categories available
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )

  const renderStep3 = () => (
    <ScrollView className="px-5 pt-5" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="mb-2 text-lg font-semibold text-gray-800 font-geist">
          Upload Media
        </Text>
        <Text className="mb-4 text-base text-gray-500 font-geist">
          Add visual evidence to help us understand the issue better
        </Text>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-2 overflow-hidden bg-gray-100 rounded-full">
            <LinearGradient
              colors={["#a855f7", "#3b82f6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: "100%",
                width: `${(formValues.images.length / 4) * 100}%`,
                borderRadius: 999,
              }}
            />
          </View>
          <Text className="ml-3 text-xs font-medium text-gray-500 font-geist">
            {" "}
            {formValues.images.length}/4 photos
          </Text>
        </View>
      </View>

      {/* Video Preview */}
      {formValues.video && (
        <View className="relative mb-6 overflow-hidden bg-gray-100 rounded-xl">
          <View className="items-center justify-center w-full h-48">
            <VideoIcon size={40} color="#7C3AED" />
            <Text className="mt-2 text-sm font-medium text-gray-600 font-geist">
              Video added
            </Text>
          </View>
          <TouchableOpacity
            className="absolute items-center justify-center w-8 h-8 bg-red-500 rounded-full shadow-md -top-2 -right-2"
            onPress={removeVideo}
            activeOpacity={0.8}
          >
            <X size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* Upload Buttons */}
      <View className="flex-row gap-4 mb-8">
        {/* Image Upload */}
        <TouchableOpacity
          className={`flex-1 h-32 w-32 rounded-xl border-2 border-dashed p-4 items-center justify-center bg-white ${
            formValues.images.length >= 4
              ? "opacity-50 border-gray-200"
              : "border-purple-300 active:bg-purple-50"
          }`}
          onPress={() => setShowImagePicker(true)}
          disabled={formValues.images.length >= 4}
          activeOpacity={0.75}
          style={{
            shadowColor: "#000",
          }}
        >
          <View className="items-center justify-center w-12 h-12 mb-2 bg-purple-100 rounded-full">
            <Camera size={24} color="#7C3AED" />
          </View>
          <Text className="text-base font-medium text-center text-purple-700 font-geist">
            {formValues.images.length > 0 ? "Add More" : "Add Photos"}
          </Text>
          <Text className="mt-1 text-sm text-center text-gray-500 font-geist">
            {formValues.images.length >= 4
              ? "Maximum reached"
              : `${4 - formValues.images.length} remaining`}
          </Text>
        </TouchableOpacity>

        {/* Video Upload */}
        <TouchableOpacity
          className={`flex-1 h-32 rounded-xl border-2 border-[#3B82F6] p-4 items-center justify-center bg-white ${
            formValues.video
              ? "bg-[#10B981] border-[#10B981]"
              : "border-[#3B82F6] active:bg-blue-50"
          }`}
          onPress={() => setShowVideoPicker(true)}
          disabled={!!formValues.video}
          activeOpacity={0.75}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View
            className={`w-12 h-12 mb-2 rounded-full items-center justify-center ${
              formValues.video ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            <VideoIcon
              size={24}
              color={formValues.video ? "#10B981" : "#3B82F6"}
            />
          </View>
          <Text
            className={`text-base font-medium text-center font-geist ${
              formValues.video ? "text-green-700" : "text-blue-700"
            }`}
          >
            {formValues.video ? "Video Added" : "Add Video"}
          </Text>
          <Text className="mt-1 text-xs text-center text-gray-500 font-geist">
            {formValues.video ? "Tap to replace" : "Optional"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Previews */}
      {formValues.images.length > 0 && (
        <View className="mb-6">
          <Text className="mb-3 text-sm font-medium text-gray-700 font-geist">
            Your Photos ({formValues.images.length})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-4"
          >
            {formValues.images.map((uri, index) => (
              <View key={index} className="relative mr-4">
                <Image
                  source={{ uri }}
                  className="w-32 h-32 shadow-sm rounded-xl"
                />
                <TouchableOpacity
                  className="absolute items-center justify-center bg-red-500 rounded-full shadow-md w-7 h-7 -top-2 -right-2"
                  onPress={() => removeImage(index)}
                  activeOpacity={0.8}
                >
                  <X size={14} color="#FFFFFF" />
                </TouchableOpacity>
                <View className="absolute bottom-0 left-0 right-0 p-1 bg-black bg-opacity-40 rounded-b-xl">
                  <Text className="text-xs text-center text-white font-geist">
                    Photo {index + 1}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Help Text */}
      <View className="p-4 bg-blue-50 rounded-xl">
        <Text className="text-sm text-blue-800 font-geist">
          <Text className="font-semibold">Tip:</Text> Clear photos and videos
          help us resolve your issue faster.
        </Text>
      </View>
    </ScrollView>
  )

  const renderStep4 = () => (
    <ScrollView className="px-5 pt-5">
      {/* <LocationPicker setValue={setValue} /> */}

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

      <DateTimePickerComponent formValues={formValues} setValue={setValue} />
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
            {formValues.location.address}, {formValues.location.city}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500 font-geist">Anonymous</Text>
          <Text className="text-gray-900 font-jakarta">
            {formValues.anonymous ? "Yes" : "No"}
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
    <>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        {/* <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity className="p-2 rounded-lg">
            <ArrowLeft size={24} color="gray" />
          </TouchableOpacity>
          <Text className="text-[16px] text-gray-800 font-geist">
            Create Report
          </Text>
          <View className="w-10" />
        </View> */}

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

      <InfoModal
        visible={modalVisible}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        buttonText="OK"
      />
    </>
  )
}

export default CreateScreen
