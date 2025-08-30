import { Tabs } from "expo-router"
import {
  Home,
  Compass,
  Heart,
  ShoppingBag,
  User,
  ClipboardList,
} from "lucide-react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated"
import React from "react"
import { Image } from "react-native"

const activeColor = "#e6a417"
const inactiveColor = "#A0A0A0"

// Random avatar image URL (using DiceBear avatars)
const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`

const AnimatedTabItem = ({ focused, icon: Icon, label, isProfile = false }) => {
  const scale = useSharedValue(1)
  const textOpacity = useSharedValue(focused ? 1 : 0.8)

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    color: focused ? activeColor : inactiveColor,
    fontWeight: focused ? "600" : "500",
  }))

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 8,
      stiffness: 300,
    })
    textOpacity.value = withSpring(focused ? 1 : 0.8)
  }, [focused])

  return (
    <Animated.View style={{ alignItems: "center" }}>
      <Animated.View style={iconStyle}>
        {isProfile ? (
          <Image
            source={{ uri: randomAvatar }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: focused ? 2 : 1,
              borderColor: focused ? activeColor : inactiveColor,
            }}
          />
        ) : (
          <Icon
            size={20}
            color={focused ? activeColor : inactiveColor}
            strokeWidth={focused ? 2 : 1.8}
            // fill={focused ? activeColor : "transparent"}
          />
        )}
      </Animated.View>
      <Animated.Text
        style={[
          textStyle,
          {
            fontSize: 12,
            marginTop: 4,
          },
        ]}
        className="font-jakarta"
      >
        {label}
      </Animated.Text>
    </Animated.View>
  )
}

const Layout = () => {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // We'll handle labels ourselves
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0.5,
          borderTopColor: "#E5E5E5",
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          height: 70 + (insets.bottom > 0 ? insets.bottom : 8),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabItem
              focused={focused}
              icon={ClipboardList}
              label="Tasks"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabItem focused={focused} icon={Compass} label="Map" />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabItem
              focused={focused}
              icon={User}
              label="Profile"
              isProfile={true}
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default Layout
