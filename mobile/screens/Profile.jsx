import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  SafeAreaView,
  StatusBar,
  ToastAndroid,
  Platform,
} from "react-native"
import {
  Settings,
  MapPin,
  FileText,
  CheckCircle,
  Shield,
  LogOut,
  Trash2,
  ArrowLeft,
  Globe,
  Lock,
  Download,
  HelpCircle,
  Edit3,
  Calendar,
  TrendingUp,
  User,
  Mail,
  Award,
  Bell,
  ChevronRight,
  Palette,
} from "lucide-react-native"
import { useDispatch, useSelector } from "react-redux"
import LogoutConfirmationModal from "../components/LogoutConfirmation"
import { logout, storage } from "../store/slices/auth"
import { useRouter } from "expo-router"
import defaultUser from "../assets/images/defaultUser.png"

const ProfileScreen = () => {
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()
  const router = useRouter()

  const [showSettings, setShowSettings] = useState(false)
  const [anonymousReports, setAnonymousReports] = useState(false)
  const [language, setLanguage] = useState("English")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  const handleLogout = async () => {
    try {
      await storage.removeItem("token")
      await storage.removeItem("user")

      dispatch(logout())
      setLogoutModalVisible(false)

      if (Platform.OS === "android") {
        ToastAndroid.show("Logout successful!", ToastAndroid.SHORT)
      } else {
        // fallback for iOS, or you can just leave it
        console.log("Logout successful!")
      }
      router.replace("/")
    } catch (error) {
      console.error("Error removing from storage:", error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await storage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      }
    }

    fetchUser()
  }, [])

  const ActionButton = ({ icon, label, onPress, color = "bg-purple-100" }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 mb-3 bg-white border border-gray-100 rounded-2xl"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className={`p-2 rounded-xl mr-3 ${color}`}>{icon}</View>
        <Text className="text-[15px] font-medium text-gray-800 font-geist">
          {label}
        </Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  )

  const SettingsItem = ({
    icon,
    label,
    onPress,
    hasSwitch = false,
    switchValue = false,
    onSwitchChange,
    value,
    color = "bg-purple-100",
  }) => (
    <View className="flex-row items-center justify-between p-4 mb-3 bg-white border border-gray-100 rounded-2xl">
      <View className="flex-row items-center flex-1">
        <View className={`p-2 rounded-xl mr-3 ${color}`}>{icon}</View>
        <Text className="font-medium text-gray-800 font-geist">{label}</Text>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#e5e7eb", true: "#774287" }}
          thumbColor={switchValue ? "#ffffff" : "#f3f4f6"}
        />
      ) : value ? (
        <TouchableOpacity onPress={onPress} className="flex-row items-center">
          <Text className="mr-2 text-gray-500 font-geist">{value}</Text>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onPress} className="p-1">
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  )

  if (showSettings) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <View className="flex-row items-center px-5 py-4 space-x-3 bg-white shadow-sm">
          <TouchableOpacity
            className="p-2 bg-gray-100 rounded-lg"
            onPress={() => setShowSettings(false)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#4b5563" />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-bold text-gray-800 font-geist">
            Settings
          </Text>
        </View>

        <ScrollView className="flex-1 p-5 bg-gray-50">
          <Text className="mb-4 text-lg font-bold text-gray-700 font-geist">
            Preferences
          </Text>

          <SettingsItem
            icon={<Globe size={20} color="#4549e6" />}
            label="Language"
            value={language}
            onPress={() =>
              setLanguage(language === "English" ? "Amharic" : "English")
            }
            color="bg-blue-100"
          />

          <SettingsItem
            icon={<Bell size={20} color="#f59e0b" />}
            label="Notifications"
            hasSwitch={true}
            switchValue={notifications}
            onSwitchChange={setNotifications}
            color="bg-amber-100"
          />

          <SettingsItem
            icon={<Palette size={20} color="#774287" />}
            label="Dark Mode"
            hasSwitch={true}
            switchValue={darkMode}
            onSwitchChange={setDarkMode}
          />

          <SettingsItem
            icon={<Lock size={20} color="#774287" />}
            label="Anonymous Reports"
            hasSwitch={true}
            switchValue={anonymousReports}
            onSwitchChange={setAnonymousReports}
          />

          <Text className="mt-6 mb-4 text-lg font-bold text-gray-700 font-geist">
            Account
          </Text>

          <SettingsItem
            icon={<Download size={20} color="#4549e6" />}
            label="Export My Data"
            onPress={() => console.log("Export data")}
            color="bg-blue-100"
          />

          <SettingsItem
            icon={<Shield size={20} color="#10b981" />}
            label="Privacy Policy"
            onPress={() => console.log("Privacy policy")}
            color="bg-green-100"
          />

          <SettingsItem
            icon={<HelpCircle size={20} color="#774287" />}
            label="Help & Support"
            onPress={() => console.log("Help & Support")}
          />

          <SettingsItem
            icon={<LogOut size={20} color="#f59e0b" />}
            label="Logout"
            onPress={() => console.log("Logout")}
            color="bg-amber-100"
          />

          <SettingsItem
            icon={<Trash2 size={20} color="#ef4444" />}
            label="Delete Account"
            onPress={() => console.log("Delete account")}
            color="bg-red-100"
          />
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Section */}
        <View className="pb-6 bg-white">
          <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
            <Text className="text-2xl font-bold text-gray-800 font-geist">
              Profile
            </Text>
            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              className="p-3 bg-gray-100 rounded-xl"
            >
              <Settings size={20} color="#4b5563" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View className="px-5">
            <View className="flex-row items-center p-5 space-x-3 border border-gray-100 bg-slate-100 rounded-xl">
              <View className="relative mr-8">
                <Image
                  source={{ uri: user?.profilePicture }}
                  className="w-20 h-20 border-2 border-white rounded-2xl"
                />
                <TouchableOpacity className="absolute p-1 bg-purple-600 rounded-full -bottom-1 -right-1">
                  <Edit3 size={14} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-xl font-bold text-gray-800 capitalize font-geist">
                  {user?.username}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Mail size={14} color="#774287" />
                  <Text className="ml-2 text-sm text-gray-500 font-geist">
                    {user?.email}
                  </Text>
                </View>
                <View className="flex-row items-center mt-2">
                  <View className="flex-row items-center px-2 py-1 bg-purple-100 rounded-full">
                    <Award size={15} color="#774287" />
                    <Text className="ml-1 text-xs font-semibold text-purple-700 font-jakarta">
                      {`${user?.role}`.charAt(0).toUpperCase() +
                        user?.role.slice(1).toLowerCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View className="px-5 mt-10 mb-8">
          <Text className="my-4 text-lg font-bold text-gray-800 font-geist">
            Account Settings
          </Text>

          <ActionButton
            icon={<Edit3 size={20} color="#774287" />}
            label="Profile Details"
            onPress={() => {
              router.push({
                pathname: "/one/ProfileDetail",
                params: {
                  userId: user.id,
                },
              })
            }}
          />

          <ActionButton
            icon={<Bell size={20} color="#f59e0b" />}
            label="Notifications"
            onPress={() => setShowSettings(true)}
            color="bg-amber-100"
          />

          <ActionButton
            icon={<HelpCircle size={20} color="#774287" />}
            label="Help & Support"
            onPress={() => console.log("Help & Support")}
          />

          <ActionButton
            icon={<LogOut size={20} color="#f59e0b" />}
            label="Logout"
            onPress={() => setLogoutModalVisible(true)}
            color="bg-amber-100"
          />
        </View>
      </ScrollView>

      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default ProfileScreen
