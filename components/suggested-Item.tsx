import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { SuggestedItems } from "./suggested-item-list";

type Props = {
  index: number;
  suggestedItem: SuggestedItems;
};

export default function SuggestedItem({ suggestedItem }: Props) {
  return (
    <View style={styles.itemContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#F5FFFA",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    elevation: 5,
    marginHorizontal: 10,
  },
  image: {
    width: 120,
    height: 160,
    resizeMode: "contain",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    maxWidth: 250,
    textAlign: "center",
    marginTop: 10,
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
});
