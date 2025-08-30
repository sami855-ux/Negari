import { Modal, Pressable, TouchableOpacity, Text, View } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Video, Camera, X } from "lucide-react-native"

const VideoPickerComponent = ({ visible, onClose, onVideoSelected }) => {
  const handlePick = async (fromCamera) => {
    onClose()
    try {
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.8,
            videoQuality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.8,
            videoQuality: 0.8,
          })

      if (!result.canceled && onVideoSelected) {
        onVideoSelected(result.assets[0].uri)
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
      <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

      {/* Picker Container */}
      <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-xl">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
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
            className="flex-row items-center p-4 bg-green-50 rounded-lg border border-green-100 active:bg-blue-100"
            onPress={() => handlePick(true)}
            activeOpacity={0.7}
          >
            <View className="bg-blue-100 p-3 rounded-xl mr-4">
              <Camera size={22} className="text-green-700" />
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
            className="flex-row items-center p-4 bg-purple-50 rounded-xl border border-purple-100 active:bg-purple-100"
            onPress={() => handlePick(false)}
            activeOpacity={0.7}
          >
            <View className="bg-purple-100 p-3 rounded-xl mr-4">
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
