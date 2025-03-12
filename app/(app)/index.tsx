import * as React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SafeAreaView, StyleSheet } from "react-native";
import List from "../../components/cart-list";
import SuggestedItemList from "../../components/carousel-suggested-list";
import SaveUpItemList from "../../components/carousel-save-up-list";
import { suggestedItems } from "../../components/suggested-item-list";
import { saveUpItems } from "../../components/save-up-item-list";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { Database } from "~/lib/database.types";
import { router } from "expo-router";
import { cart_id as current_cart } from "~/lib/constants";
import AdminAuthorizationDialog from "~/components/admin-auth";
import { useItemStore } from "~/stores/ItemsStore";
import GoCartBanner from "~/assets/images/go_cart_logo.svg";
import { Searchbar } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner-native";

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

export default function Index() {
  const setGlobalItems = useItemStore((state) => state.setScannedItems);
  const setGlobalTotalItems = useItemStore((state) => state.setTotalItems);
  const setGlobalTotalAmount = useItemStore((state) => state.setTotalAmount);

  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const fetchItems = async () => {
    const cart_number = parseInt(current_cart.replace("go-cart-", ""));

    const { data, error } = await supabase
      .from("scanned_items")
      .select(
        `
      cart_id,
      item_id,
      scanned_date,
      quantity,
      product_details: item_id (
        id,
        name,
        size,
        price,
        category,
        image
      )
    `,
      )
      .eq("cart_id", cart_number);

    if (error) {
      console.error("Error fetching items:", error);
      return;
    }

    if (data) {
      setScannedItems(data as ScannedItem[]);
    }
  };

  const handleDelete = (item_id: string) => {
    setSelectedItemId(item_id);
    setDialogVisible(true);
  };

  const fetchFullItem = async (item_id: number) => {
    const { data, error } = await supabase
      .from("scanned_items")
      .select(
        `
        cart_id,
        item_id,
        scanned_date,
        quantity,
        product_details: item_id (
          id,
          name,
          size,
          price,
          category,
          image
        )
      `,
      )
      .eq("item_id", item_id)
      .single();

    if (error) {
      console.error("Error fetching full item details:", error);
      return null;
    }

    return data as ScannedItem;
  };

  useEffect(() => {
    fetchItems();
    const cart_number = parseInt(current_cart.replace("go-cart-", ""));

    const channel = supabase
      .channel("scanned_items")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scanned_items",
          filter: "cart_id=eq." + cart_number,
        },
        (payload) => {
          const { eventType, new: newItem } = payload;

          setScannedItems((prevItems) => {
            switch (eventType) {
              case "INSERT":
                if (newItem.cart_id.toString() === current_cart.slice(-1)) {
                  fetchFullItem(newItem.item_id).then((fullItem) => {
                    if (fullItem) {
                      setScannedItems((prevItems) => [...prevItems, fullItem]);
                    }
                  });
                }
                return prevItems;

              case "UPDATE":
                if (newItem.cart_id.toString() === current_cart.slice(-1)) {
                  fetchFullItem(newItem.item_id).then((fullItem) => {
                    if (fullItem) {
                      setScannedItems((prevItems) =>
                        prevItems.map((item) =>
                          item.item_id === newItem.item_id ? fullItem : item,
                        ),
                      );
                    }
                  });
                }
                return prevItems;

              default:
                return prevItems;
            }
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setTotalItems(() => {
      const totalItems = scannedItems.reduce(
        (sum, item) => sum + (item.quantity ?? 0),
        0,
      );

      return totalItems;
    });

    setTotalAmount(() => {
      const totalAmount = scannedItems.reduce(
        (sum, item) =>
          sum + (item.product_details.price ?? 0) * (item.quantity ?? 0),
        0,
      );

      return totalAmount;
    });

    setGlobalItems(scannedItems);
  }, [scannedItems]);

  useEffect(() => {
    setGlobalTotalItems(totalItems);
    setGlobalTotalAmount(totalAmount);
  }, [totalItems, totalAmount]);

  const {
    data: items,
    status,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["items", searchValue],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_details")
        .select()
        .like("name", `%${searchValue}%`)
        .order("name", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  if (status === "error") {
    toast.error(error.message);
  }
  console.log(items);

  return (
    <View className="flex-1 pb-10 pl-5 pr-5 pt-10">
      <View className="mb-2 flex-row justify-between">
        <GoCartBanner width={300} />
        <Searchbar
          placeholder="Search item"
          style={{
            width: 335,
          }}
          onChangeText={(text) => {
            setSearchValue(text);
          }}
          value={searchValue}
        />
      </View>
      <View className="flex flex-1 flex-row items-center justify-between gap-2">
        {searchValue ? (
          <Card className="mt-5 flex h-full w-full max-w-4xl rounded-3xl border-0 bg-[#F4F4F4] pb-12 pl-7 pr-7 pt-14">
            <Text className="text-4xl font-medium text-[#0fa958]">
              Results for "{searchValue}"
            </Text>
            <View>
              {/*  */}
            </View>
          </Card>
        ) : (
          <Card className="mt-5 flex h-full w-full max-w-4xl justify-center rounded-3xl border-0 bg-[#F4F4F4] pb-12 pl-7 pr-7 pt-14">
            <Card className="mt-5 h-full w-full rounded-3xl border-0 bg-[#E6E6E6]">
              <SafeAreaView style={styles.container}>
                <List
                  scannedItems={scannedItems}
                  showImage={true}
                  swipeable={true}
                  onDelete={handleDelete}
                />
              </SafeAreaView>
            </Card>
            <View className="flex-row">
              <Button
                variant="default"
                size="icon"
                style={{
                  backgroundColor: "#0FA958",
                  marginTop: 14,
                  marginRight: 15,
                  marginBottom: 15,
                  width: 340,
                  borderRadius: 32,
                  height: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => router.push("/checkout")}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Svg width="33" height="23" viewBox="0 0 23 13" fill="none">
                    <Path
                      d="M6.27508 5.22028L7.18078 4.31265L6.16187 3.27535H8.86278V1.97874H6.16187L7.19695 0.941445L6.27508 0.0338135L3.68739 2.62705L6.27508 5.22028ZM9.5097 13C9.86551 13 10.17 12.8731 10.4232 12.6194C10.6763 12.3657 10.8031 12.0604 10.8035 11.7034C10.804 11.3464 10.6772 11.0412 10.4232 10.7879C10.1691 10.5347 9.86464 10.4076 9.5097 10.4067C9.15475 10.4059 8.85005 10.5329 8.5956 10.7879C8.34114 11.043 8.21456 11.3481 8.21585 11.7034C8.21715 12.0586 8.34373 12.364 8.5956 12.6194C8.84747 12.8749 9.15217 13.0017 9.5097 13ZM3.04047 13C3.39628 13 3.70076 12.8731 3.95393 12.6194C4.20709 12.3657 4.33389 12.0604 4.33432 11.7034C4.33475 11.3464 4.20795 11.0412 3.95393 10.7879C3.6999 10.5347 3.39542 10.4076 3.04047 10.4067C2.68553 10.4059 2.38083 10.5329 2.12637 10.7879C1.87191 11.043 1.74533 11.3481 1.74662 11.7034C1.74792 12.0586 1.8745 12.364 2.12637 12.6194C2.37824 12.8749 2.68294 13.0017 3.04047 13ZM13.3912 1.33043V0.0338135H11.2726L8.52314 5.86859H3.99468L1.47168 1.33043H-6.67572e-05L3.21837 7.1652H8.79808L9.5097 8.46182H1.74662V9.75844H11.6931L9.76847 6.25757L12.0974 1.33043H13.3912Z"
                      fill="white"
                    />
                    <Path
                      d="M11.9565 6.03878H16.5797M12.7005 8.11124H20.1933M14.401 0.671631H19.8744M13.0725 2.58467H22"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </Svg>
                  <Text
                    style={{
                      fontWeight: 700,
                      marginLeft: 10,
                      color: "white",
                      fontSize: 16,
                      fontFamily: "GothamBold",
                    }}
                  >
                    CHECK OUT
                  </Text>
                </View>
              </Button>
              <View className="flex-col p-3">
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#777777",
                    marginLeft: 10,
                    fontFamily: "gotham-rounded-bold",
                    marginBottom: 5,
                  }}
                >
                  Items: {totalItems}
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    color: "black",
                    marginLeft: 10,
                    fontFamily: "GothamBook",
                  }}
                >
                  TOTAL: {""}
                  <Text
                    style={{
                      fontSize: 28,
                      color: "#0FA958",
                      marginLeft: 10,
                      fontWeight: "700",
                      fontFamily: "GothamBold",
                    }}
                  >
                    {totalAmount.toFixed(2)}
                  </Text>
                </Text>
              </View>
            </View>
          </Card>
        )}

        <Card className="mt-5 flex h-full w-full max-w-sm items-center justify-center gap-3 rounded-3xl border-0 bg-[#E1FFEF] p-5">
          <Card className="flex h-3/6 w-full max-w-sm items-center rounded-3xl border-0 bg-[#f9fcfb] pb-5">
            <Text
              style={{
                fontWeight: 600,
                color: "#005F42",
                fontFamily: "GothamMedium",
                textAlign: "center",
                paddingTop: 25,
                marginBottom: 10,
              }}
            >
              ITEMS YOU MIGHT CONSIDER BUYING
            </Text>

            <SafeAreaView style={styles.container}>
              <SuggestedItemList suggestedItemList={suggestedItems} />
            </SafeAreaView>
          </Card>
          <Card className="flex h-3/6 w-full max-w-sm items-center rounded-3xl border-0 bg-[#f9fcfb] pb-5">
            <Text
              style={{
                fontWeight: 600,
                color: "#FF0000",
                fontFamily: "GothamMedium",
                textAlign: "center",
                paddingTop: 25,
                marginBottom: 10,
              }}
            >
              SAVE UP!!!
            </Text>

            <SafeAreaView style={styles.container}>
              <SaveUpItemList saveUpItemList={saveUpItems} />
            </SafeAreaView>
          </Card>
        </Card>
      </View>
      {isDialogVisible && (
        <AdminAuthorizationDialog
          visible={isDialogVisible}
          onClose={() => setDialogVisible(false)}
          itemId={selectedItemId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});
