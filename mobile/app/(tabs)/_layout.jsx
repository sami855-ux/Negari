import { Tabs } from "expo-router"
import {
  Home,
  MapPinCheck,
  TrendingUp,
  MessageSquare,
} from "lucide-react-native"
import { Image, Text, Animated, Easing } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import CircledPlusIcon from "../../utils/CircleIcon"
import { useEffect, useRef } from "react"

const activeColor = "#774287" // Purple
const hoverColor = "#4549e6" // Blue
const inactiveColor = "#6B7280"

const profileImageUri = "https://i.pravatar.cc/300"

const AnimatedIcon = Animated.createAnimatedComponent(MapPinCheck) // Just using one as example, you'd create for each

const Layout = () => {
  const insets = useSafeAreaInsets()
  const scaleAnim = useRef(new Animated.Value(1)).current

  const animateIcon = (toValue: number) => {
    Animated.timing(scaleAnim, {
      toValue,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          paddingTop: 5,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="Activity"
        options={{
          title: "Activity",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{
                color: focused ? activeColor : inactiveColor,
                fontWeight: focused ? "600" : "500",
              }}
            >
              Activity
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => {
            const scale = useRef(new Animated.Value(1)).current
            
            useEffect(() => {
              if (focused) {
                Animated.spring(scale, {
                  toValue: 1.1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              } else {
                Animated.spring(scale, {
                  toValue: 1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              }
            }, [focused])
            
            return (
              <Animated.View style={{ transform: [{ scale }] }}>
                <TrendingUp
                  size={22}
                  color={focused ? activeColor : inactiveColor}
                  strokeWidth={focused ? 2.5 : 1.75}
                  fill={focused ? activeColor : "transparent"}
                />
              </Animated.View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Messages",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{
                color: focused ? activeColor : inactiveColor,
                fontWeight: focused ? "600" : "500",
              }}
            >
              Messages
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => {
            const scale = useRef(new Animated.Value(1)).current
            
            useEffect(() => {
              if (focused) {
                Animated.spring(scale, {
                  toValue: 1.1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              } else {
                Animated.spring(scale, {
                  toValue: 1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              }
            }, [focused])
            
            return (
              <Animated.View style={{ transform: [{ scale }] }}>
                <MessageSquare
                  size={22}
                  color={focused ? activeColor : inactiveColor}
                  strokeWidth={focused ? 2.5 : 1.75}
                  fill={focused ? activeColor : "transparent"}
                />
              </Animated.View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const scale = useRef(new Animated.Value(1)).current
            
            useEffect(() => {
              if (focused) {
                Animated.spring(scale, {
                  toValue: 1.15,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              } else {
                Animated.spring(scale, {
                  toValue: 1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              }
            }, [focused])
            
            return (
              <Animated.View  className="mb-10" style={{ 
                transform: [{ scale }],
                shadowColor: focused ? hoverColor : "transparent",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: focused ? 6 : 0,
              }}>
                <CircledPlusIcon
                  size={30}
                  active={focused}
                  color={focused ? hoverColor : inactiveColor}
                 
                />
              </Animated.View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          title: "Map",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{
                color: focused ? activeColor : inactiveColor,
                fontWeight: focused ? "600" : "500",
              }}
            >
              Map
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => {
            const scale = useRef(new Animated.Value(1)).current
            
            useEffect(() => {
              if (focused) {
                Animated.spring(scale, {
                  toValue: 1.1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              } else {
                Animated.spring(scale, {
                  toValue: 1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              }
            }, [focused])
            
            return (
              <Animated.View style={{ transform: [{ scale }] }}>
                <MapPinCheck
                  size={22}
                  color={focused ? activeColor : inactiveColor}
                  strokeWidth={focused ? 2.5 : 1.75}
                  fill={focused ? activeColor : "transparent"}
                />
              </Animated.View>
            )
          },
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{
                color: focused ? activeColor : inactiveColor,
                fontWeight: focused ? "600" : "500",
              }}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => {
            const scale = useRef(new Animated.Value(1)).current
            
            useEffect(() => {
              if (focused) {
                Animated.spring(scale, {
                  toValue: 1.1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              } else {
                Animated.spring(scale, {
                  toValue: 1,
                  friction: 3,
                  useNativeDriver: true,
                }).start()
              }
            }, [focused])
            
            return (
              <Animated.View style={{ transform: [{ scale }] }}>
                <Image
                  source={{ uri: profileImageUri }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    borderWidth: focused ? 2.5 : 1.5,
                    borderColor: focused ? hoverColor : "#E5E7EB",
                  }}
                />
              </Animated.View>
            )
          },
        }}
      />
    </Tabs>
  )
}

export default Layout