import { View, Text, TouchableOpacity } from "react-native"
import { X, Check, AlertTriangle, Info } from "lucide-react-native"
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  Easing,
} from "react-native-reanimated"

const InfoModal = ({
  visible,
  type = "success",
  title,
  message,
  onClose,
  showCloseButton = true,
  buttonText = "Got it",
  onButtonPress,
}) => {
  if (!visible) return null

  // Get icon based on type
  const getIcon = () => {
    const iconSize = 28
    switch (type) {
      case "success":
        return <Check size={iconSize} className="text-white" />
      case "error":
        return <X size={iconSize} className="text-white" />
      case "warning":
        return <AlertTriangle size={iconSize} className="text-white" />
      case "info":
        return <Info size={iconSize} className="text-white" />
      default:
        return <Check size={iconSize} className="text-white" />
    }
  }

  // Get background color based on type
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <Animated.View
      className="absolute inset-0 bg-black bg-opacity-50 justify-end"
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View
        className={`w-full rounded-t-3xl ${getBgColor()} pt-6 px-6 pb-8`}
        entering={SlideInUp.duration(300).easing(Easing.out(Easing.exp))}
        exiting={SlideOutDown.duration(300)}
      >
        {showCloseButton && (
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 p-2"
          >
            <X size={24} className="text-white" />
          </TouchableOpacity>
        )}

        {/* Icon circle */}
        <View className="w-16 h-16 rounded-full bg-black bg-opacity-20 items-center justify-center self-center mb-4">
          {getIcon()}
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-2">
          {title}
        </Text>
        <Text className="text-white text-center mb-6 opacity-90">
          {message}
        </Text>

        <TouchableOpacity
          onPress={onButtonPress || onClose}
          className="bg-white py-3 px-6 rounded-full items-center"
        >
          <Text className="text-black font-bold">{buttonText}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

export default InfoModal
