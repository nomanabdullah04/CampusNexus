import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import sliderData from "../../assets/sliderLink.json";

const { width: screenWidth } = Dimensions.get("window");

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const { images } = sliderData;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      scrollToIndex(nextIndex);
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  return (
    <View className="mb-6 mt-6">
      {/* Slider Container */}
      <View className="mx-4 rounded-campus overflow-hidden shadow-campus">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="h-48"
        >
          {images.map((item, index) => (
            <View key={item.id} style={{ width: screenWidth - 32 }}>
              <Image
                source={{ uri: item.url }}
                style={styles.sliderImage}
                resizeMode="cover"
              />

            </View>
          ))}
        </ScrollView>
      </View>

      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-3">
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === activeIndex ? "bg-campus-forest" : "bg-campus-ash"
            }`}
          />
        ))}
      </View>

      {/* Bottom Text */}
      <View className="mt-4 px-4">
        <Text className="text-campus-slate text-body-md text-center">
          Discover amazing rental opportunities on CampusLoop
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderImage: {
    width: "100%",
    height: "100%",
  },
});

export default Slider;
