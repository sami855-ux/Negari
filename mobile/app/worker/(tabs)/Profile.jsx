import { View, Text, TouchableOpacity, Image } from "react-native"
import {
  Mail,
  Phone,
  Bell,
  Languages,
  User,
  Star,
  Shield,
  LogOut,
} from "lucide-react-native"
import { useDispatch } from "react-redux"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { logout, storage } from "../../../store/slices/auth"
import LogoutConfirmationModal from "../../../components/LogoutConfirmation"

const Profile = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [worker, setWorker] = useState(null)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  const handleLogout = async () => {
    try {
      await storage.removeItem("token")
      await storage.removeItem("user")

      dispatch(logout())
      setLogoutModalVisible(false)
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
          setWorker(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <>
      <View className="flex-row items-center justify-between h-16 px-4 bg-[#ce7a3b]">
        <Text className="text-lg font-semibold text-white font-geist">
          Profile
        </Text>
      </View>
      <View className="px-3 py-6 bg-white">
        {/* Header Section */}
        <View className="flex-row items-start">
          {/* Avatar */}
          <View className="relative">
            <Image
              source={{ uri: worker?.profilePicture }}
              className="object-cover w-24 h-24 border-2 border-white rounded-full"
            />
          </View>

          {/* Personal Info */}
          <View className="flex-1 ml-5">
            <Text className="text-2xl font-bold text-gray-800 capitalize font-geist">
              {worker?.username}
            </Text>

            <Text className="text-gray-500 font-jakarta mt-0.5 text-xs font-semibold">
              {worker?.role}
            </Text>

            {/* Stats Row */}
            <View className="flex-row mt-3 space-x-3">
              <View className="flex-row items-center px-2 py-1 rounded-full bg-[#f4b93b]">
                <Shield size={14} color="white" style={{ marginRight: 4 }} />
                <Text className="text-xs text-white font-geist">{4} yrs</Text>
              </View>
              <View className="flex-row items-center px-2 py-1 rounded-full bg-green-50">
                <View className="w-2 h-2 mr-1 rounded-full bg-emerald-400" />
                <Text className="text-xs font-medium text-green-700 font-geist">
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View className="mt-6 space-y-3">
          <View className="flex-row items-center p-3 bg-amber-50 rounded-xl">
            <Mail size={20} color="#f59e0b" style={{ marginRight: 12 }} />
            <View>
              <Text className="text-xs font-medium text-gray-400">Email</Text>
              <Text className="text-gray-800 font-geist">{worker?.email}</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="mt-6">
          <Text className="mb-3 text-lg font-semibold text-amber-800 font-geist">
            Settings
          </Text>

          <View className="space-y-4">
            <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl mb-4">
              <Bell size={22} color="#6b7280" style={{ marginRight: 12 }} />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Notifications
              </Text>
              <View className="w-2 h-2 rounded-full bg-violet-400" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl mb-4">
              <Languages
                size={22}
                color="#6b7280"
                style={{ marginRight: 12 }}
              />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Language
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl  mb-4"
              onPress={() =>
                router.push({
                  pathname: "/worker/ProfileDetail",
                  params: { userId: worker.id },
                })
              }
            >
              <User size={22} color="#6b7280" style={{ marginRight: 12 }} />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Profile Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl"
              onPress={() => setLogoutModalVisible(true)}
            >
              <LogOut size={20} color="#ef4444" style={{ marginRight: 12 }} />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </>
  )
}

export default Profile
