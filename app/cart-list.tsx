import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import Item from "./item";
import type { CartItems } from "./item-List";

type Props = {
  itemList: CartItems[];
};

export default function List({ itemList }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={itemList}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
        keyExtractor={(item) => item.itemName}
        showsVerticalScrollIndicator={true}
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
