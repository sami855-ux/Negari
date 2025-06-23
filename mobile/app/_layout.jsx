import SafeScreen from "@/components/SafeScreen"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function RootLayout() {
  const [loaded] = useFonts({
    Geist: require("../assets/fonts/Geist-VariableFont_wght.ttf"),
    jakarta: require("../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
    grotesk: require("../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf"),
  })

  if (!loaded) return <View />

  return (
    <SafeAreaProvider>
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
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  )
}
