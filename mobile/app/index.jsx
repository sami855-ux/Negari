// app/index.jsx
import "@/global.css"
import { useRouter } from "expo-router"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as AuthSession from "expo-auth-session"

import GoogleIcon from "@/utils/GoogleIcon"
import { useEffect, useState } from "react"
import Constants from "expo-constants"
import axios from "axios"
import { MessageProvider } from "../components/MessageContext"

WebBrowser.maybeCompleteAuthSession()

const Welcome = () => {
  const router = useRouter()
  const { EXPO_CLIENT_ID, ANDROID_CLIENT_ID, WEB_CLIENT_ID, serverUrl } =
    Constants.manifest.extra

  // Configure Google login
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["profile", "email"],
    prompt: "select_account",
  })

  console.log(AuthSession.makeRedirectUri())

  // Handle response
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params

        try {
          const res = await axios.get(`${serverUrl}/mobile/google/callback`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${id_token}`, // optional depending on your backend
            },
          })

          const data = res.data

          if (data.success && data.token) {
            // Store JWT locally
            await AsyncStorage.setItem("token", data.token)
            console.log("Google login successful:", data)

            // Store user data for MessageProvider
            await AsyncStorage.setItem("user", JSON.stringify(data.user))

            // Navigate based on user role
            // if (data.user.role === "ADMIN") router.push("/admin")
            // else if (data.user.role === "OFFICER") router.push("/official")
            // else router.push("/dashboard")
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

// Create a wrapper component that provides the MessageProvider
export default function AppWrapper() {
  const [user, setUser] = useState({
    username: "samuel tale",
    role: "CITIZEN",
    profilePicture:
      "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  })
  const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   // Check if user is logged in
  //   const checkAuth = async () => {
  //     try {
  //       const userData = await AsyncStorage.getItem("user");
  //       if (userData) {
  //         setUser(JSON.parse(userData));
  //       }
  //     } catch (error) {
  //       console.error("Auth check failed:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <MessageProvider user={user}>
      <Welcome />
    </MessageProvider>
  )
}
