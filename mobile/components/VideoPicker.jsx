import React from "react"
import {
  Modal,
  Pressable,
  TouchableOpacity,
  Text,
  View,
  Platform,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Video, Camera, X } from "lucide-react-native"

const VideoPickerComponent = ({ visible, onClose, onVideoSelected }) => {
  const handlePick = async (fromCamera) => {
    onClose()
    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 0.7, // compress video a bit
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 0.7,
          })

      if (result.canceled) return

      let finalUri = result.assets[0].uri

      // If needed, handle web Blob conversion
      if (Platform.OS === "web") {
        const response = await fetch(finalUri)
        const blob = await response.blob()
        const file = new File([blob], "upload.mp4", { type: blob.type })
        onVideoSelected(file)
        console.log(file)
      } else {
        // Mobile: pass local file path
        onVideoSelected(finalUri)
        console.log(finalUri)
      }
    } catch (error) {
      console.error("Video picker error:", error)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />

      {/* Picker Container */}
      <View className="absolute bottom-0 w-full p-6 bg-white shadow-lg rounded-t-3xl">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-800 font-geist">
            Select Video
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View className="space-y-4">
          {/* Record Video Option */}
          <TouchableOpacity
            className="flex-row items-center p-4 mb-4 border border-green-100 rounded-lg bg-green-50"
            onPress={() => handlePick(true)}
            activeOpacity={0.8}
          >
            <View className="p-2 mr-4 bg-green-100 rounded-xl">
              <Camera size={22} color="#16a34a" />
            </View>
            <View>
              <Text className="text-base font-medium text-gray-800 font-geist">
                Record Video
              </Text>
              <Text className="text-sm text-gray-500 font-jakarta">
                Capture a new video
              </Text>
            </View>
          </TouchableOpacity>

          {/* Gallery Option */}
          <TouchableOpacity
            className="flex-row items-center p-4 border border-purple-100 rounded-lg bg-purple-50"
            onPress={() => handlePick(false)}
            activeOpacity={0.8}
          >
            <View className="p-2 mr-4 bg-purple-100 rounded-xl">
              <Video size={22} color="#8b5cf6" />
            </View>
            <View>
              <Text className="text-base font-medium text-gray-800 font-geist">
                Choose from Gallery
              </Text>
              <Text className="text-sm text-gray-500 font-jakarta">
                Select an existing video
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default VideoPickerComponent
