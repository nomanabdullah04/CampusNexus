import { useRouter } from "expo-router";
import "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import "./global.css";
import Splash from "./Components/Splash";


export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/Home");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Splash />
    </View>
  );
}
