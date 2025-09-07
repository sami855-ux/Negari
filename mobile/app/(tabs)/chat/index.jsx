import { Stack } from "expo-router"
import ChatScreen from "../../../components/ChatScreen"

export default function Chat() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ChatScreen />
    </>
  )
}
