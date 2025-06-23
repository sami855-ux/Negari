import "@/global.css"
import { useRouter } from "expo-router"
import { Mail, Rocket } from "lucide-react-native"
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import GoogleIcon from "@/utils/GoogleIcon"

const Welcome = () => {
  const router = useRouter()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/welcome.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay to make text more readable */}
        <View className="flex-1 bg-black/30">
          {/* Main content container */}
          <View className="justify-end flex-1 px-6 pb-5">
            {/* Auth buttons container */}
            <View className="absolute bottom-0 left-0 right-0 px-6 py-8 space-y-4 h-80 bg-[#19191b]/90 rounded-t-[34px]">
              {/* Continue with Google */}
              <TouchableOpacity className="flex-row items-center justify-center py-3 mb-5 rounded-xl bg-black/50">
                <GoogleIcon className="w-5 h-5" />
                <Text className="ml-2 font-medium text-white font-geist">
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex flex-row items-center justify-center py-3 bg-blue-500 rounded-xl">
                <Rocket size={18} color="white" />
                <Text className="ml-2 font-medium text-white font-geist">
                  Continue with Telegram
                </Text>
              </TouchableOpacity>
              <Text className="my-4 text-center text-white font-geist">Or</Text>
              {/* Continue with Email */}
              <TouchableOpacity
                className="flex-row items-center justify-center gap-3 py-3 bg-transparent border-[#29292a] border rounded-xl"
                activeOpacity={0.8}
                onPress={() => router.push("/(auth)")}
              >
                <Mail className="mr-2 text-white" size={20} color={"white"} />
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
})

export default Welcome
