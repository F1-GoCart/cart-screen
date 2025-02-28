import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, ViewToken } from "react-native";
import SuggestedItem from "./suggested-Item";
import type { SuggestedItems } from "./suggested-item-list";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  suggestedItemList: SuggestedItems[];
};

export default function SuggestedItemList({ suggestedItemList }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollX = useSharedValue(0);

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Animated.FlatList
        horizontal={true}
        data={suggestedItemList}
        renderItem={({ item, index }) => (
          <SuggestedItem
            suggestedItem={item}
            index={index}
            scrollX={scrollX}
            containerWidth={containerWidth}
          />
        )}
        onScroll={handleOnScroll}
        decelerationRate="fast"
        snapToInterval={containerWidth * 0.8 + 20}
        snapToAlignment="center"
        keyExtractor={(item) => item.itemName}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: (containerWidth - (containerWidth * 0.8 + 20)) / 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});
