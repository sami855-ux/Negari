import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native"
import { CheckCircle, XCircle, X } from "lucide-react-native"
import { useEffect, useRef } from "react"

const { width } = Dimensions.get("window")

const CustomAlertModal = ({
  visible,
  type = "success",
  title,
  message,
  onClose,
  onConfirm,
}) => {
  const isSuccess = type === "success"
  const iconColor = isSuccess ? "#10B981" : "#EF4444"
  const bgColor = isSuccess ? "bg-green-50" : "bg-red-50"
  const textColor = isSuccess ? "text-green-800" : "text-red-800"
  const buttonColor = isSuccess ? "bg-green-600" : "bg-red-600"
  const IconComponent = isSuccess ? CheckCircle : XCircle

  // Animation values
  const scaleValue = useRef(new Animated.Value(0.8)).current
  const opacityValue = useRef(new Animated.Value(0)).current
  const translateYValue = useRef(new Animated.Value(20)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          damping: 10,
          stiffness: 100,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center w-full h-full px-4 bg-black/60">
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }, { translateY: translateYValue }],
            opacity: opacityValue,
            width: width * 0.9,
            maxWidth: 400,
          }}
          className={`rounded-3xl p-6 bg-slate-100 ${bgColor} shadow-xl shadow-black/20 flex flex-col justify-center`}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute p-1 top-4 right-4"
            activeOpacity={0.7}
          >
            <X size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Icon with subtle shadow */}
          <View className="items-center mb-5">
            <Animated.View
              style={{
                shadowColor: iconColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
              }}
              className="p-4 bg-white rounded-full"
            >
              <IconComponent size={48} color={iconColor} strokeWidth={1.8} />
            </Animated.View>
          </View>

          {/* Title with subtle entrance animation */}
          <Animated.Text
            className={`text-2xl font-bold mb-3 text-center font-geist ${textColor}`}
            style={{
              opacity: opacityValue,
              transform: [
                { translateY: Animated.multiply(translateYValue, 0.5) },
              ],
            }}
          >
            {title}
          </Animated.Text>

          {/* Message text */}
          <Animated.Text
            className="mb-6 text-base leading-6 text-center text-gray-700 font-geist"
            style={{
              opacity: opacityValue,
              transform: [
                { translateY: Animated.multiply(translateYValue, 0.3) },
              ],
            }}
          >
            {message}
          </Animated.Text>

          {/* Button with subtle press effect */}
          <TouchableOpacity
            className={`py-2 w-44 ${buttonColor} rounded-md active:opacity-90`}
            onPress={onConfirm || onClose}
            activeOpacity={0.8}
          >
            <Text className="text-[16px] font-medium text-center text-white  font-geist">
              {onConfirm ? "Confirm" : "Continue"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

export default CustomAlertModal
