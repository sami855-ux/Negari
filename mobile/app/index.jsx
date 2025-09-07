import "@/global.css"
import { useRouter } from "expo-router"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  Animated,
  Easing,
} from "react-native"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as AuthSession from "expo-auth-session"
import { useEffect, useState, useRef } from "react"
import Constants from "expo-constants"
import axios from "axios"
import GoogleIcon from "@/utils/GoogleIcon"
import jwtDecode from "jwt-decode"

import { storage } from "../store/slices/auth"

WebBrowser.maybeCompleteAuthSession()

// Decode JWT safely without any library
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1] // Get the payload part
    const decoded = JSON.parse(atob(payload)) // atob decodes base64
    return decoded
  } catch (err) {
    console.error("JWT decode failed:", err)
    return null
  }
}

const Welcome = () => {
  const router = useRouter()
  const { EXPO_CLIENT_ID, ANDROID_CLIENT_ID, WEB_CLIENT_ID, serverUrl } =
    Constants.manifest.extra

  // Google login config
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["profile", "email"],
    prompt: "select_account",
  })

  // Handle Google response
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params
        try {
          const res = await axios.get(`${serverUrl}/mobile/google/callback`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${id_token}`,
            },
          })

          const data = res.data
          if (data.success && data.token) {
            await AsyncStorage.setItem("token", data.token)
            await AsyncStorage.setItem("user", JSON.stringify(data.user))

            // Redirect based on role
            if (data.user.role === "ADMIN") router.replace("/admin")
            else if (data.user.role === "OFFICER") router.replace("/official")
            else router.replace("/(tabs)/index")
          }
        } catch (err) {
          console.error("Google login failed:", err)
        }
      }
    }

    handleGoogleResponse()
  }, [response])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/welcome.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View className="flex-1 bg-black/30">
          <View className="justify-end flex-1 px-6 pb-5">
            <View className="absolute bottom-0 left-0 right-0 px-6 py-8 space-y-4 h-80 bg-[#19191b]/90 rounded-t-[34px]">
              <TouchableOpacity
                disabled={!request}
                className="flex-row items-center justify-center py-3 mb-5 rounded-xl bg-black/50"
                onPress={() => promptAsync({ useProxy: true })}
              >
                <GoogleIcon className="w-5 h-5" />
                <Text className="ml-2 font-medium text-white font-geist hi">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex flex-row items-center justify-center py-3 bg-blue-500 rounded-xl">
                <Text className="ml-2 font-medium text-white font-geist">
                  Continue with Telegram
                </Text>
              </TouchableOpacity>

              <Text className="my-4 text-center text-white font-geist">Or</Text>

              <TouchableOpacity
                className="flex-row items-center justify-center gap-3 py-3 bg-transparent border-[#29292a] border rounded-xl"
                activeOpacity={0.8}
                onPress={() => router.push("/(auth)")}
              >
                <Text className="font-medium text-white font-geist">
                  Continue with Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default function AppWrapper() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const scaleAnim = useRef(new Animated.Value(1)).current

  // Pulsing animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storage.getItem("user")
        if (token) {
          const parseToken = JSON.parse(token)
          // Redirect based on role
          if (parseToken.role === "WORKER") router.replace("/worker/(tabs)")
          else if (parseToken.role === "CITIZEN") router.replace("/(tabs)")
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Animated.Image
          source={require("@/assets/images/react-logo.png")} // your logo
          style={{ width: 120, height: 120, transform: [{ scale: scaleAnim }] }}
        />
        <Text className="mt-4 text-white font-geist text-lg">Loading...</Text>
      </View>
    )
  }

  return <Welcome />
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  hi: {
    fontSize: 36,
    color: "red",
    textTransform: "uppercase",
  },
})
