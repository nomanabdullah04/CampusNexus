import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { privateAPI } from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Sign = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const res = await privateAPI.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = res.data.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      const savedToken = await AsyncStorage.getItem("accessToken");

      return { success: true };
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.message || "Login failed. Please try again."
      };
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        router.replace("/(tabs)/Home");
      } else {
        Alert.alert("Login Failed", result.error);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };





  return (
    <View className="flex-1 bg-primary-50 px-6 justify-center">
      <View className="mt-12 mb-8">
        <Text className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Sign in to continue to CampusLoop
        </Text>
      </View>


      <View className="space-y-4">
        <View>
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity className="self-end mt-2" disabled={loading}>
          <Text className="text-blue-500 font-medium">Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          className={`rounded-lg py-4 mt-6 ${loading ? 'bg-gray-400' : 'bg-campus-sage'}`}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mt-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/SignUp">
            <Text className="text-blue-500 font-medium">Sign Up</Text>
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

export default Sign;