import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { privateAPI } from '../../lib/api';
import { useUser } from '../../Context/UserContext';

const Post = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useUser();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    sellingCategory: 'RENT',
    availability: 'IN_STOCK',
    objectCategory: 'BOOKS',
    tags: '',
    picture: ''
  });

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated || !user) {
      Alert.alert(
        'Login Required',
        'Please login to create a post',
        [
          {
            text: 'Login',
            onPress: () => router.replace('/Sign')
          }
        ]
      );
    }
  }, [isAuthenticated, user]);

  const sellingCategories = ['RENT', 'SELL', 'FREE'];
  const availabilityOptions = ['IN_STOCK', 'OUT_OF_STOCK'];
  const objectCategories = ['BOOKS', 'ELECTRONICS', 'FURNITURE', 'CLOTHING', 'SPORTS', 'OTHER'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.picture.trim()) {
      Alert.alert('Error', 'Please enter an image URL');
      return false;
    }
    return true;
  };

  const handlePost = async () => {

    if (!user || !user._id) {
      Alert.alert('Error', 'You need to login first');
      router.replace('/Sign');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ownerId: user._id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        sellingCategory: formData.sellingCategory,
        availability: formData.availability,
        objectCategory: formData.objectCategory,
        tags: tagsArray,
        picture: formData.picture.trim()
      };

      console.log("Posting data:", postData);

      const response = await privateAPI.post('/item', postData);

      console.log("Post response:", response.data);

      if (response.data) {
        Alert.alert(
          'Success!',
          'Your post has been created successfully',
          [
            {
              text: 'View Posts',
              onPress: () => router.replace('/(tabs)/Profile')
            }
          ]
        );

        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          sellingCategory: 'RENT',
          availability: 'IN_STOCK',
          objectCategory: 'BOOKS',
          tags: '',
          picture: ''
        });
      }
    } catch (error) {
      console.error('Post creation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      if (error.response?.status === 401) {
        Alert.alert(
          'Session Expired',
          'Please login again',
          [
            {
              text: 'Login',
              onPress: () => router.replace('/Sign')
            }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to create post. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading if user is being fetched
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#788881" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-campus-pearl"
    >
      {/* Header with back button */}
      <View className="bg-campus-forest px-6 py-4 pt-12 pb-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
            disabled={loading}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View className="flex-1 items-center text-center">
            <Text className="text-2xl text-center font-bold text-white">
              Create Post
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 bg-campus-pearl" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-6">
          {/* User Info Display (Optional) */}
          <View className="bg-white rounded-lg p-4 mb-4 flex-row items-center">
            <View className="w-10 h-10 bg-campus-sage rounded-full items-center justify-center mr-3">
              <Text className="text-white font-bold text-lg">
                {user.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className="text-campus-forest font-semibold">
                Posting as
              </Text>
              <Text className="text-gray-600 text-sm">{user.name}</Text>
            </View>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Title */}
            <View>
              <Text className="text-campus-forest font-semibold mb-2">
                Title *
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="e.g., JavaScript Programming Book"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                editable={!loading}
              />
            </View>

            {/* Description */}
            <View className="mt-4">
              <Text className="text-campus-forest font-semibold mb-2">
                Description *
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            {/* Price */}
            <View className="mt-4">
              <Text className="text-campus-forest font-semibold mb-2">
                Price ($) *
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="0.00"
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>

            {/* Selling Category */}
            <View className="mt-4">
              <Text className="text-campus-forest font-semibold mb-2">
                Selling Category *
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {sellingCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`px-4 py-2 rounded-lg ${
                      formData.sellingCategory === category
                        ? 'bg-campus-sage'
                        : 'bg-white border border-gray-300'
                    }`}
                    onPress={() => handleInputChange('sellingCategory', category)}
                    disabled={loading}
                  >
                    <Text
                      className={`font-medium ${
                        formData.sellingCategory === category
                          ? 'text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Object Category */}
            <View className="mt-4">
              <Text className="text-campus-forest font-semibold mb-2">
                Item Category *
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {objectCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`px-4 py-2 rounded-lg ${
                      formData.objectCategory === category
                        ? 'bg-campus-sage'
                        : 'bg-white border border-gray-300'
                    }`}
                    onPress={() => handleInputChange('objectCategory', category)}
                    disabled={loading}
                  >
                    <Text
                      className={`font-medium ${
                        formData.objectCategory === category
                          ? 'text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Availability */}
            <View className="mt-4">
              <Text className="text-campus-forest font-semibold mb-2">
                Availability *
              </Text>
              <View className="flex-row gap-2">
                {availabilityOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    className={`flex-1 px-4 py-3 rounded-lg ${
                      formData.availability === option
                        ? 'bg-campus-sage'
                        : 'bg-white border border-gray-300'
                    }`}
                    onPress={() => handleInputChange('availability', option)}
                    disabled={loading}
                  >
                    <Text
                      className={`font-medium text-center ${
                        formData.availability === option
                          ? 'text-white'
                          : 'text-gray-700'
                      }`}
                    >
                      {option === 'IN_STOCK' ? 'Available' : 'Unavailable'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View className="mt-4">
              <Text className="text-campus-forest font-semibold mb-2">
                Tags (comma-separated)
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="e.g., Javascript, Textbook, Programming"
                value={formData.tags}
                onChangeText={(value) => handleInputChange('tags', value)}
                editable={!loading}
              />
              <Text className="text-xs text-gray-500 mt-1">
                Separate tags with commas
              </Text>
            </View>

            {/* Image URL */}
            <View className="mt-4">
              <Text className="text-campus-forest font-semibold mb-2">
                Image URL *
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                placeholder="https://example.com/image.jpg"
                value={formData.picture}
                onChangeText={(value) => handleInputChange('picture', value)}
                autoCapitalize="none"
                editable={!loading}
              />
              {formData.picture.trim() && (
                <View className="mt-3 rounded-lg overflow-hidden">
                  <Image
                    source={{ uri: formData.picture }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`mt-4 rounded-lg py-4 ${
                loading ? 'bg-gray-400' : 'bg-campus-sage'
              }`}
              onPress={handlePost}
              disabled={loading}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Posting...
                  </Text>
                </View>
              ) : (
                <View className="flex-row justify-center items-center">
                  <Ionicons name="add-circle-outline" size={24} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Create Post
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              className="mt-3 mb-6 rounded-lg py-4 bg-white border border-gray-300"
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text className="text-gray-700 font-semibold text-lg text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Post;