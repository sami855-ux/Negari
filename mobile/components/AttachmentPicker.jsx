import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { X, ImageIcon, File, Upload } from "lucide-react-native"

export default function AttachmentPicker({ visible, onClose, onSelect }) {
  const [uploading, setUploading] = useState(false)

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to make this work!"
        )
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled) {
        setUploading(true)

        // In a real app, you would upload the image to your server here
        // For demo purposes, we'll simulate an upload
        setTimeout(() => {
          setUploading(false)
          onSelect({
            type: "image",
            uri: result.assets[0].uri,
            name: "image.jpg",
          })
        }, 1500)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      setUploading(false)
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera permissions to make this work!"
        )
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled) {
        setUploading(true)

        // Simulate upload
        setTimeout(() => {
          setUploading(false)
          onSelect({
            type: "image",
            uri: result.assets[0].uri,
            name: "photo.jpg",
          })
        }, 1500)
      }
    } catch (error) {
      console.error("Error taking photo:", error)
      setUploading(false)
      Alert.alert("Error", "Failed to take photo")
    }
  }

  if (uploading) {
    return (
      <Modal transparent visible={uploading} animationType="fade">
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="items-center p-6 bg-white rounded-2xl">
            <ActivityIndicator size="large" color="#059669" />
            <Text className="mt-4 text-gray-800 font-geist">
              Uploading attachment...
            </Text>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View className="justify-end flex-1 bg-black/50">
        <View className="p-5 bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-semibold text-gray-800 font-geist">
              Send Attachment
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around">
            <TouchableOpacity className="items-center" onPress={pickImage}>
              <View className="items-center justify-center w-16 h-16 mb-2 bg-emerald-100 rounded-2xl">
                <ImageIcon size={28} color="#059669" />
              </View>
              <Text className="text-gray-700 font-geist">Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={takePhoto}>
              <View className="items-center justify-center w-16 h-16 mb-2 bg-emerald-100 rounded-2xl">
                <Upload size={28} color="#059669" />
              </View>
              <Text className="text-gray-700 font-geist">Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
