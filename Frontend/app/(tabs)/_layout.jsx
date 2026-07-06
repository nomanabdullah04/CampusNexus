import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F6F2EE",
          borderTopWidth: 1,
          borderTopColor: "#D7E4C2",
          height: 60,
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarActiveTintColor: "#2D473E",
        tabBarInactiveTintColor: "#788881",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Post"
        options={{
          title: "Post",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#2D473E",
                justifyContent: "center",
                alignItems: "center",
                marginTop: -20,
              }}
            >
              <Ionicons
                name="add"
                size={28}
                color="#F6F2EE"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Events"
        options={{
          title: "events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

       <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

    </Tabs>

  );
}
