import { View } from "react-native";
import { supabase } from "~/lib/supabase";
import { Text } from "~/components/ui/text";
import React, { useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import useStatusStore from "~/lib/statusStore";

export default function LoginScreen() {
  const setStatus = useStatusStore((state) => state.setStatus);

  const startSession = async () => {
    const { error } = await supabase
      .from("shopping_carts")
      .update({ status: "in_use" })
      .eq("cart_id", "go-cart-01");

    if (error) {
      console.error("Error updating status: ", error.message);
    }
  };

  return (
    <View className="items-center justify-between pt-32">
      <Text onPress={startSession}>Put logo here!</Text>
      <Card className="bg-go_cart_green h-full max-h-[75%] w-full items-center justify-around rounded-t-[40px] pb-4 pt-4">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-[1px] text-white">
            ACTIVATE CARD WITH QR CODE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QRCode
            size={300}
            color="white"
            backgroundColor="#0FA958"
            value="go-cart-01"
          />
        </CardContent>
        <CardFooter className="max-w-lg">
          <Text className="text-center text-3xl font-light text-white">
            Scan this with the{" "}
            <Text className="text-3xl font-extrabold text-white">
              Go Cart Mobile Application
            </Text>{" "}
            to activate!
          </Text>
        </CardFooter>
      </Card>
    </View>
  );
}
