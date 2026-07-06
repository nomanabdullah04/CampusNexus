import { useRouter } from "expo-router";
import "nativewind";
import { View, Text, Animated, Easing, StatusBar } from "react-native";
import { useEffect, useRef } from "react";
import "../global.css";

export default function SplashScreen() {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, []);

  // Convert 0-1 value to percentage width
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View className="flex-1 items-center justify-center bg-white">
        {/* Logo/Brand - centered */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-6xl font-bold text-campus-forest mb-3">
            CampusLoop
          </Text>
          <Text className="text-lg text-gray-500 font-light">
            Your campus, your space.
          </Text>
        </View>

        {/* Animated Loading Bar - at very bottom */}
        <View className="absolute bottom-8 left-0 right-0 px-8">
          <View className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
            <Animated.View
              className="h-full bg-campus-forest rounded-full"
              style={{ width: progressWidth }}
            />
          </View>
        </View>
      </View>
    </>
  );
}View