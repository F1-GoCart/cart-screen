import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { SaveUpItems } from "./save-up-item-list";

type Props = {
  index: number;
  saveUpItem: SaveUpItems;
};

export default function SaveUpItem({ saveUpItem }: Props) {
  return (
    <View style={styles.itemContainer}>
      <Image
        source={saveUpItem.image}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.itemName}>
        {saveUpItem.itemName} {saveUpItem.itemSize}
      </Text>
      <Text style={styles.itemPrice}>₱{saveUpItem.itemPrice.toFixed(2)}</Text>
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
