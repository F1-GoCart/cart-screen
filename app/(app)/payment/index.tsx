import * as React from "react";
import { View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useItemStore } from "~/stores/ItemsStore";
import { TextClassContext } from "~/components/ui/text";
import { cart_id } from "~/lib/constants";
import QRCode from "react-native-qrcode-svg";
import { useTimer } from "react-timer-hook";
import { router } from "expo-router";
import { toast } from "sonner-native";

const PaymentScreen = () => {
  const totalAmount = useItemStore((state) => state.totalAmount);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 300);
  const { seconds, minutes } = useTimer({ expiryTimestamp: time });

  return (
    <>
      <View className="bg-[#f9fafb]">
        <TextClassContext.Provider value="text-white">
          <View className="align-center m-auto w-full flex-row justify-between bg-[#37b47e] px-48 py-3">
            <View className="gap-1">
              <Text>You are paying</Text>
              <Text className="text-2xl font-semibold">GO CART</Text>
            </View>
            <View className="gap-1">
              <Text className="text-right">Transaction ID:</Text>
              <Text className="w-fit rounded-md border border-white px-2 py-1">
                ab0c5fe1-88b1-4434-a737-e8984952c24f
              </Text>
            </View>
          </View>
        </TextClassContext.Provider>
        <View className="elevation-lg m-auto my-16 max-w-4xl flex-row justify-self-end bg-white">
          <View className="flex-1 border-t-8 border-[#31a27c] bg-[#f9fafb] px-6 py-7">
            <View className="gap-2">
              <Text className="text-lg">Payment amount</Text>
              <Text className="text-3xl font-medium text-[##009559]">
                ₱ {totalAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            </View>
            <View className="my-6 border-b border-gray-300" />
            <View className="gap-2">
              <Text className="text-lg">Payment for</Text>
              <Text className="text-[#686f7c]">GO CART - {cart_id}</Text>
            </View>
          </View>
          <View className="align-center flex-1 px-8 py-10">
            <View className="flex-row items-center gap-3">
              <Text className="text-lg text-[#7a8394]">Payment Method</Text>
              <Text className="rounded-full bg-[#e1e5ea] px-2 py-1 text-sm font-medium">
                QR PH
              </Text>
            </View>
            <View className="mb-10 mt-6 border-b border-gray-300" />
            <View className="items-center">
              <Text className="text-2xl font-medium">Scan to Pay</Text>
              <Text className="mb-9 mt-3 text-center text-[#8c94a2]">
                Scan or upload to pay via your{"\n"}bank or e-wallet app within
                5 minutes
              </Text>
              <View className="m-auto">
                <QRCode
                  value="http://awesome.link.qr"
                  logo={require("~/assets/images/qrph.jpg")}
                  size={150}
                />
              </View>
              <Text className="mb-1 mt-2">PAYMONGO-GoCart</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-[#8c94a2]">Time remaining:</Text>
                <Text>
                  {minutes}m {seconds}s
                </Text>
              </View>
              <Text className="mt-5 rounded-md border-2 border-[#4188d8] bg-[#edf5fd] px-3 py-2 text-sm leading-[1.3] text-[#4188d8]">
                Please keep the payment receipt sent by your partner bank or
                e-wallet in case of dispute. For any refund requests, contact
                your merchant directly.
              </Text>
              <Button
                className="mt-8 w-full"
                variant="secondary"
                onPress={() => {
                  toast.error("Payment cancelled", {
                    style: {
                      width: 200,
                    },
                    position: "bottom-center",
                  });
                  router.back();
                }}
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
      <View className="absolute bottom-0 left-0">
        <Image source={require("~/assets/images/paymongo-footer.png")} />
      </View>
    </>
  );
};
export default PaymentScreen;
