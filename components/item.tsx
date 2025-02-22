import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { CartItems } from "./item-list";
import { Database } from "~/lib/database.types";

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

type Props = {
  index: number;
  item?: CartItems;
  scannedItem?: ScannedItem;
  showImage: boolean;
};

export default function Item({ item, scannedItem, showImage }: Props) {
  if (item) {
    return (
      <View style={styles.itemContainer}>
        {showImage && (
          <Image source={item.image} style={styles.image} resizeMode="cover" />
        )}
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

  if (scannedItem) {
    return (
      <View style={styles.itemContainer}>
        {showImage &&
          (scannedItem.product_details?.image ? (
            <Image
              source={{ uri: scannedItem.product_details.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{
                uri: "https://via.placeholder.com/150/000000/FFFFFF/?text=No+Image",
              }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        <View style={styles.detailsContainer}>
          <Text style={styles.itemName}>
            {scannedItem.product_details.name}{" "}
            {scannedItem.product_details.size}
          </Text>
          <Text style={styles.itemQuantity}>qtty here</Text>
        </View>
        <Text style={styles.itemPrice}>
          {/* ₱{scannedItem.product_details.price} */}₱
          {scannedItem.product_details.price?.toFixed(2) ?? "0.00"}
        </Text>
      </View>
    );
  }
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
