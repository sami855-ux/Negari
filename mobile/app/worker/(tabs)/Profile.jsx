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

const Profile = () => {
  // Mock data
  const worker = {
    name: "Samuel Tale",
    role: "Senior Field Technician",
    email: "samitale@workforce.com",
    phone: "+251 (415) 555-0198",
    isActive: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
    rating: 4.8,
    yearsWithCompany: 3,
    lastActive: "2 hours ago",
  }

  return (
    <>
      <View className="flex-row items-center justify-between h-16 px-4 bg-[#ce7a3b]">
        <Text className="text-lg font-semibold text-white font-geist">
          Profile
        </Text>
      </View>
      <View
        className="px-3 py-6 bg-white"
        style={{
          elevation: 10,
          borderWidth: 1,
          borderColor: "#f3e8ff",
        }}
      >
        {/* Header Section */}
        <View className="flex-row items-start">
          {/* Avatar with decorative border */}
          <View className="relative">
            <View className="absolute rounded-full -inset-1 bg-gradient-to-r from-violet-400 to-purple-500 blur-sm opacity-20" />
            <Image
              source={{ uri: worker.avatarUrl }}
              className="object-cover w-24 h-24 border-2 border-white rounded-full"
            />
          </View>

          {/* Personal Info */}
          <View className="flex-1 ml-5">
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-gray-800 font-geist">
                {worker.name}
              </Text>
              <View className="ml-2 px-2 py-0.5 bg-amber-100 rounded-full flex-row items-center">
                <Star
                  size={14}
                  className="mr-1 text-amber-500"
                  fill="#f59e0b"
                />
                <Text className="text-xs font-jakarta text-amber-800">
                  {worker.rating}
                </Text>
              </View>
            </View>

            <Text className="text-gray-600  font-jakarta mt-0.5">
              {worker.role}
            </Text>

            {/* Stats Row */}
            <View className="flex-row mt-3 space-x-3">
              <View className="flex-row items-center px-2 py-1 rounded-full bg-[#f4b93b]">
                <Shield size={14} className="mr-1 text-white" />
                <Text className="text-xs text-white font-geist">
                  {worker.yearsWithCompany} yrs
                </Text>
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
            <Mail size={20} className="mr-3 text-amber-500" />
            <View>
              <Text className="text-xs font-medium text-gray-400">Email</Text>
              <Text className="text-gray-800 font-geist">{worker.email}</Text>
            </View>
          </View>

          <View className="flex-row items-center p-3 bg-amber-50 rounded-xl">
            <Phone size={20} className="mr-3 text-amber-500" />
            <View>
              <Text className="text-xs font-medium text-gray-400">Phone</Text>
              <Text className="text-gray-800 font-geist">{worker.phone}</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="mt-6">
          <Text className="mb-3 text-lg font-semibold text-amber-800 font-geist">
            Settings
          </Text>

          <View className="space-y-2">
            <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl">
              <Bell size={22} className="mr-3 text-gray-500" />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Notifications
              </Text>
              <View className="w-2 h-2 rounded-full bg-violet-400" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl">
              <Languages size={22} className="mr-3 text-gray-500" />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Language
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl">
              <User size={22} className="mr-3 text-gray-500" />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Profile Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center p-4 bg-white border border-gray-100 rounded-xl">
              <LogOut size={20} className="mr-3 text-rose-500" />
              <Text className="flex-1 text-[15px] font-medium text-gray-700 font-geist">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}

export default Profile
