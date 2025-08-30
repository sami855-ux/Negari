import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Provider } from "react-redux"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { View } from "react-native"

import SafeScreen from "@/components/SafeScreen"
import { store } from "@/store/index"

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
              name="(tabs)"
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
          </Stack>
        </SafeScreen>

        <StatusBar style="dark" />
      </Provider>
    </SafeAreaProvider>
  )
}
