import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { privateAPI, publicAPI } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = ['ALL', 'ELECTRONICS', 'BOOKS', 'FURNITURE', 'CLOTHING', 'OTHERS'];
const SELLING_CATEGORIES = ['ALL', 'SELL', 'RENT', 'EXCHANGE'];
const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price', order: 'asc' },
  { label: 'Price: High to Low', value: 'price', order: 'desc' },
  { label: 'Newest First', value: 'createdAt', order: 'desc' },
  { label: 'Oldest First', value: 'createdAt', order: 'asc' },
];

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sellingCategory, setSellingCategory] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, category, sellingCategory, maxPrice, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (category !== 'ALL') params.append('category', category);
      if (sellingCategory !== 'ALL') params.append('sellingCategory', sellingCategory);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await publicAPI.get(`/item?${params.toString()}`);

      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('ALL');
    setSellingCategory('ALL');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const handleProductPress = (productId) => {
    router.push(`/products/${productId}`);
  };

  const handleSortChange = (option) => {
    setSortBy(option.value);
    setSortOrder(option.order);
  };

  return (
    <View className="flex-1 bg-campus-pearl">
      {/* Header */}
      <View className="bg-campus-forest px-6 py-4 pt-12 pb-6">
        <Text className="text-3xl font-bold text-white text-center mb-4">
          All Items
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-campus-pearl rounded-lg px-3 py-2 mb-3">
          <Ionicons name="search" size={20} color="#788881" />
          <TextInput
            className="flex-1 ml-2 text-base text-campus-forest"
            placeholder="Search products..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#ABB2B0"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#788881" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Toggle */}
        <TouchableOpacity
          className="flex-row items-center justify-between bg-campus-mint rounded-lg px-4 py-3"
          onPress={() => setShowFilters(!showFilters)}
        >
          <View className="flex-row items-center">
            <Ionicons name="options" size={20} color="#2D473E" />
            <Text className="ml-2 text-campus-forest font-semibold">
              Filters & Sort
            </Text>
          </View>
          <Ionicons
            name={showFilters ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#2D473E"
          />
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <ScrollView className="bg-campus-pearl border-b border-campus-ash px-4 py-4 max-h-80">
          {/* Max Price */}
          <View className="mb-4">
            <Text className="text-label-lg text-campus-forest mb-2">
              Max Price
            </Text>
            <TextInput
              className="bg-white rounded-campus px-4 py-3 text-body-md text-campus-forest border border-campus-ash"
              placeholder="Enter max price"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              placeholderTextColor="#ABB2B0"
            />
          </View>

          {/* Category */}
          <View className="mb-4">
            <Text className="text-label-lg text-campus-forest mb-2">
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  className={`mr-2 px-4 py-2 rounded-campus ${
                    category === cat ? 'bg-campus-forest' : 'bg-campus-ash'
                  }`}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    className={`font-medium ${
                      category === cat ? 'text-white' : 'text-campus-forest'
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Selling Category */}
          <View className="mb-4">
            <Text className="text-label-lg text-campus-forest mb-2">
              Selling Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SELLING_CATEGORIES.map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`mr-2 px-4 py-2 rounded-campus ${
                    sellingCategory === type ? 'bg-campus-sage' : 'bg-campus-ash'
                  }`}
                  onPress={() => setSellingCategory(type)}
                >
                  <Text
                    className={`font-medium ${
                      sellingCategory === type ? 'text-white' : 'text-campus-forest'
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sort Options */}
          <View className="mb-4">
            <Text className="text-label-lg text-campus-forest mb-2">
              Sort By
            </Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={`${option.value}-${option.order}`}
                className={`mb-2 px-4 py-3 rounded-campus ${
                  sortBy === option.value && sortOrder === option.order
                    ? 'bg-campus-mint border border-campus-forest'
                    : 'bg-campus-ash'
                }`}
                onPress={() => handleSortChange(option)}
              >
                <Text
                  className={`font-medium ${
                    sortBy === option.value && sortOrder === option.order
                      ? 'text-campus-forest'
                      : 'text-campus-slate'
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            className="bg-campus-forest rounded-campus py-3 items-center"
            onPress={resetFilters}
          >
            <Text className="text-white font-semibold">Reset Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Products List */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#788881" />
            <Text className="text-campus-slate mt-4">Loading products...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center py-20 px-6">
            <Ionicons name="alert-circle-outline" size={64} color="#B85450" />
            <Text className="text-error text-lg font-semibold mt-4">Error</Text>
            <Text className="text-campus-slate text-center mt-2">{error}</Text>
            <TouchableOpacity
              className="bg-campus-sage rounded-campus py-3 px-6 mt-6"
              onPress={fetchProducts}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : products.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20 px-6">
            <Ionicons name="cube-outline" size={64} color="#ABB2B0" />
            <Text className="text-campus-slate text-center mt-4">
              No products found
            </Text>
            <Text className="text-campus-ash text-center mt-2">
              Try adjusting your filters or search terms
            </Text>
          </View>
        ) : (
          <View className="px-4 py-4">
            {products.map((product) => (
              <TouchableOpacity
                key={product._id}
                className="bg-white rounded-campus mb-4 overflow-hidden shadow-campus border border-campus-ash"
                onPress={() => handleProductPress(product._id)}
              >
                <View className="flex-row items-center justify-center">
                  {/* Product Image */}
                  <View className="w-28 h-28 bg-campus-ash ">
                    {product.picture  ? (
                      <Image
                        source={{ uri: product.picture }}
                        className="w-full h-full "
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full justify-center items-center">
                        <Ionicons name="image-outline" size={32} color="#ABB2B0" />
                      </View>
                    )}
                  </View>

                  {/* Product Info */}
                  <View className="flex-1 p-3">
                    <Text
                      className="text-title-md text-campus-forest mb-1"
                      numberOfLines={1}
                    >
                      {product.title}
                    </Text>
                    <Text
                      className="text-body-md text-campus-slate mb-2"
                      numberOfLines={2}
                    >
                      {product.description}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-title-lg font-bold text-campus-forest">
                        ${product.price}
                      </Text>
                      <View className="flex-row items-center space-x-2">
                        {product.category && (
                          <View className="bg-campus-mint px-2 py-1 rounded-campus">
                            <Text className="text-label-md text-campus-forest">
                              {product.category}
                            </Text>
                          </View>
                        )}
                        {product.sellingCategory && (
                          <View className="bg-campus-sage px-2 py-1 rounded-campus">
                            <Text className="text-label-md text-white">
                              {product.sellingCategory}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}