import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import Item from "./item";
import { Database } from "~/lib/database.types";

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

type Props = {
  scannedItems?: ScannedItem[];
  showImage?: boolean;
};

export default function List({ scannedItems, showImage = false }: Props) {
  if (scannedItems) {
    return (
      <View style={styles.container}>
        <FlatList
          data={scannedItems}
          renderItem={({ item, index }) => (
            <Item scannedItem={item} index={index} showImage={showImage} />
          )}
          keyExtractor={(item) => item.item_id.toString()}
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
