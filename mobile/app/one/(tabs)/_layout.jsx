"use client"

import { useEffect, useRef, useState } from "react"
import { Animated, View, Dimensions } from "react-native"
import { Tabs } from "expo-router"
import { Home, Map, User, MessageSquare, Zap } from "lucide-react-native"

const activeColor = "#00796B"
const inactiveColor = "#9CA3AF"
const bubbleColor = "#FFFFFF"

const screenWidth = Dimensions.get("window").width
const tabCount = 5
const tabWidth = screenWidth / tabCount

const useTabIconAnimation = (focused) => {
  const scale = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.2 : 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -8 : 0,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focused])

  return { scale, translateY, opacity }
}

const TabBarIcon = ({ focused, IconComponent }) => {
  const { scale, translateY, opacity } = useTabIconAnimation(focused)

  return (
    <View
      style={{ alignItems: "center", justifyContent: "center", height: 60 }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: bubbleColor,
          opacity,
          transform: [
            { translateY },
            {
              scale: scale.interpolate({
                inputRange: [1, 1.2],
                outputRange: [0.8, 1],
              }),
            },
          ],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        }}
      />

      <Animated.View
        style={{
          transform: [{ scale }, { translateY }],
          zIndex: 10,
        }}
      >
        <IconComponent
          size={24}
          color={focused ? activeColor : inactiveColor}
          strokeWidth={focused ? 2.5 : 1.75}
        />
      </Animated.View>
    </View>
  )
}

const TabBarWave = ({ activeIndex }) => {
  const left = useRef(new Animated.Value(activeIndex * tabWidth)).current
  const scaleX = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(left, {
        toValue: activeIndex * tabWidth + tabWidth / 2 - 20,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(scaleX, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleX, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [activeIndex])

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        left,
        width: 40,
        height: 4,
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <Animated.View
        style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: activeColor,
          transform: [{ scaleX }],
        }}
      />
    </Animated.View>
  )
}

export default function Layout() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70,
            backgroundColor: "#F8F9FA",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
        }}
        sceneContainerStyle={{ backgroundColor: "#f5f5f5" }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} IconComponent={Home} />
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(0),
          }}
        />

        {/* Activity */}
        <Tabs.Screen
          name="Activity"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} IconComponent={Zap} />
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(1),
          }}
        />

        {/* Messages */}
        <Tabs.Screen
          name="message"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} IconComponent={MessageSquare} />
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(2),
          }}
        />

        {/* Map */}
        <Tabs.Screen
          name="Map"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} IconComponent={Map} />
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(3),
          }}
        />

        {/* Profile */}
        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} IconComponent={User} />
            ),
          }}
          listeners={{
            focus: () => setActiveIndex(4),
          }}
        />
      </Tabs>

      <TabBarWave activeIndex={activeIndex} />
    </View>
  )
}
