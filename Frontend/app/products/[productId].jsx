import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { publicAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@/Context/UserContext";


const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.get(`/item/${productId}`);
      if (response.data.success) setProduct(response.data.data);
      else setError("Failed to load product");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    console.log("User object:", JSON.stringify(user, null, 2));
    console.log("Product ownerId:", product?.ownerId);

    // Check which ID field exists in user object
    const userId = user?._id || user?.id || user?.userId;
    console.log("Resolved userId:", userId);

    if (product?.ownerId?._id && userId) {
      router.push({
        pathname: "/screens/ChatScreen",
        params: { buyerId: userId, sellerId: product.ownerId._id }
      });
    } else {
      Alert.alert("Unable to start chat", "User information missing. User ID: " + userId + ", Seller ID: " + product?.ownerId?._id);
    }
  };

  const handleAddToCart = () => {
    Alert.alert("Added to cart!");
  };

  const handleRentNow = () => {
    Alert.alert("Rent request sent!");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-campus-pearl">
        <ActivityIndicator size="large" color="#788881" />
        <Text className="text-campus-slate mt-4">Loading product details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-campus-pearl px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-error text-lg font-semibold mt-4">Error</Text>
        <Text className="text-campus-slate text-center mt-2">{error}</Text>
        <TouchableOpacity
          className="bg-campus-sage rounded-campus py-3 px-6 mt-6"
          onPress={fetchProductDetails}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-campus-pearl px-6">
        <Ionicons name="cube-outline" size={64} color="#ABB2B0" />
        <Text className="text-campus-slate text-center mt-4">
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-campus-pearl">
      {/* HEADER */}
      <View className="bg-campus-forest px-6 py-4 pt-12 pb-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">
          Product Details
        </Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <View className="bg-white shadow-campus mx-4 mt-4 rounded-campus overflow-hidden">
          <Image
            source={{ uri: product.picture }}
            style={{ width: "100%", height: 380 }}
            resizeMode="cover"
          />
        </View>

        {/* PRODUCT INFO */}
        <View className="bg-white mx-4 mt-4 rounded-campus shadow-campus px-6 py-6">
          <Text className="text-title-lg text-campus-forest mb-2">
            {product.title}
          </Text>
          <Text className="text-headline-sm font-bold text-campus-forest mb-4">
            ${product.price}
          </Text>

          {/* Tags */}
          <View className="flex-row flex-wrap mb-4">
            {product.objectCategory && (
              <View className="bg-campus-mint px-3 py-1.5 rounded-campus mr-2 mb-2">
                <Text className="text-campus-forest font-medium text-label-md">
                  {product.objectCategory}
                </Text>
              </View>
            )}
            {product.condition && (
              <View className="bg-campus-ash px-3 py-1.5 rounded-campus mr-2 mb-2">
                <Text className="text-campus-slate font-medium text-label-md">
                  {product.condition}
                </Text>
              </View>
            )}
            {product.sellingCategory && (
              <View className="bg-campus-sage px-3 py-1.5 rounded-campus mr-2 mb-2">
                <Text className="text-white font-medium text-label-md">
                  {product.sellingCategory}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text className="text-title-md text-campus-forest mb-2">
            Description
          </Text>
          <Text className="text-body-md text-campus-slate leading-6 mb-6">
            {product.description || "No description available."}
          </Text>

          {/* Seller Info */}
          <View className="border-t border-campus-ash pt-4">
            <Text className="text-title-md text-campus-forest mb-3">
              Seller Information
            </Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-campus-sage rounded-full items-center justify-center">
                <Text className="text-white font-bold text-lg">
                  {product.ownerId?.name?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="text-body-md font-semibold text-campus-forest">
                  {product.ownerId?.name || "Unknown Seller"}
                </Text>
                <Text className="text-label-md text-campus-slate">
                  {product.ownerId?.email}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ACTION BAR */}
      <View className="flex-row bg-white border-t border-campus-ash px-4 py-4 gap-3 mx-4 mb-4 rounded-campus">
        <TouchableOpacity
          className="flex-1 bg-campus-ash py-4 rounded-campus flex-row justify-center items-center"
          onPress={handleContactSeller}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="#2D473E" />
          <Text className="text-campus-forest font-bold text-body-md ml-1">Contact</Text>
        </TouchableOpacity>

        {product.sellingCategory === "SELL" ? (
          <TouchableOpacity
            className="flex-1 bg-campus-forest py-4 rounded-campus flex-row justify-center items-center"
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={20} color="white" />
            <Text className="text-white font-bold text-body-md ml-1">
              Add to Cart
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-1 bg-campus-sage py-4 rounded-campus flex-row justify-center items-center"
            onPress={handleRentNow}
          >
            <Ionicons name="cash-outline" size={20} color="white" />
            <Text className="text-white font-bold text-body-md ml-1">Rent Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
