import { View, Text, TouchableOpacity, Modal } from "react-native"
import { LogOut, X } from "lucide-react-native"

export default function LogoutConfirmationModal({
  visible = false,
  onConfirm,
  onCancel,
  title = "Logout",
  message = "Are you sure you want to logout?",
  confirmText = "Yes, Logout",
  cancelText = "Cancel",
  confirmColor = "#ef4444",
  icon = <LogOut size={24} color="#ef4444" />,
  showIcon = true,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="items-center justify-center flex-1 p-5 bg-black/50">
        <View className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800 font-geist">
              {title}
            </Text>
            <TouchableOpacity
              onPress={onCancel}
              className="p-1 bg-gray-100 rounded-full"
            >
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Icon and Message */}
          <View className="flex-row items-start mb-6">
            {showIcon && (
              <View className="p-2 mr-3 bg-red-100 rounded-full">{icon}</View>
            )}
            <Text className="flex-1 mt-2 text-base text-gray-600 font-jakarta">
              {message}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row justify-end space-x-5">
            <TouchableOpacity
              onPress={onCancel}
              className="px-5 py-3 bg-gray-100 rounded-lg mr-4"
              activeOpacity={0.7}
            >
              <Text className="font-medium text-gray-800 font-geist">
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="px-5 py-3 rounded-lg"
              style={{ backgroundColor: confirmColor }}
              activeOpacity={0.7}
            >
              <Text className="font-medium text-white font-geist">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
