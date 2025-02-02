import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import SuggestedItem from "./suggested-Item";
import type { SuggestedItems } from "./suggested-item-list";

type Props = {
  suggestedItemList: SuggestedItems[];
};

export default function SuggestedItemList({ suggestedItemList }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        data={suggestedItemList}
        renderItem={({ item, index }) => (
          <SuggestedItem suggestedItem={item} index={index} />
        )}
        keyExtractor={(item) => item.itemName}
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
