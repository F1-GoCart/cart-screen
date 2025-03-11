import * as React from "react";
import { View, Text, Image } from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { SafeAreaView, StyleSheet } from "react-native";
import List from "../../components/cart-list";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { Database } from "~/lib/database.types";
import { router } from "expo-router";
import { useItemStore } from "~/stores/ItemsStore";
import GoCartBanner from "~/assets/images/go_cart_logo.svg";

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

export default function Checkout() {
  const items = useItemStore((state) => state.scannedItems);
  const totalAmount = useItemStore((state) => state.totalAmount);
  const totalItems = useItemStore((state) => state.totalItems);

  return (
    <View className="flex-1 pb-10 pl-5 pr-5 pt-10">
      <View className="mb-2 max-h-20 flex-row">
        <GoCartBanner width={300} />
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontWeight: 700,
              color: "#0FA958",
              fontSize: 46,
              fontFamily: "GothamBold",
            }}
          >
            CART PAYMENT
          </Text>
        </View>
      </View>

      <View className="flex-row gap-28">
        <Card className="mt-5 flex h-24 w-96 max-w-4xl justify-center rounded-3xl border-0 bg-[#F4F4F4]">
          <View className="flex-row items-center">
            <View className="flex-col p-3">
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#777777",
                  marginLeft: 10,
                  fontFamily: "GothamMedium",
                  marginBottom: 5,
                }}
              >
                Items: {totalItems}
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  color: "black",
                  fontFamily: "GothamBook",
                  marginLeft: 10,
                }}
              >
                TOTAL: {""}
                <Text
                  style={{
                    fontSize: 28,
                    color: "#0FA958",
                    fontFamily: "GothamBold",
                    marginLeft: 10,
                    fontWeight: "700",
                  }}
                >
                  {totalAmount.toFixed(2)}
                </Text>
              </Text>
            </View>
          </View>
        </Card>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            variant="default"
            size="icon"
            style={{
              backgroundColor: "#EE4E4E",
              marginTop: 20,
              width: 176,
              borderRadius: 32,
              height: 45,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.back()}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "GothamBold",
                  fontSize: 16,
                }}
              >
                CANCEL
              </Text>
            </View>
          </Button>
        </View>
      </View>

      <View className="flex flex-1 flex-row justify-between gap-2">
        <Card className="mt-5 flex h-full w-full max-w-4xl justify-center rounded-3xl border-0 bg-[#F4F4F4] pb-12 pl-7 pr-7 pt-11">
          <Card className="mt-7 h-full w-full rounded-3xl border-0 bg-[#E6E6E6]">
            <SafeAreaView style={styles.container}>
              <List scannedItems={items} showImage={false} swipeable={false} />
            </SafeAreaView>
          </Card>
          <View className="flex-row items-center">
            <View className="flex-col pb-7 pl-5 pt-7">
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#777777",
                  fontFamily: "GothamMedium",
                }}
              >
                Earned Points: 9.06
              </Text>
            </View>
          </View>
        </Card>
        <View className="ml-4 flex-col gap-3">
          <Card className="mt-5 flex h-32 w-full max-w-sm gap-3 rounded-3xl border-0 bg-[#F4F4F4] p-5">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: 700,
                  marginLeft: 10,
                  color: "black",
                  fontSize: 18,
                  fontFamily: "GothamMedium",
                }}
              >
                Current Points:{" "}
              </Text>
              <Text
                style={{
                  fontWeight: 400,
                  marginLeft: 5,
                  color: "black",
                  fontSize: 18,
                  fontFamily: "GothamBook",
                }}
              >
                9.06
              </Text>
            </View>
          </Card>
          <Card className="mt-1 flex h-4/6 w-full max-w-sm items-center justify-center gap-3 rounded-3xl border-0 bg-[#E1FFEF] p-5">
            <Text
              style={{
                fontWeight: 700,
                marginLeft: 10,
                color: "black",
                fontSize: 18,
                fontFamily: "GothamMedium",
              }}
            >
              Secure Payment via PayMongo
            </Text>

            <Image
              source={require("../../assets/images/payment_methods.png")}
              style={{
                width: "80%",
                height: 50,
                resizeMode: "contain",
              }}
            />

            <Svg width="178" height="178" viewBox="0 0 128 128" fill="none">
              <G ClipPath="url(#clip0_266_1170)">
                <Path
                  d="M117.333 12.4446H26.6667C23.8377 12.4446 19.7782 12.6664 17.7778 14.6668C15.7774 16.6672 16 20.2823 16 23.1112V44.4446H22.2222V17.3335H122.222L122.667 103.111H22.2222V76.4446H16V97.7779C16 100.607 15.7774 104.666 17.7778 106.667C19.7782 108.667 23.8377 108.445 26.6667 108.445H117.333C120.162 108.445 124.222 108.667 126.222 106.667C128.223 104.666 128 100.607 128 97.7779V23.1112C128 20.2823 128.223 16.6672 126.222 14.6668C124.222 12.6664 120.162 12.4446 117.333 12.4446ZM37.3333 76.4446V62.2356H0V55.1112H37.3333V44.4446L58.6667 60.4446L37.3333 76.4446ZM106.667 61.3467H69.3333V55.1112H106.667V61.3467ZM106.667 40.0001H69.3333V33.7779H106.667V40.0001ZM90.6667 81.7912H69.3333V76.4446H90.6667V81.7912Z"
                  fill="#A1B5AA"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_266_1170">
                  <Rect width="128" height="128" fill="white" />
                </ClipPath>
              </Defs>
            </Svg>

            <Text
              style={{
                fontWeight: 400,
                marginLeft: 15,
                marginRight: 15,
                color: "black",
                fontSize: 11,
                textAlign: "center",
                fontFamily: "GothamBook",
              }}
            >
              After clicking “Pay Now”, you will be redirected to Secure
              Payments via PayMongo to complete your purchase securely.
            </Text>
          </Card>
          <Button
            variant="default"
            size="icon"
            style={{
              backgroundColor: "#0FA958",
              marginTop: 5,
              marginRight: 15,
              marginBottom: 15,
              width: 340,
              borderRadius: 32,
              height: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.push("/payment")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: 700,
                  marginLeft: 10,
                  color: "white",
                  fontFamily: "GothamBold",
                  fontSize: 18,
                }}
              >
                PAY NOW
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});
