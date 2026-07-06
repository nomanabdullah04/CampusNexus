import { useRouter } from "expo-router";
import { useUser } from "../../Context/UserContext";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import MyRental from "../Components/MyRental";
import MyListing from "../Components/MyListing";

const Profile = () => {
  const { user, loading, error, clearUser, fetchUser } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("rent");

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearUser();
          router.replace("/Sign");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#788881" />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-red-500 text-lg font-semibold mt-4">Error</Text>
        <Text className="text-gray-600 text-center mt-2">{error}</Text>
        <TouchableOpacity
          className="bg-campus-sage rounded-lg py-3 px-6 mt-6"
          onPress={fetchUser}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-gray-600 text-center">
          Please login to view your profile
        </Text>
        <TouchableOpacity
          className="bg-campus-sage rounded-lg py-3 px-6 mt-4"
          onPress={() => router.replace("/Sign")}
        >
          <Text className="text-white font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-campus-pearl">
      {/* Header */}
      <View className="bg-campus-forest px-6 py-4 pt-12 pb-6">
        <Text className="text-3xl font-bold text-white text-center">
          Profile
        </Text>
      </View>

      {/* Profile Card */}
      <View className="bg-campus-pearl px-6 py-6">
        <View className="items-center mb-6">
          {user.picture ? (
            <Image
              source={{ uri: user.picture }}
              className="w-24 h-24 rounded-full mb-4"
            />
          ) : (
            <View className="w-24 h-24 bg-campus-sage rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={40} color="white" />
            </View>
          )}

          <Text className="text-2xl font-bold text-campus-forest mb-1">
            {user.name}
          </Text>
          <Text className="text-gray-600 mb-2">{user.email}</Text>

          {user.role && (
            <View className="bg-campus-sage px-4 py-1 rounded-full">
              <Text className="text-white text-sm font-medium">
                {user.role}
              </Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-campus-forest rounded-xl py-3 flex-row items-center justify-center mb-6"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-base ml-2">
            Logout
          </Text>
        </TouchableOpacity>

        {/* Tab Buttons */}
        <View className="flex-row justify-center mb-4">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg mx-1 ${
              activeTab === "rent" ? "bg-campus-forest" : "bg-gray-200"
            }`}
            onPress={() => setActiveTab("rent")}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "rent" ? "text-white" : "text-gray-700"
              }`}
            >
              My Rentals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg mx-1 ${
              activeTab === "listing" ? "bg-campus-forest" : "bg-gray-200"
            }`}
            onPress={() => setActiveTab("listing")}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "listing" ? "text-white" : "text-gray-700"
              }`}
            >
              My Listings
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <View className="flex-1 bg-gray-50">
        {activeTab === "rent" ? <MyRental /> : <MyListing />}
      </View>
    </View>
  );
};

export default Profile;
