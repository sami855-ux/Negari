import "@/global.css"
import { Mail } from "lucide-react-native"
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import GoogleIcon from "@/utils/GoogleIcon"
import TelegramIcon from "@/utils/TelegramIcon"

const Welcome = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/welcome.png")} // Replace with your image path
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Overlay to make text more readable */}
      <View className="flex-1 bg-black/30">
        {/* Main content container */}
        <View className="flex-1 justify-end pb-5 px-6">
          {/* Auth buttons container */}
          <View className="space-y-4">
            {/* Continue with Google */}
            <TouchableOpacity className="flex-row items-center justify-center bg-black/50 py-3 rounded-lg mb-1">
              <GoogleIcon className="w-5 h-5" />
              <Text className="text-white font-medium ml-2 font-geist">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center bg-blue-500 py-3 rounded-lg">
              <TelegramIcon className="w-5 h-5" />
              <Text className="text-white font-medium ml-2 font-geist">
                Continue with Telegram
              </Text>
            </TouchableOpacity>
            <Text className="text-center text-white font-geist">Or</Text>
            {/* Continue with Email */}
            <TouchableOpacity
              className="bg-transparent border border-white py-3 rounded-full flex-row justify-center items-center"
              activeOpacity={0.8}
            >
              <Mail className="text-white mr-2" size={20} />
              <Text className="text-white font-medium font-geist">
                Continue with Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
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
