import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyRental = () => {
  return (
     <View className="flex-1 items-center justify-start bg-campus-pearl p-4">
      {/* Header */}

      {/* Rental Card */}
      <TouchableOpacity className="w-full max-w-md bg-white flex-row items-center p-4 rounded-2xl shadow-sm border border-gray-200">
        {/* Image Placeholder */}
        <View className="w-16 h-16 bg-gray-300 rounded-xl mr-4" />

        {/* Text Content */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            Dji Camera
          </Text>
          <Text className="text-gray-500 mt-1">Rented Until Dec 15</Text>
        </View>

        {/* Arrow Icon (Right side) */}
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

export default MyRental;