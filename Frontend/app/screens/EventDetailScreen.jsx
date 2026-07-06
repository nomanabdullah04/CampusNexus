import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const EventDetailScreen = () => {
  const router = useRouter();
  const { event } = useLocalSearchParams();

  // Add error handling for JSON parsing
  let eventData;
  try {
    eventData = JSON.parse(event);
    console.log("EventDetailScreen - Parsed event data:", eventData);
  } catch (error) {
    console.error("EventDetailScreen - Error parsing event data:", error);
    return (
      <View className="flex-1 bg-campus-pearl justify-center items-center">
        <Text className="text-red-500">Error loading event details</Text>
      </View>
    );
  }

  // Validate image URL - handle both string and object formats
  const getImageSource = () => {
    if (!eventData?.image) return null;

    // If image is already an object with uri property
    if (typeof eventData.image === 'object' && eventData.image.uri) {
      return { uri: eventData.image.uri };
    }

    // If image is a string URL
    if (typeof eventData.image === 'string') {
      return { uri: eventData.image };
    }

    return null;
  };

  const imageSource = getImageSource();
  console.log("EventDetailScreen - Raw image data:", eventData?.image);
  console.log("EventDetailScreen - Processed image source:", imageSource);

  return (
    <View className="flex-1 bg-campus-pearl">
      {/* Header */}
      <View className="bg-campus-forest px-6 py-4 pt-12 pb-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">
          Event Details
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <View className="bg-white mx-4 mt-4 rounded-campus overflow-hidden">
          {imageSource ? (
            <Image
              source={imageSource}
              className="h-60 w-full"
              resizeMode="cover"
              onLoad={() => console.log("Image loaded successfully")}
              onError={(error) => console.log("Image load error:", error)}
            />
          ) : (
            <View className="h-60 w-full justify-center items-center bg-campus-ash">
              <Ionicons name="image-outline" size={48} color="#ABB2B0" />
              <Text className="text-campus-slate mt-2">Image not available</Text>
            </View>
          )}
        </View>

        {/* Event Info */}
        <View className="bg-white mx-4 mt-4 rounded-campus shadow-campus px-6 py-6">
          <Text className="text-title-lg text-campus-forest mb-2">
            {eventData.title}
          </Text>
          <Text className="text-headline-sm font-bold text-campus-forest mb-4">
            {eventData.date}
          </Text>

          {/* Description */}
          <Text className="text-title-md text-campus-forest mb-2">
            Description
          </Text>
          <Text className="text-body-md text-campus-slate leading-6 mb-4">
            {eventData.description}
          </Text>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {eventData.tags.map((tag, index) => (
              <View key={index} className="bg-campus-sage px-3 py-1 rounded-campus">
                <Text className="text-white text-sm font-medium">{tag}</Text>
              </View>
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity className="bg-campus-forest py-4 rounded-campus items-center">
            <Text className="text-white font-bold text-body-md">Register for Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EventDetailScreen;