import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { publicAPI } from "../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async (name, email, password) => {
    try {
      const res = await publicAPI.post("/auth/register", {
        name,
        email,
        password,
      });

      return { success: true};
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed. Please try again.",
      };
    }
  };

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }
    if (name.trim().length < 2) {
      Alert.alert("Error", "Name must be at least 2 characters long");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const result = await register(name.trim(), email.trim(), password);

      if (result.success) {
        Alert.alert(
          "Welcome to CampusLoop!",
          "Account created successfully!",
          [
            {
              text: "Get Started",
              onPress: () => router.replace("/(tabs)/Home")
            }
          ]
        );
      } else {
        Alert.alert("Registration Failed", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Header */}
      <View className="mt-12 mb-8">
        <Text className="text-3xl font-bold text-gray-800 text-center">
          Create Account
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Join CampusLoop today
        </Text>
      </View>

      {/* Form */}
      <View className="space-y-4">
        {/* Name Input */}
        <View>
          <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            editable={!loading}
            autoCapitalize="words"
          />
        </View>

        {/* Email Input */}
        <View className="mt-4">
          <Text className="text-gray-700 font-medium mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Password Input */}
        <View className="mt-4">
          <Text className="text-gray-700 font-medium mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className={`rounded-lg py-4 mt-6 ${loading ? 'bg-gray-400' : 'bg-campus-sage'}`}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row justify-center items-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white ml-2 font-semibold">Creating Account...</Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <Text className="text-xs text-gray-500 text-center mt-4">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>

        {/* Sign In Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/Sign">
            <Text className="text-blue-500 font-medium">Sign In</Text>
          </Link>
        </View>

        {/* Back to Home */}
        <View className="mt-8">
          <Link href="/" className="self-center">
            <Text className="text-gray-500">← Back to Home</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
