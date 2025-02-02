import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import SuggestedItem from "./suggested-Item";
import SaveUpItem from "./save-up-item";
import type { SaveUpItems } from "./save-up-item-list";

type Props = {
  saveUpItemList: SaveUpItems[];
};

export default function SaveUpItemList({ saveUpItemList }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={true}
        data={saveUpItemList}
        renderItem={({ item, index }) => (
          <SaveUpItem saveUpItem={item} index={index} />
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
