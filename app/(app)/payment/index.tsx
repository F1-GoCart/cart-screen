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
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import SuccessLogo from "~/assets/images/success.svg";
import { supabase } from "~/lib/supabase";

const PaymentScreen = () => {
  const [transactionId] = useState(uuidv4());
  const [isSuccess, setIsSuccess] = useState(false);
  const totalAmount = useItemStore((state) => state.totalAmount);
  const scannedItems = useItemStore((state) => state.scannedItems);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 300);
  const { seconds, minutes, pause } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      toast.error("Transaction Timeout", {
        description: "Your payment session has expired. Please try again.",
        style: {
          width: 400,
        },
        position: "bottom-center",
      });
      router.back();
    },
  });

  const successTime = new Date();
  successTime.setSeconds(successTime.getSeconds() + 5);
  const { seconds: successSeconds, start } = useTimer({
    expiryTimestamp: successTime,
    onExpire: () => {
      router.push("/payment/success");
    },
    autoStart: false,
  });

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
                {transactionId}
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
            {!isSuccess ? (
              <>
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
                    Scan or upload to pay via your{"\n"}bank or e-wallet app
                    within 5 minutes
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
                    e-wallet in case of dispute. For any refund requests,
                    contact your merchant directly.
                  </Text>
                  <Button
                    className="mt-8 w-full"
                    variant="secondary"
                    onPress={() => {
                      toast.error("Payment Cancelled", {
                        description: "You have cancelled the payment process.",
                        style: {
                          width: 400,
                        },
                        position: "bottom-center",
                      });
                      router.back();
                    }}
                    // Success on long press
                    onLongPress={async () => {
                      const { data: cart, error: cartError } = await supabase
                        .from("shopping_carts")
                        .select("user_id")
                        .eq("cart_id", cart_id)
                        .single();

                      if (cartError) {
                        console.error("Error fetching cart:", cartError);
                        console.error(
                          "Supabase debug info:",
                          cartError.details,
                        );
                        return;
                      }

                      const user_id = cart!.user_id;

                      const { error } = await supabase
                        .from("purchase_history")
                        .insert({
                          id: transactionId,
                          total_price: totalAmount,
                          change: 0,
                          mode_of_payment: "gcash",
                          user_id,
                          cart_id: parseInt(cart_id.split("-")[2]),
                        });

                      for (const item of scannedItems) {
                        const { error: itemError } = await supabase
                          .from("purchased_items")
                          .insert({
                            id: transactionId,
                            item_id: item.item_id,
                            quantity: item.quantity!,
                          });

                        if (itemError) {
                          console.error(
                            "Error inserting purchased item:",
                            itemError,
                          );
                          console.error(
                            "Supabase debug info:",
                            itemError.details,
                          );
                          return;
                        }
                      }

                      if (error) {
                        console.error(
                          "Error inserting purchase history:",
                          error,
                        );
                        console.error("Supabase debug info:", error.details);
                        return;
                      }

                      setIsSuccess(true);
                      pause();
                      start();
                    }}
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </>
            ) : (
              <>
                <View className="flex-row items-center gap-3">
                  <Text className="text-lg text-[#7a8394]">Payment Method</Text>
                  <Text className="rounded-full bg-[#e1e5ea] px-2 py-1 text-sm font-medium">
                    QR PH
                  </Text>
                </View>
                <View className="mb-10 mt-6 border-b border-gray-300" />
                <View className="items-center">
                  <SuccessLogo width={96} height={96} />
                  <Text className="my-5 text-2xl font-medium text-[#00985d]">
                    Payment received!
                  </Text>
                  <Text className="text-sm text-[#8c94a2]">
                    You will be redirected in {successSeconds} seconds
                  </Text>
                  <Text className="mt-5 rounded-md border-2 border-[#4188d8] bg-[#edf5fd] px-3 py-2 text-sm leading-[1.3] text-[#4188d8]">
                    Please keep the payment receipt sent by your partner bank or
                    e-wallet in case of dispute. For any refund requests,
                    contact your merchant directly.
                  </Text>
                  <Button
                    className="mt-8 w-full"
                    variant="secondary"
                    onPress={() => {
                      router.push("/payment/success");
                    }}
                  >
                    <Text>Redirect back to merchant</Text>
                  </Button>
                </View>
              </>
            )}
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
