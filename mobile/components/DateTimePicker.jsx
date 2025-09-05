import React, { useState } from "react"
import { View, Text, TouchableOpacity, Platform } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Clock, Calendar, ChevronDown } from "lucide-react-native"

const DateTimePickerComponent = ({ formValues, setValue }) => {
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Format today's date as a default
  const today = new Date()
  const defaultDate = today.toDateString()
  const defaultTime = today.toTimeString().slice(0, 5)

  // Handle time selection
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios") // keep open on iOS
    if (selectedTime) {
      const formattedTime = selectedTime.toTimeString().slice(0, 5)
      setValue("time", formattedTime)
    }
  }

  // Handle date selection
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      const formattedDate = selectedDate.toDateString()
      setValue("date", formattedDate)
    }
  }

  return (
    <View className="my-6">
      <Text className="mb-3 text-lg font-semibold text-gray-800 font-geist">
        Time of Issue
      </Text>

      <View className="flex-row gap-4">
        {/* Date Picker */}
        <TouchableOpacity
          className="flex-1 p-4 bg-white border border-gray-200 rounded-xl "
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-lg">
                <Calendar size={18} color="#3B82F6" />
              </View>
              <Text className="text-sm font-medium text-gray-700 font-geist">
                Date
              </Text>
            </View>
            <ChevronDown size={16} color="#9CA3AF" />
          </View>
          <Text className="text-base font-semibold text-gray-900 font-geist pl-13">
            {formValues.date || defaultDate}
          </Text>
        </TouchableOpacity>

        {/* Time Picker */}
        <TouchableOpacity
          className="flex-1 p-4 bg-white border border-gray-200 rounded-xl "
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 bg-purple-100 rounded-lg">
                <Clock size={18} color="#8B5CF6" />
              </View>
              <Text className="text-sm font-medium text-gray-700 font-geist">
                Time
              </Text>
            </View>
            <ChevronDown size={16} color="#9CA3AF" />
          </View>
          <Text className="text-base font-semibold text-gray-900 font-geist pl-13">
            {formValues.time || defaultTime}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formValues.date ? new Date(formValues.date) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
          accentColor="#3B82F6"
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={
            formValues.time
              ? new Date(`1970-01-01T${formValues.time}:00`)
              : new Date()
          }
          mode="time"
          display="default"
          onChange={onTimeChange}
          accentColor="#8B5CF6"
        />
      )}
    </View>
  )
}

export default DateTimePickerComponent
