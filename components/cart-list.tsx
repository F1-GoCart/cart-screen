import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import Item from "./item";
import type { CartItems } from "./item-list";
import { Database } from "~/lib/database.types";

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

type Props = {
  itemList?: CartItems[];
  scannedItems?: ScannedItem[];
  showImage?: boolean;
};

export default function List({
  itemList,
  scannedItems,
  showImage = false,
}: Props) {
  if (itemList) {
    return (
      <View style={styles.container}>
        <FlatList
          data={itemList}
          renderItem={({ item, index }) => (
            <Item item={item} index={index} showImage={showImage} />
          )}
          keyExtractor={(item) => item.itemName}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  if (scannedItems) {
    return (
      <View style={styles.container}>
        <FlatList
          data={scannedItems}
          renderItem={({ item, index }) => (
            <Item scannedItem={item} index={index} showImage={showImage} />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
