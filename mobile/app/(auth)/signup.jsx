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
import { MotiView } from "moti"
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
  TouchableOpacity,
  View,
} from "react-native"

const SignupPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [isFocused, setIsFocused] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  })

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

    setIsLoading(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Alert.alert(
        "Account Created!",
        "Welcome! Your account has been created successfully.",
        [{ text: "Continue", onPress: () => router.push("/(tabs)") }]
      )
    }, 2000)
  }

  const handleSocialSignup = (provider) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert(`${provider} Signup`, `Creating account with ${provider}...`)
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
      <LinearGradient
        colors={["green", "blue"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="items-center justify-center w-10 h-10 rounded-full bg-white/20"
              >
                <ArrowLeft size={20} color="white" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">
                Create Account
              </Text>
              <View className="w-10" />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View className="px-3">
                {/* Logo Section */}
                <MotiView
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "timing", duration: 600 }}
                  className="items-center mb-8"
                >
                  <View className="items-center justify-center w-20 h-20 mb-4 bg-white rounded-full shadow-lg">
                    <Image
                      source={require("@/assets/images/splash-icon.png")}
                      className="w-12 h-12"
                    />
                  </View>
                  <Text className="text-2xl font-bold text-white">
                    Join Us Today
                  </Text>
                  <Text className="mt-1 text-white/80">
                    Create your account to get started
                  </Text>
                </MotiView>

                {/* Signup Form Card */}
                <MotiView
                  from={{ opacity: 0, translateY: 30 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: "timing", duration: 800, delay: 200 }}
                  className="p-6 shadow-2xl bg-white/95 backdrop-blur-lg rounded-3xl"
                >
                  {/* Email Input */}
                  <View className="mb-4">
                    <View
                      className={`flex-row items-center border-2 rounded-xl px-4 py-2 ${
                        isFocused.email
                          ? "border-indigo-500 bg-indigo-50"
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
                        className="flex-1 ml-3 text-gray-800 text-[15px] font-geist"
                        placeholder="Email address"
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
                    <View
                      className={`flex-row items-center border-2 rounded-xl px-4 py-2 ${
                        isFocused.username
                          ? "border-indigo-500 bg-indigo-50"
                          : errors.username
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <User
                        size={20}
                        color={
                          isFocused.username
                            ? "#6366f1"
                            : errors.username
                              ? "#ef4444"
                              : "#9ca3af"
                        }
                      />
                      <TextInput
                        className="flex-1 ml-3 text-gray-800 text-[16px] font-geist"
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
                    <View
                      className={`flex-row items-center border-2 rounded-xl px-4 py-2 ${
                        isFocused.password
                          ? "border-indigo-500 bg-indigo-50"
                          : errors.password
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <Lock
                        size={20}
                        color={
                          isFocused.password
                            ? "#6366f1"
                            : errors.password
                              ? "#ef4444"
                              : "#9ca3af"
                        }
                      />
                      <TextInput
                        className="flex-1 ml-3 text-gray-800 text-[16px] font-geist"
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
                            className="text-xs font-medium"
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
                    <View
                      className={`flex-row items-center border-2 rounded-xl px-4 py-2 ${
                        isFocused.confirmPassword
                          ? "border-indigo-500 bg-indigo-50"
                          : errors.confirmPassword
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <Lock
                        size={20}
                        color={
                          isFocused.confirmPassword
                            ? "#6366f1"
                            : errors.confirmPassword
                              ? "#ef4444"
                              : "#9ca3af"
                        }
                      />
                      <TextInput
                        className="flex-1 ml-3 text-gray-800 text-[16px] font-geist"
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
                        className={`w-5 h-5 rounded border-2 mr-3  flex items-center justify-center ${
                          agreeTerms
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-gray-300"
                        }`}
                      >
                        {agreeTerms && <CheckCircle size={12} color="white" />}
                      </View>
                      <Text className="flex-1 text-[14px] leading-5 text-gray-600 font-geist">
                        I agree to the{" "}
                        <Text className="font-semibold text-indigo-600 font-geist">
                          Terms of Service
                        </Text>{" "}
                        and{" "}
                        <Text className="font-semibold text-indigo-600 font-geist">
                          Privacy Policy
                        </Text>
                      </Text>
                    </TouchableOpacity>
                    {errors.agreeTerms && (
                      <View className="flex-row items-center mt-2 ml-8">
                        <AlertCircle size={14} color="#ef4444" />
                        <Text className="ml-1 text-sm text-red-500 font-geist">
                          {errors.agreeTerms}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Signup Button */}
                  <TouchableOpacity
                    onPress={handleSignup}
                    disabled={isLoading}
                    className="overflow-hidden rounded-xl"
                  >
                    <LinearGradient
                      colors={["#10b981", "#059669"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="flex-row items-center justify-center py-4"
                    >
                      {isLoading && (
                        <Loader2 size={20} color="white" className="mr-2" />
                      )}
                      <Text className="text-lg font-semibold text-white font-geist">
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </MotiView>

                {/* Login Link */}
                <View className="flex-row justify-center mt-6">
                  <Text className="text-white/80">
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/(auth)")}>
                    <Text className="font-bold text-white">Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  )
}

export default SignupPage
