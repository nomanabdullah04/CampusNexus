import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { publicAPI } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";

export default function FeaturedItemCard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await publicAPI.get(
        `/item?limit=6&sortBy=createdAt&sortOrder=desc`
      );

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError("Failed to fetch featured products");
      }
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError(
        err.response?.data?.message || "Failed to load featured products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productId) => {
    router.push(`/products/${productId}`);
  };

  return (
    <View className="p-6 bg-campus-pearl">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-title-md text-campus-forest">
          Featured Items
        </Text>
        <TouchableOpacity onPress={() => router.push("/products")}>
          <Text className="text-campus-sage font-semibold">See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-10 justify-center items-center">
          <ActivityIndicator size="large" color="#788881" />
          <Text className="text-campus-slate mt-4">Loading featured items...</Text>
        </View>
      ) : error ? (
        <View className="py-10 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-error text-lg font-semibold mt-4">Error</Text>
          <Text className="text-campus-slate text-center mt-2">{error}</Text>
        </View>
      ) : products.length === 0 ? (
        <View className="py-10 justify-center items-center px-6">
          <Ionicons name="cube-outline" size={64} color="#ABB2B0" />
          <Text className="text-campus-slate text-center mt-4">
            No featured products available
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <TouchableOpacity
                key={product._id}
                className="bg-white w-[48%] mb-4 rounded-campus overflow-hidden shadow-campus border border-campus-ash"
                onPress={() => handleProductPress(product._id)}
              >
                {/* Image */}
                <View className="w-full h-32 bg-campus-ash">
                  {product.picture ? (
                    <Image
                      source={{ uri: product.picture }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full justify-center items-center">
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color="#ABB2B0"
                      />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View className="p-3">
                  <Text
                    className="text-body-md font-semibold text-campus-forest mb-1"
                    numberOfLines={1}
                  >
                    {product.title.length > 17
                      ? product.title.slice(0, 17) + "..."
                      : product.title}
                  </Text>
                  <Text className="text-label-md text-campus-slate mb-2" numberOfLines={1}>
                    {product.objectCategory || "General"}
                  </Text>
                  <Text className="text-title-sm font-bold text-campus-forest">
                    ${product.price}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
