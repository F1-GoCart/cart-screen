import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import type { SuggestedItems } from "./suggested-item-list";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  index: number;
  suggestedItem: SuggestedItems;
  scrollX: SharedValue<number>;
  containerWidth: number;
};

export default function SuggestedItem({
  index,
  suggestedItem,
  scrollX,
  containerWidth,
}: Props) {
  const itemWidth = containerWidth * 0.75;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [
              (index - 1) * itemWidth,
              index * itemWidth,
              (index + 1) * itemWidth,
            ],
            [-itemWidth * 0.1, 0, itemWidth * 0.1],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [
              (index - 1) * itemWidth,
              index * itemWidth,
              (index + 1) * itemWidth,
            ],
            [0.8, 1, 0.8],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.itemContainer, animatedStyle, { width: itemWidth }]}
    >
      <Image
        source={suggestedItem.image}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.itemName}>
        {suggestedItem.itemName} {suggestedItem.itemSize}
      </Text>
      <Text style={styles.itemPrice}>
        ₱{suggestedItem.itemPrice.toFixed(2)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#C3E8D4",
    backgroundColor: "white",
    marginHorizontal: 10,
    width: 280,
  },
  image: {
    width: 90,
    height: 130,
    resizeMode: "contain",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 250,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
});
