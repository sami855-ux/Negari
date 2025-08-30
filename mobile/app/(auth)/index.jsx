import { useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native"
import { useForm, Controller } from "react-hook-form"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { SpinningLoader } from "../../utils/SpinnerLoader"
import { useDispatch } from "react-redux"
import { loginUser } from "../../store/slices/auth"

const LoginScreen = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      console.log("Login data:", data)

      // Dispatch Redux thunk and unwrap result
      const res = await dispatch(loginUser(data)).unwrap()
      console.log(res)
      if (res.success) {
        Alert.alert("Success", "You have successfully logged in!")

        // Navigate after successful login
        router.push("/(tabs)")
      }
    } catch (error) {
      console.error("Login error:", error)
      Alert.alert("Error", error || "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="absolute z-30 top-4 left-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center justify-center w-10 h-10 rounded-md bg-white/20"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Header Image */}
        <View className="overflow-hidden bg-purple-100 h-[35%]">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=2940&auto=format&fit=crop",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Login Form */}
        <View className="relative flex-1 px-6 pt-8 h-[65%] bg-white border border-gray-100 rounded-t-[34px] -top-8">
          <Text className="mb-4 text-3xl font-semibold text-gray-800 font-geist">
            Let's Sign You In
          </Text>
          <Text className="text-sm text-gray-600 mb-9 font-jakarta">
            Welcome back, you have been missed !
          </Text>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-gray-600 font-jakarta">
              Email Address
            </Text>
            <View
              className={`flex-row items-center border rounded-lg focus-within:border-[#a261b6] px-4 py-3 ${errors.email ? "border-red-300" : "border-purple-100"}`}
            >
              <Mail size={18} className="mr-3 text-gray-500" />
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 h-full text-gray-700 outline-none font-geist"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
            </View>
            {errors.email && (
              <Text className="mt-1 text-sm text-red-500 font-geist">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-gray-600 font-jakarta">
              Password
            </Text>
            <View
              className={`flex-row items-center border rounded-lg focus-within:border-[#a261b6]  px-4 py-3 ${errors.password ? "border-red-300" : "border-purple-100"}`}
            >
              <Lock size={18} className="mr-3 text-gray-500" />
              <Controller
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 text-gray-700 outline-none font-geist"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#774287" />
                ) : (
                  <Eye size={20} color="#774287" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="mt-1 text-sm text-red-500 font-geist">
                {errors.password.message}
              </Text>
            )}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="items-end mb-8">
            <Text
              className="text-sm font-medium text-[#774287] font-jakarta"
              onPress={() => router.push("/(auth)/Otp")}
            >
              Forgot Password ?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className={`items-center justify-center py-3 rounded-md mb-6 ${
              isLoading ? "bg-purple-400" : "bg-[#774287]"
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoading && (
              <SpinningLoader
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <Text className="text-[16px] font-medium text-white font-jakarta">
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 font-jakarta">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text className="font-medium text-[#774287] font-jakarta">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen
