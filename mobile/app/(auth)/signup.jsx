import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react-native"
import { useState } from "react"
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native"

import { useDispatch } from "react-redux"
import { setOtpEmail } from "../../store/slices/auth"

import CustomAlertModal from "../../components/AuthModal"
import { SpinningLoader } from "../../utils/SpinnerLoader"
import { registerUser } from "../../services/user"

const SignupPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [isFocused, setIsFocused] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  })

  const [alertVisible, setAlertVisible] = useState(false)
  const [alertType, setAlertType] = useState("success") // or "error"
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    let valid = true
    let newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
      valid = false
    }

    if (!username) {
      newErrors.username = "Username is required"
      valid = false
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
      valid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores"
      valid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number"
      valid = false
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSignup = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    setLoading(true)

    try {
      const res = await registerUser({ username, email, password })

      console.log(res)
      if (res.success) {
        // ToastAndroid.show(
        //   res.message || "Verify your email to perceive your account",
        //   ToastAndroid.LONG
        // )

        dispatch(setOtpEmail(res?.user?.email))
        router.push("/(auth)/Otp")
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        setAlertType("error")
        setAlertTitle("Signup Failed")
        setAlertMessage(
          typeof res.message === "string"
            ? res.message
            : JSON.stringify(res.message) ||
                "Something went wrong. Please try again."
        )
        setAlertVisible(true)
      }
    } catch (error) {
      console.log(error)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      setAlertType("error")
      setAlertTitle("Signup Failed")
      setAlertMessage("Something went wrong. Please try again.")
      setAlertVisible(true)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else {
      setShowConfirmPassword(!showConfirmPassword)
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return "#ef4444"
    if (strength <= 3) return "#f59e0b"
    return "#10b981"
  }

  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
  }

  return (
    <>
      <CustomAlertModal
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          setAlertVisible(false)
          if (alertType === "success") {
            router.push("/(tabs)")
          }
        }}
      />

      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center justify-center w-10 h-10 "
            >
              <ArrowLeft size={20} />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800 font-geist">
              Register
            </Text>
            <View className="w-10" />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View className="px-5 pt-10">
              {/* Logo Section */}
              <View className="mb-8 ">
                <Text className="text-3xl font-bold text-gray-800 font-geist">
                  Getting Started
                </Text>
                <Text className="mt-3 text-gray-600 font-jakarta">
                  Seems you are new here. Let's set up your profile.
                </Text>
              </View>

              {/* Signup Form Card */}
              <View className="flex justify-start bg-white/95">
                {/* Email Input */}
                <View className="mb-4">
                  <Text className="mb-2 text-gray-700 font-jakarta">
                    Email Address
                  </Text>
                  <View
                    className={`flex-row items-center border rounded-md px-4 py-3 ${
                      isFocused.email
                        ? "border-[#774287] bg-[#774287]/10"
                        : errors.email
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <Mail
                      size={16}
                      className="mt-[5px]"
                      color={
                        isFocused.email
                          ? "#774287"
                          : errors.email
                            ? "#ef4444"
                            : "#9ca3af"
                      }
                    />
                    <TextInput
                      className="flex-1 ml-3 text-gray-800 outline-none font-jakarta"
                      placeholder="Enter email"
                      placeholderTextColor="#9ca3af"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text)
                        if (errors.email) setErrors({ ...errors, email: "" })
                      }}
                      onFocus={() =>
                        setIsFocused({ ...isFocused, email: true })
                      }
                      onBlur={() =>
                        setIsFocused({ ...isFocused, email: false })
                      }
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                    {email && validateEmail(email) && (
                      <CheckCircle size={18} color="#10b981" />
                    )}
                  </View>
                  {errors.email && (
                    <View className="flex-row items-center mt-2 ml-2">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text className="ml-1 text-sm text-red-500 font-geist">
                        {errors.email}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Username Input */}
                <View className="mb-4">
                  <Text className="mb-2 text-gray-700 font-jakarta">
                    Full Name
                  </Text>
                  <View
                    className={`flex-row items-center border rounded-md px-4 py-3 ${
                      isFocused.username
                        ? "border-[#774287] bg-[#774287]/10"
                        : errors.username
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <User
                      size={16}
                      color={
                        isFocused.username
                          ? "#774287"
                          : errors.username
                            ? "#ef4444"
                            : "#9ca3af"
                      }
                    />
                    <TextInput
                      className="flex-1 ml-3 text-gray-800 outline-none font-jakarta"
                      placeholder="Username"
                      placeholderTextColor="#9ca3af"
                      value={username}
                      onChangeText={(text) => {
                        setUsername(text.toLowerCase())
                        if (errors.username)
                          setErrors({ ...errors, username: "" })
                      }}
                      onFocus={() =>
                        setIsFocused({ ...isFocused, username: true })
                      }
                      onBlur={() =>
                        setIsFocused({ ...isFocused, username: false })
                      }
                      autoCapitalize="none"
                      autoComplete="username"
                    />
                    {username &&
                      username.length >= 3 &&
                      /^[a-zA-Z0-9_]+$/.test(username) && (
                        <CheckCircle size={18} color="#10b981" />
                      )}
                  </View>
                  {errors.username && (
                    <View className="flex-row items-center mt-2 ml-2">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text className="ml-1 text-sm text-red-500 font-geist">
                        {errors.username}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Password Input */}
                <View className="mb-4">
                  <Text className="mb-2 text-gray-700 font-jakarta">
                    Password
                  </Text>
                  <View
                    className={`flex-row items-center border rounded-md px-4 py-3 ${
                      isFocused.password
                        ? "border-[#774287] bg-[#774287]/10"
                        : errors.password
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <Lock
                      size={16}
                      color={
                        isFocused.password
                          ? "#774287"
                          : errors.password
                            ? "#ef4444"
                            : "#9ca3af"
                      }
                    />
                    <TextInput
                      className="flex-1 ml-3 text-gray-800 outline-none font-jakarta"
                      placeholder="Password"
                      placeholderTextColor="#9ca3af"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text)
                        if (errors.password)
                          setErrors({ ...errors, password: "" })
                      }}
                      secureTextEntry={!showPassword}
                      onFocus={() =>
                        setIsFocused({ ...isFocused, password: true })
                      }
                      onBlur={() =>
                        setIsFocused({ ...isFocused, password: false })
                      }
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      onPress={() => togglePasswordVisibility("password")}
                      className="p-1"
                    >
                      {showPassword ? (
                        <EyeOff size={18} color="#9ca3af" />
                      ) : (
                        <Eye size={18} color="#9ca3af" />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Password Strength Indicator */}
                  {password && (
                    <View className="mt-2 ml-2">
                      <View className="flex-row items-center">
                        <View className="flex-1 h-1 mr-2 bg-gray-200 rounded-full">
                          <View
                            className="h-1 rounded-full"
                            style={{
                              width: `${(getPasswordStrength(password) / 5) * 100}%`,
                              backgroundColor: getPasswordStrengthColor(
                                getPasswordStrength(password)
                              ),
                            }}
                          />
                        </View>
                        <Text
                          className="text-xs font-medium font-geist"
                          style={{
                            color: getPasswordStrengthColor(
                              getPasswordStrength(password)
                            ),
                          }}
                        >
                          {getPasswordStrengthText(
                            getPasswordStrength(password)
                          )}
                        </Text>
                      </View>
                    </View>
                  )}

                  {errors.password && (
                    <View className="flex-row items-center mt-2 ml-2">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text className="ml-1 text-sm text-red-500 font-geist">
                        {errors.password}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Confirm Password Input */}
                <View className="mb-6">
                  <Text className="mb-2 text-gray-700 font-jakarta">
                    Confirm Password
                  </Text>
                  <View
                    className={`flex-row items-center border rounded-md px-4 py-3 ${
                      isFocused.confirmPassword
                        ? "border-[#774287] bg-[#774287]/10"
                        : errors.confirmPassword
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <Lock
                      size={16}
                      color={
                        isFocused.confirmPassword
                          ? "#774287"
                          : errors.confirmPassword
                            ? "#ef4444"
                            : "#9ca3af"
                      }
                    />
                    <TextInput
                      className="flex-1 ml-3 text-gray-800 outline-none font-jakarta"
                      placeholder="Confirm password"
                      placeholderTextColor="#9ca3af"
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text)
                        if (errors.confirmPassword)
                          setErrors({ ...errors, confirmPassword: "" })
                      }}
                      secureTextEntry={!showConfirmPassword}
                      onFocus={() =>
                        setIsFocused({ ...isFocused, confirmPassword: true })
                      }
                      onBlur={() =>
                        setIsFocused({ ...isFocused, confirmPassword: false })
                      }
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} color="#9ca3af" />
                      ) : (
                        <Eye size={18} color="#9ca3af" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {confirmPassword && password === confirmPassword && (
                    <View className="flex-row items-center mt-2 ml-2">
                      <CheckCircle size={14} color="#10b981" />
                      <Text className="ml-1 text-sm text-green-600 font-geist">
                        Passwords match
                      </Text>
                    </View>
                  )}
                  {errors.confirmPassword && (
                    <View className="flex-row items-center mt-2 ml-2">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text className="ml-1 text-sm text-red-500 font-geist">
                        {errors.confirmPassword}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Terms Agreement */}
                <View className="mb-6">
                  <TouchableOpacity
                    onPress={() => {
                      setAgreeTerms(!agreeTerms)
                      if (errors.agreeTerms)
                        setErrors({ ...errors, agreeTerms: "" })
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                    className="flex-row items-start"
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 mr-3 mt-1  flex items-center justify-center ${
                        agreeTerms
                          ? "bg-[#774287] border-[#774287]/10"
                          : "border-gray-300"
                      }`}
                    >
                      {agreeTerms && <CheckCircle size={12} color="white" />}
                    </View>
                    <Text className="flex-1 text-[13px] leading-5 text-gray-600 font-jakarta">
                      By creating an a count you agree to the{" "}
                      <Text className="font-semibold text-[#774287] text-[13px] font-jakarta">
                        Terms of Service
                      </Text>{" "}
                      and{" "}
                      <Text className="font-semibold text-[#774287] text-[13px] font-jakarta">
                        Privacy Policy
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  {errors.agreeTerms && (
                    <View className="flex-row items-center mt-2 ml-8">
                      <AlertCircle size={14} color="#ef4444" />
                      <Text className="ml-1 text-sm text-red-500 font-jakarta">
                        {errors.agreeTerms}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Signup Button */}
                <TouchableOpacity
                  onPress={handleSignup}
                  disabled={loading}
                  className="overflow-hidden rounded-md"
                >
                  <LinearGradient
                    colors={["#774287"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-row items-center justify-center py-3"
                  >
                    {loading && (
                      <SpinningLoader
                        size={20}
                        color="white"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <Text className="text-[15px] text-white font-jakarta">
                      {loading ? "Creating Account..." : "Continue"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center mt-12">
                <Text className="text-gray-700 font-jakarta">
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)")}>
                  <Text className="font-bold text-[#774287] text-800 font-jakarta">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  )
}

export default SignupPage
