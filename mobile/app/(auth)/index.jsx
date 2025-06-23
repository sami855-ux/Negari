import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"
import * as LocalAuthentication from "expo-local-authentication"
import { useRouter } from "expo-router"
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Fingerprint,
  Loader2,
  Lock,
  Mail,
} from "lucide-react-native"
import { MotiText, MotiView } from "moti"
import { useEffect, useState } from "react"
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { width, height } = Dimensions.get("window")

const Index = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [biometricSupported, setBiometricSupported] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  })

  useEffect(() => {
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enrolled = await LocalAuthentication.isEnrolledAsync()
    setBiometricSupported(compatible && enrolled)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setIsLoading(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.push("/(tabs)")
    }, 2000)
  }

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to sign in",
        fallbackLabel: "Use password instead",
      })

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        router.push("/(tabs)")
      }
    } catch (error) {
      Alert.alert("Authentication Error", "Please try again")
    }
  }

  const handleSocialLogin = (provider) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert(`${provider} Login`, `Redirecting to ${provider}...`)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <>
      <LinearGradient
        colors={["blue", "green"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Background Pattern */}
          <View className="absolute inset-0 opacity-10">
            <View className="absolute w-32 h-32 bg-white rounded-full top-20 left-10" />
            <View className="absolute w-20 h-20 bg-white rounded-full top-40 right-5" />
            <View className="absolute w-24 h-24 bg-white rounded-full bottom-32 left-5" />
          </View>

          <View className="justify-center flex-1 px-3">
            {/* Animated Logo/Header */}
            <View className="items-center mb-12">
              <View className="items-center justify-center w-24 h-24 mb-6 bg-white rounded-full shadow-2xl">
                <Image
                  source={require("@/assets/images/react-logo.png")}
                  className="w-16 h-16"
                />
              </View>

              <MotiText
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: 300, damping: 12 }}
                className="text-4xl font-bold text-white font-jakarta"
              >
                Welcome Back
              </MotiText>
              <MotiText
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 500 }}
                className="mt-2 text-lg text-white/80"
              >
                Sign in to continue your journey
              </MotiText>
            </View>

            {/* Login Form Card */}
            <View
              transition={{ type: "timing", duration: 800, delay: 400 }}
              className="px-2 py-6 shadow-2xl bg-white/95 backdrop-blur-lg rounded-xl"
            >
              {/* Email Input */}
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", delay: 600 }}
                className="mb-4"
              >
                <View
                  className={`flex flex-row items-center gap-3 border-2 rounded-2xl px-4 py-2 transition-all duration-200 ${
                    isFocused.email
                      ? "border-indigo-500 bg-indigo-50 shadow-lg"
                      : errors.email
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <Mail
                    size={18}
                    color={
                      isFocused.email
                        ? "#6366f1"
                        : errors.email
                          ? "#ef4444"
                          : "#9ca3af"
                    }
                  />
                  <TextInput
                    className="flex-1  text-gray-800 text-[15px] font-geist mt-1"
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    onFocus={() => {
                      setIsFocused({ ...isFocused, email: true })
                      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  {email && validateEmail(email) && (
                    <CheckCircle size={20} color="#10b981" />
                  )}
                </View>
                {errors.email ? (
                  <MotiView
                    from={{ opacity: 0, translateY: -10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="flex-row items-center mt-2 ml-2"
                  >
                    <AlertCircle size={16} color="#ef4444" />
                    <Text className="ml-1 text-sm text-red-500 font-geist">
                      {errors.email}
                    </Text>
                  </MotiView>
                ) : null}
              </MotiView>

              {/* Password Input */}
              <MotiView
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "spring", delay: 700 }}
                className="mb-6"
              >
                <View
                  className={`flex-row items-center border-2 rounded-2xl px-4 py-2 transition-all duration-200 ${
                    isFocused.password
                      ? "border-indigo-500 bg-indigo-50 shadow-lg"
                      : errors.password
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <Lock
                    size={18}
                    color={
                      isFocused.password
                        ? "#6366f1"
                        : errors.password
                          ? "#ef4444"
                          : "#9ca3af"
                    }
                  />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800 text-[15px] font-geist mt-1"
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text)
                      if (errors.password)
                        setErrors({ ...errors, password: "" })
                    }}
                    secureTextEntry={!showPassword}
                    onFocus={() => {
                      setIsFocused({ ...isFocused, password: true })
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                    onBlur={() =>
                      setIsFocused({ ...isFocused, password: false })
                    }
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    className="p-1"
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9ca3af" />
                    ) : (
                      <Eye size={20} color="#9ca3af" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <MotiView
                    from={{ opacity: 0, translateY: -10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="flex-row items-center mt-2 ml-2"
                  >
                    <AlertCircle size={16} color="#ef4444" />
                    <Text className="ml-1 text-sm text-red-500 font-geist">
                      {errors.password}
                    </Text>
                  </MotiView>
                ) : null}
              </MotiView>

              {/* Remember Me & Forgot Password */}
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 800 }}
                className="flex-row items-center justify-between mb-6"
              >
                <TouchableOpacity
                  onPress={() => {
                    setRememberMe(!rememberMe)
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }}
                  className="flex-row items-center"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                      rememberMe
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-gray-300"
                    }`}
                  >
                    {rememberMe && <CheckCircle size={12} color="white" />}
                  </View>
                  <Text className="text-gray-600 font-geist">Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text className="font-semibold text-indigo-600 font-geist">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </MotiView>

              {/* Login Button */}
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: 900 }}
                className="my-4"
              >
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  className="overflow-hidden rounded-xl"
                >
                  <LinearGradient
                    colors={["#4f46e5", "#7c3aed"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-row items-center justify-center py-4 shadow-lg"
                  >
                    {isLoading ? (
                      <Loader2
                        size={24}
                        color="white"
                        className="mr-2 animate-spin"
                      />
                    ) : null}
                    <Text className="text-lg font-bold text-white font-geist">
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </MotiView>

              {/* Biometric Authentication */}
              {biometricSupported && (
                <MotiView
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", delay: 1000 }}
                  className="items-center mt-4"
                >
                  <TouchableOpacity
                    onPress={handleBiometricAuth}
                    className="flex-row items-center px-6 py-3 bg-gray-100 rounded-full"
                  >
                    <Fingerprint size={20} color="#6366f1" />
                    <Text className="ml-2 font-semibold text-gray-700">
                      Use Biometric
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              )}
            </View>

            {/* Sign Up Link */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1300 }}
              className="flex-row justify-center mt-8"
            >
              <Text className="text-white/80">Do not have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text className="font-bold text-white">Sign Up</Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  )
}

export default Index
