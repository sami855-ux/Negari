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
    const iconSize = 32
    switch (type) {
      case "success":
        return <Check size={iconSize} color="green" strokeWidth={3} />
      case "error":
        return <X size={iconSize} color="#ffffff" strokeWidth={3} />
      case "warning":
        return <AlertTriangle size={iconSize} color="#ffffff" strokeWidth={3} />
      case "info":
        return <Info size={iconSize} color="#ffffff" strokeWidth={3} />
      default:
        return <Check size={iconSize} color="#ffffff" strokeWidth={3} />
    }
  }

  return (
    <Animated.View
      className="absolute inset-0 bg-black/60 justify-center items-center"
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View
        className={`w-[75%] rounded-md bg-slate-100 py-5 px-4 pb-10`}
        entering={SlideInUp.duration(400).easing(Easing.out(Easing.exp))}
        exiting={SlideOutDown.duration(300)}
      >
        <View className="w-full h-14 items-center  justify-center self-center mb-6">
          <View className="w-14 h-14  flex-row items-center rounded-full bg-white  justify-center">
            {getIcon()}
          </View>
        </View>
        <Text className="text-gray-800 text-lg font-bold px-2 mb-3 tracking-tight font-geist">
          {title}
        </Text>
        <Text className="text-white/90 text-base text-center mb-8 leading-6 px-2 font-jakarta">
          {message}
        </Text>

        <View className="flex-row gap-4 mx-4">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-transparent h-10 items-center "
          >
            <Text className="text-gray-800 font-semibold text-lg tracking-wide font-geist">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onButtonPress || onClose}
            className="flex-1 bg-transparent h-10  items-center"
          >
            <Text className="text-gray-800 font-bold text-base tracking-wide font-geist">
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

export default InfoModal
