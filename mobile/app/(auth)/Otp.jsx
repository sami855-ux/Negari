import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native"
import { ArrowLeft } from "lucide-react-native"
import { useRouter } from "expo-router"
import { VerifyOpt } from "../../services/user"
import { SpinningLoader } from "../../utils/SpinnerLoader"
import { useDispatch, useSelector } from "react-redux"
import { setOtpEmail, setUser } from "../../store/slices/auth"

const OtpVerification = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timer, setTimer] = useState(60)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef([])

  const router = useRouter()
  const dispatch = useDispatch()
  const { otpEmail } = useSelector((store) => store.auth)

  // Focus management for OTP inputs
  const focusNextField = (index, value) => {
    if (index < 5 && value) {
      inputRefs.current[index + 1].focus()
    }
  }

  const focusPreviousField = (index, key) => {
    if (key === "Backspace" && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Handle OTP change
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)

    if (text) {
      focusNextField(index, text)
    }

    // Auto-submit when last digit is entered
    if (index === 5 && text) {
      handleVerify()
    }
  }

  // Timer logic
  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setIsResendDisabled(false)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timer])

  // Resend OTP function
  const handleResendOtp = () => {
    setTimer(60)
    setIsResendDisabled(true)
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0].focus()
    Alert.alert("OTP Resent", "A new OTP has been sent to your email")
  }

  // Verify OTP function
  const handleVerify = async () => {
    Keyboard.dismiss()
    const enteredOtp = otp.join("")

    if (enteredOtp.length !== 6) {
      Alert.alert("Error", "Please enter a complete 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const res = await VerifyOpt(otpEmail, enteredOtp)

      if (res.success) {
        dispatch(
          setUser({
            user: res.user,
            token: res.token,
          })
        )

        dispatch(setOtpEmail(null))
        router.push("/worker/(tabs)")
      } else {
        Alert.alert("Error", res.message)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 p-6 bg-white">
      <View className="flex-row items-center justify-between mb-12">
        <TouchableOpacity
          onPress={() => router.back()}
          className="items-center justify-center w-10 h-10 "
        >
          <ArrowLeft size={20} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800 font-geist">
          OTP Verification
        </Text>
        <View className="w-10" />
      </View>

      <Text className="mb-12 text-center text-gray-600 font-jakarta">
        An authentication code has been sent to your email{" "}
        <Text className="text-[#774287] font-semibold">{otpEmail}</Text>.
      </Text>

      {/* OTP Inputs */}
      <View className="flex-row justify-between mb-8">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="w-12 h-12 text-lg text-center border-2 border-purple-300 rounded-lg font-geist"
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={({ nativeEvent: { key } }) =>
              focusPreviousField(index, key)
            }
            selectTextOnFocus
            autoFocus={index === 0}
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        className={`py-4 rounded-xl ${otp.join("").length === 6 ? "bg-[#774287]" : "bg-purple-200"}`}
        onPress={handleVerify}
        disabled={otp.join("").length !== 6}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading && (
          <SpinningLoader size={20} color="white" style={{ marginRight: 8 }} />
        )}
        <Text className="text-[15px] font-semibold text-center text-white font-jakarta">
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      {/* Timer and Resend */}
      <View className="flex-row justify-center my-8">
        <Text className="text-gray-600 font-jakarta">
          Didn't receive code?{" "}
        </Text>
        <TouchableOpacity onPress={handleResendOtp} disabled={isResendDisabled}>
          <Text
            className={`font-jakarta font-semibold ${isResendDisabled ? "text-gray-400" : "text-[#774287]"}`}
          >
            {isResendDisabled ? `Resend in ${timer}s` : "Resend Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OtpVerification
