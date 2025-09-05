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
import { Camera, ImageIcon, X } from "lucide-react-native"
import * as ImageManipulator from "expo-image-manipulator"

const ImagePickerComp = ({ visible, onClose, onImageSelected }) => {
  const handlePick = async (fromCamera) => {
    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          })

      if (result.canceled) return

      // Resize & compress
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      )

      let finalUri = manipResult.uri

      // Handle web blob URLs
      if (Platform.OS === "web") {
        const response = await fetch(manipResult.uri)
        const blob = await response.blob()
        // Convert blob to a File object
        const file = new File([blob], "upload.jpg", { type: blob.type })
        // Send file to parent
        onImageSelected(file)
        console.log(file)
      } else {
        // Mobile: send local file path
        onImageSelected(finalUri)
        console.log(finalUri)
      }
    } catch (error) {
      console.error("Image pick error:", error)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View className="absolute bottom-0 w-full px-6 pt-4 pb-8 bg-white shadow-lg rounded-t-3xl">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-800 font-geist">
            Select Image
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Take Photo */}
        <TouchableOpacity
          className="flex-row items-center p-4 mb-3 space-x-4 border border-blue-100 bg-blue-50 rounded-lg"
          onPress={() => handlePick(true)}
          activeOpacity={0.8}
        >
          <View className="p-2 bg-blue-100 rounded-xl">
            <Camera size={22} className="text-amber-700" />
          </View>
          <View>
            <Text className="text-base font-medium text-gray-800 font-geist">
              Take Photo
            </Text>
            <Text className="text-sm text-gray-500 font-jakarta">
              Capture a new image
            </Text>
          </View>
        </TouchableOpacity>

        {/* Choose from Gallery */}
        <TouchableOpacity
          className="flex-row items-center p-4 space-x-4 border border-purple-100 bg-purple-50 rounded-xl"
          onPress={() => handlePick(false)}
          activeOpacity={0.8}
        >
          <View className="p-2 bg-purple-100 rounded-xl">
            <ImageIcon size={22} className="text-blue-700" />
          </View>
          <View>
            <Text className="text-base font-medium text-gray-800 font-geist">
              Choose from Gallery
            </Text>
            <Text className="text-sm text-gray-500 font-jakarta">
              Select from your photos
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default ImagePickerComp
