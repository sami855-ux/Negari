import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Provider } from "react-redux"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { View } from "react-native"

import SafeScreen from "@/components/SafeScreen"
import { store } from "@/store/index"
import { MessageProvider } from "@/components/MessageContext"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { storage } from "../store/slices/auth"
import { useEffect, useState } from "react"

export default function RootLayout() {
  const [user, setUser] = useState({})
  const [loaded] = useFonts({
    Geist: require("../assets/fonts/Geist-VariableFont_wght.ttf"),
    jakarta: require("../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
    grotesk: require("../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf"),
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await storage.getItem("user")
        if (token) {
          const parseToken = JSON.parse(token)

          setUser(parseToken)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      }
    }

    checkAuth()
  }, [])

  if (!loaded) return <View />

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <MessageProvider user={user}>
            <SafeScreen>
              <Stack>
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(auth)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="one/(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="one/report"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="one/chat"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="worker/(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="worker/ProfileDetail"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="worker/Resolve"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="worker/ReportDetails"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="worker/chat"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
            </SafeScreen>

            <StatusBar style="dark" />
          </MessageProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
