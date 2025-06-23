import { Tabs } from "expo-router"
import { Home, MapPinCheck, TrendingUp } from "lucide-react-native"
import { Image, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import CircledPlusIcon from "../../utils/CircleIcon"

const activeColor = "#4F46E5"
const inactiveColor = "#333"

const profileImageUri = "https://i.pravatar.cc/300"

const Layout = () => {
  const insets = useSafeAreaInsets()

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
          borderTopWidth: 1,
          paddingTop: 5,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 7,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{ color: focused ? activeColor : inactiveColor }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <Home
              size={22}
              color={focused ? activeColor : inactiveColor}
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Activity"
        options={{
          title: "Activity",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{ color: focused ? activeColor : inactiveColor }}
            >
              Activity
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <TrendingUp
              size={22}
              color={focused ? activeColor : inactiveColor}
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarLabel: () => null, // Hide label for the central plus
          tabBarIcon: ({ focused }) => (
            <CircledPlusIcon
              size={30}
              active={focused}
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          title: "Map",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{ color: focused ? activeColor : inactiveColor }}
            >
              Map
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <MapPinCheck
              size={22}
              color={focused ? activeColor : inactiveColor}
              strokeWidth={focused ? 2 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarLabel: ({ focused }) => (
            <Text
              className="font-geist"
              style={{ color: focused ? activeColor : inactiveColor }}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={{ uri: profileImageUri }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: focused ? 2 : 1,
                borderColor: focused ? activeColor : "#ccc",
              }}
            />
          ),
        }}
      />
    </Tabs>
  )
}

export default Layout
