import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import React from "react";
import { useRouter } from "expo-router";
export default function IdleScreen() {
  const router = useRouter();

  const activateCart = () => {
    router.push("/(auth)/login");
  };

  return (
    <TouchableOpacity
      onPress={activateCart}
      className="flex h-full w-full items-center justify-center"
    >
      <Text>TAP TO ACTIVATE CART</Text>
    </TouchableOpacity>
  );
}
