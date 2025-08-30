"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  SafeAreaView,
  StatusBar,
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
} from "lucide-react-native"
import { useSelector } from "react-redux"

const userData = {
  name: "Samuel Tale",
  username: "samit",
  location: "Addis Ababa",
  joinDate: "Jan 2024",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  stats: {
    reports: 24,
    resolved: 18,
    comments: 156,
    saved: 42,
  },
}

const ProfileScreen = () => {
  const { user } = useSelector((store) => store.auth)
  const [showSettings, setShowSettings] = useState(false)
  const [anonymousReports, setAnonymousReports] = useState(false)
  const [language, setLanguage] = useState("English")

  const StatCard = ({ icon, label, count, onPress, colors }) => (
    <TouchableOpacity
      className={`p-5 rounded-lg ${colors[0]} min-w-[45%] flex-1 relative overflow-hidden`}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="p-3 rounded-lg bg-black/20">{icon}</View>
        <TrendingUp size={20} color="rgba(255,255,255,0.6)" />
      </View>
      <Text className="mb-1 text-2xl font-bold text-white">{count}</Text>
      <Text className="text-sm font-medium text-white/80 font-geist">
        {label}
      </Text>
      <View className="absolute w-16 h-16 rounded-full -bottom-4 -right-4 bg-white/10" />
    </TouchableOpacity>
  )

  const ActionButton = ({ icon, label, onPress, variant = "default" }) => (
    <TouchableOpacity
      className={`flex-row items-center p-2 border-b border-gray-100`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className={`p-2 rounded-lg mr-3 ${
          variant === "danger" ? "bg-red-200" : "bg-gray-100"
        }`}
      >
        {icon}
      </View>
      <Text className={`font-medium font-geist text-gray-800`}>{label}</Text>
    </TouchableOpacity>
  )

  const SettingsItem = ({
    icon,
    label,
    onPress,
    hasSwitch = false,
    switchValue = false,
    onSwitchChange,
  }) => (
    <View className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
      <View className="flex-row items-center flex-1">
        <View className="p-2 mr-3 bg-gray-100 rounded-lg">{icon}</View>
        <Text className="font-medium text-gray-800">{label}</Text>
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#e5e7eb", true: "#774287" }}
          thumbColor={switchValue ? "#ffffff" : "#f3f4f6"}
        />
      ) : (
        <TouchableOpacity onPress={onPress} className="p-2">
          <ArrowLeft
            size={16}
            color="#9ca3af"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
      )}
    </View>
  )

  if (showSettings) {
    return (
      <SafeAreaView className="flex-1 bg-purple-800">
        <StatusBar barStyle="light-content" backgroundColor="#774287" />
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            className="p-3 rounded-lg bg-white/20"
            onPress={() => setShowSettings(false)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text className="ml-4 text-2xl font-bold text-white">Settings</Text>
        </View>

        <ScrollView
          className="flex-1 bg-gray-50"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-3 p-6">
            <SettingsItem
              icon={<Globe size={20} color="#4549e6" />}
              label={`Change Language (${language})`}
              onPress={() =>
                setLanguage(language === "English" ? "Amharic" : "English")
              }
            />
            <SettingsItem
              icon={<Lock size={20} color="#774287" />}
              label="Anonymous Reports"
              hasSwitch={true}
              switchValue={anonymousReports}
              onSwitchChange={setAnonymousReports}
            />
            <SettingsItem
              icon={<Download size={20} color="#4549e6" />}
              label="Export My Data"
              onPress={() => console.log("Export data")}
            />
            <SettingsItem
              icon={<LogOut size={20} color="#f59e0b" />}
              label="Logout"
              onPress={() => console.log("Logout")}
            />
            <SettingsItem
              icon={<Trash2 size={20} color="#ef4444" />}
              label="Delete Account"
              onPress={() => console.log("Delete account")}
            />
            <SettingsItem
              icon={<HelpCircle size={20} color="#774287" />}
              label="Help & Support"
              onPress={() => console.log("Help & Support")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* <StatusBar barStyle="light-content" backgroundColor="#774287" /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="relative pb-20 overflow-hidden ">
          <View className="flex-row items-center justify-between px-6 pt-4 pb-6 bg-gray-900">
            <Text className="text-2xl font-bold text-white font-geist">
              My Profile
            </Text>
            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              className="p-2"
            >
              <Settings size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View className="p-8 mx-6 bg-white/70 rounded-xl">
            <View className="items-center">
              <View className="relative mb-6">
                <Image
                  source={{ uri: userData.avatar }}
                  className="w-32 h-32 border-4 border-gray-500 rounded-full"
                />
                <View className="absolute w-8 h-8 bg-blue-600 border-4 border-white rounded-full -bottom-1 -right-1" />
              </View>

              <View className="items-center">
                <Text className="text-xl font-medium text-gray-800 font-geist">
                  {user?.username}
                </Text>
                <Text className="mb-5 text-gray-500 font-geist">
                  {user?.email}
                </Text>
                <View className="flex-row space-x-3">
                  <View className="flex-row items-center">
                    <MapPin size={16} color="#774287" />
                    <Text className="ml-2 text-gray-500 font-geist">
                      {userData.location}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Calendar size={16} color="#4549e6" />
                    <Text className="ml-2 text-gray-500 font-geist">
                      Joined {userData.joinDate}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Decorative Elements */}
          {/* <View className="absolute w-64 h-64 rounded-full -top-32 -right-32 bg-white/5" />
          <View className="absolute w-48 h-48 rounded-full -bottom-24 -left-24 bg-white/5" /> */}
        </View>

        {/* Stats Section */}
        <View className="px-6 mb-10 -mt-10">
          <View className="flex-row flex-wrap gap-4">
            <StatCard
              icon={<FileText size={24} color="#ffffff" />}
              label="Reports"
              count={userData.stats.reports}
              onPress={() => console.log("View reports")}
              colors={["#3b82f6", "#2563eb"]}
            />
            <StatCard
              icon={<CheckCircle size={24} color="#ffffff" />}
              label="Resolved"
              count={userData.stats.resolved}
              onPress={() => console.log("View resolved")}
              colors={["#10b981", "#059669"]}
            />
          </View>
        </View>

        {/* Actions Section */}
        <View className="px-6 pt-6 mx-4 mt-8 mb-8 bg-white ">
          <Text className="mb-6 text-xl font-medium text-gray-800 font-geist">
            Quick Actions
          </Text>
          <View className="gap-3">
            <ActionButton
              icon={<Shield size={20} color="#774287" />}
              label="Privacy Settings"
              onPress={() => console.log("Privacy settings")}
            />
            <ActionButton
              icon={<Edit3 size={20} color="#4549e6" />}
              label="Edit Profile"
              onPress={() => console.log("Edit profile")}
            />
            <ActionButton
              icon={<LogOut size={20} color="#f59e0b" />}
              label="Logout"
              onPress={() => console.log("Logout")}
            />
            <ActionButton
              icon={<Trash2 size={20} color="#ef4444" />}
              label="Delete Account"
              onPress={() => console.log("Delete account")}
              variant="danger"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen
