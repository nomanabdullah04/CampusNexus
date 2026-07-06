import React from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import eventsData from "../../assets/events.json";

const Events = () => {
  const router = useRouter();

  // Process events data to include image URIs
  const events = eventsData.map(event => ({
    ...event,
    image: { uri: event.image }
  }));

  const handleViewEvent = (event) => {
    router.push({
      pathname: "/screens/EventDetailScreen",
      params: { event: JSON.stringify(event) },
    });
  };

  return (
    <View className="flex-1 bg-campus-pearl">
      {/* Header */}
      <View className="bg-campus-forest px-6 py-4 pt-12 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Events
        </Text>
      </View>

      {/* Search Bar */}
      <View className="bg-white mx-4 mt-4 rounded-campus shadow-campus px-4 py-3 mb-4">
        <View className="flex-row items-center">
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-campus-forest"
          />
          <Ionicons name="mic-outline" size={20} color="#6B7280" />
        </View>
      </View>

      {/* Scrollable Cards */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {events.map((event) => (
          <View key={event.id} className="bg-white rounded-campus shadow-campus mb-4 overflow-hidden">
            <Image
              source={event.image}
              className="h-40 w-full"
              resizeMode="cover"
            />

            {/* Title and Date */}
            <View className="p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-semibold text-campus-forest flex-1 mr-2">
                  {event.title}
                </Text>
                <Text className="text-sm text-campus-slate">{event.date}</Text>
              </View>

              {/* Tags */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {event.tags.map((tag, index) => (
                  <View key={index} className="bg-campus-sage px-3 py-1 rounded-campus">
                    <Text className="text-white text-sm font-medium">{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Button */}
              <TouchableOpacity
                className="bg-campus-forest py-3 rounded-campus items-center"
                onPress={() => handleViewEvent(event)}
              >
                <Text className="text-white font-semibold text-base">View Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Events;