import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const Card = () => {
  return (
    <View className="bg-white rounded-xl shadow-md m-3 overflow-hidden">
      {/* Image Section */}
      <View className="relative">
        <Image
          source={{
            uri: "https://i.ibb.co/xYSs4VJ/ultrasonic-sensor.jpg",
          }}
          className="w-full h-40"
          resizeMode="cover"
        />

        {/* New Badge */}
        <View className="absolute top-2 left-2 bg-green-100 px-2 py-1 rounded">
          <Text className="text-green-700 text-xs font-semibold">New</Text>
        </View>

        {/* Price Tag */}
        <View className="absolute top-2 right-2 bg-gray-800 px-2 py-1 rounded">
          <Text className="text-white text-xs font-semibold">
            BDT 2.39/day
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-3">
        <Text className="text-base font-bold text-gray-900">
          Ultrasonic Sonar Sensor
        </Text>
        <Text className="text-xs text-gray-500 mt-1">ELECTRONICS</Text>

        {/* Tags */}
        <View className="flex-row flex-wrap mt-2">
          <Text className="bg-gray-100 text-gray-700 text-xs px-2 py-1 mr-2 rounded">
            iot
          </Text>
          <Text className="bg-gray-100 text-gray-700 text-xs px-2 py-1 mr-2 rounded">
            ultrasonic
          </Text>
          <Text className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            sensor
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity className="bg-campus-green mt-3 py-2 rounded">
          <Text className="text-center text-white font-semibold">
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
