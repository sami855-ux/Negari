import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import { View } from "react-native"

import { store } from "@/store/index.js"
import { Provider } from "react-redux"

export default function RootLayout() {
  const [loaded] = useFonts({
    Geist: require("../assets/fonts/Geist-VariableFont_wght.ttf"),
    jakarta: require("../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf"),
    grotesk: require("../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf"),
  })

  if (!loaded) return <View />

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  )
}
