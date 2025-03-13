import React from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Item from "./item";
import { Database } from "~/lib/database.types";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

type Props = {
  scannedItems?: ScannedItem[];
  showImage?: boolean;
  onDelete?: (item_id: string) => void;
  swipeable?: boolean;
};

export default function List({
  scannedItems,
  showImage = false,
  swipeable,
  onDelete,
}: Props) {
  const renderRightActions = (item_id: string) => {
    if (!swipeable) return null;

    return (
      <View style={styles.deleteContainer}>
        <TouchableOpacity
          onPress={() => {
            onDelete?.(item_id);
          }}
          style={styles.deleteButton}
        >
          <Svg width="25" height="25" viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 6L18 9M13 20H21M5 16L4 20L8 19L19.586 7.414C19.9609 7.03895 20.1716 6.53033 20.1716 6C20.1716 5.46967 19.9609 4.96106 19.586 4.586L19.414 4.414C19.0389 4.03906 18.5303 3.82843 18 3.82843C17.4697 3.82843 16.9611 4.03906 16.586 4.414L5 16Z"
              stroke="#0FA958"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    );
  };

  if (scannedItems) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <FlatList
          data={scannedItems}
          renderItem={({ item, index }) => (
            <Swipeable
              renderRightActions={() =>
                renderRightActions(item.item_id.toString())
              }
            >
              <Item scannedItem={item} index={index} showImage={showImage} />
            </Swipeable>
          )}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </GestureHandlerRootView>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    marginVertical: 5,
  },
  deleteButton: {
    padding: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});
