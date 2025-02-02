import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { CartItems } from "./item-list";

type Props = {
  index: number;
  item: CartItems;
};

export default function Item({ item }: Props) {
  return (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemName}>
          {item.itemName} {item.itemSize}
        </Text>
        <Text style={styles.itemQuantity}>x{item.itemQuantity}</Text>
      </View>
      <Text style={styles.itemPrice}>₱{item.itemPrice.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemQuantity: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
