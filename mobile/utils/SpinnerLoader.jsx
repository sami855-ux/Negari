import React, { useEffect, useRef } from "react"
import { Animated, TouchableOpacity, Text } from "react-native"
import { Loader2 } from "lucide-react-native"

export const SpinningLoader = ({ size, color, style }) => {
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    )
    spinAnimation.start()

    return () => spinAnimation.stop()
  }, [spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <Animated.View style={[{ transform: [{ rotate: spin }] }, style]}>
      <Loader2 size={size} color={color} />
    </Animated.View>
  )
}
