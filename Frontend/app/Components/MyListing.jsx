import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MyListing = () => {
  return (
    <View className="flex-1 items-start justify-start bg-campus-pearl p-4">
      {/* Header */}

      {/* Listing Card */}
      <TouchableOpacity className="w-full max-w-md bg-white flex-row items-center p-4 rounded-2xl shadow-sm border border-gray-200">
        {/* Image Placeholder */}
        <View className="w-16 h-16 bg-gray-300 rounded-xl mr-4" />

        {/* Text Content */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900">
            Example Item
          </Text>
          <Text className="text-gray-500 mt-1">Available Now</Text>
        </View>

        {/* Arrow Icon (Right side) */}
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

export default MyListing;