import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Provider } from "react-redux"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { View } from "react-native"

import SafeScreen from "@/components/SafeScreen"
import { store } from "@/store/index"
import { MessageProvider } from "@/components/MessageContext"

const user = {
  id: "1",
  username: "samuel tale",
  role: "CITIZEN",
  profilePicture:
    "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Geist: require("../assets/fonts/Geist-VariableFont_wght.ttf"),
    jakarta: require("../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
    grotesk: require("../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf"),
  })

  if (!loaded) return <View />

  return (
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
  )
}
