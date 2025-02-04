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
      <Card className="w-full h-full max-h-[75%] items-center justify-around rounded-t-[40px] bg-go_cart_green pt-4 pb-4">
        <CardHeader>
          <CardTitle className="text-white font-extrabold tracking-[1px] text-3xl">
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
          <Text className="text-white text-3xl text-center font-light">
            Scan this with the{" "}
            <Text className="font-extrabold text-white text-3xl">
              Go Cart Mobile Application
            </Text>{" "}
            to activate!
          </Text>
        </CardFooter>
      </Card>
    </View>
  );
}
