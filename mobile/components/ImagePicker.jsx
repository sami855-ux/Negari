import React from "react"
import {
  Modal,
  Pressable,
  Image,
  TouchableOpacity,
  Text,
  View,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Camera, ImageIcon, X } from "lucide-react-native"

const ImagePickerComp = ({ visible, onClose, onImageSelected, image }) => {
  const handlePick = async (fromCamera) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri)
    }
  }

  return (
    <>
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
    </>
  )
}

export default ImagePickerComp
