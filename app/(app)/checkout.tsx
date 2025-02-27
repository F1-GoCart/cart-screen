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
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

// const getTotalItems = (items: CartItems[]) => {
//   return items.reduce((total, item) => total + item.itemQuantity, 0);
// };

// export const getTotalAmount = (items: CartItems[]) => {
//   return items.reduce(
//     (total, item) => total + item.itemPrice * item.itemQuantity,
//     0,
//   );
// };

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

export default function Checkout() {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("scanned_items").select(`
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
    `);

    if (error) {
      console.error("Error fetching items:", error);
      return;
    }

    if (data) {
      setScannedItems(data as ScannedItem[]);
    }
  };

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
  }, [scannedItems]);

  useEffect(() => {
    fetchItems();
  }, []);

  const [fontsLoaded] = useFonts({
    GothamBook: require("../../assets/fonts/gotham-book.otf"),
    GothamBold: require("../../assets/fonts/gotham-bold.ttf"),
    GothamMedium: require("../../assets/fonts/gotham-medium.otf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View className="flex-1 pb-10 pl-5 pr-5 pt-10">
      <View className="mb-2 max-h-20 flex-row">
        <Svg width="405" height="188" fill="none">
          <Path
            d="M123.788 27.336C117.684 27.336 113.484 23.052 113.484 17.256V17.2C113.484 11.628 117.824 7.064 123.76 7.064C127.288 7.064 129.416 8.016 131.46 9.752L128.744 13.028C127.232 11.768 125.888 11.04 123.62 11.04C120.484 11.04 117.992 13.812 117.992 17.144V17.2C117.992 20.784 120.456 23.416 123.928 23.416C125.496 23.416 126.896 23.024 127.988 22.24V19.44H123.648V15.716H132.16V24.228C130.144 25.936 127.372 27.336 123.788 27.336ZM145.829 27.336C139.781 27.336 135.441 22.828 135.441 17.256V17.2C135.441 11.628 139.837 7.064 145.885 7.064C151.933 7.064 156.273 11.572 156.273 17.144V17.2C156.273 22.772 151.877 27.336 145.829 27.336ZM145.885 23.36C149.357 23.36 151.765 20.616 151.765 17.256V17.2C151.765 13.84 149.301 11.04 145.829 11.04C142.357 11.04 139.949 13.784 139.949 17.144V17.2C139.949 20.56 142.413 23.36 145.885 23.36ZM177.677 27.336C171.909 27.336 167.625 22.884 167.625 17.256V17.2C167.625 11.628 171.825 7.064 177.845 7.064C181.541 7.064 183.753 8.296 185.573 10.088L182.829 13.252C181.317 11.88 179.777 11.04 177.817 11.04C174.513 11.04 172.133 13.784 172.133 17.144V17.2C172.133 20.56 174.457 23.36 177.817 23.36C180.057 23.36 181.429 22.464 182.969 21.064L185.713 23.836C183.697 25.992 181.457 27.336 177.677 27.336ZM187.485 27L195.885 7.26H199.861L208.261 27H203.753L201.961 22.604H193.673L191.881 27H187.485ZM195.213 18.796H200.421L197.817 12.44L195.213 18.796ZM211.286 27V7.4H220.246C222.738 7.4 224.67 8.1 225.958 9.388C227.05 10.48 227.638 12.02 227.638 13.868V13.924C227.638 17.088 225.93 19.076 223.438 20L228.226 27H223.186L218.986 20.728H215.598V27H211.286ZM215.598 16.92H219.966C222.066 16.92 223.27 15.8 223.27 14.148V14.092C223.27 12.244 221.982 11.292 219.882 11.292H215.598V16.92ZM236.084 27V11.376H230.12V7.4H246.36V11.376H240.396V27H236.084Z"
            fill="#0FA958"
          />
          <Path
            d="M117.685 44.11C116.508 44.11 115.397 43.703 114.473 42.878L115.287 41.91C116.024 42.548 116.761 42.911 117.718 42.911C118.554 42.911 119.082 42.526 119.082 41.943V41.921C119.082 41.371 118.774 41.074 117.344 40.744C115.705 40.348 114.781 39.864 114.781 38.445V38.423C114.781 37.103 115.881 36.19 117.41 36.19C118.532 36.19 119.423 36.531 120.204 37.158L119.478 38.181C118.785 37.664 118.092 37.389 117.388 37.389C116.596 37.389 116.134 37.796 116.134 38.302V38.324C116.134 38.918 116.486 39.182 117.96 39.534C119.588 39.93 120.435 40.513 120.435 41.789V41.811C120.435 43.252 119.302 44.11 117.685 44.11ZM124.534 44.132C122.851 44.132 121.553 42.911 121.553 41.118V41.096C121.553 39.435 122.73 38.071 124.391 38.071C126.239 38.071 127.174 39.523 127.174 41.195C127.174 41.316 127.163 41.437 127.152 41.569H122.884C123.027 42.515 123.698 43.043 124.556 43.043C125.205 43.043 125.667 42.801 126.129 42.35L126.91 43.043C126.36 43.703 125.601 44.132 124.534 44.132ZM122.873 40.689H125.854C125.766 39.831 125.26 39.16 124.38 39.16C123.566 39.16 122.994 39.787 122.873 40.689ZM128.588 44V35.97H129.919V44H128.588ZM131.955 44V39.336H131.218V38.225H131.955V37.807C131.955 37.158 132.12 36.674 132.428 36.366C132.736 36.058 133.165 35.904 133.737 35.904C134.199 35.904 134.518 35.97 134.815 36.058V37.18C134.551 37.092 134.32 37.037 134.034 37.037C133.528 37.037 133.264 37.312 133.264 37.917V38.236H134.804V39.336H133.286V44H131.955ZM142.821 44.132C140.577 44.132 138.905 42.383 138.905 40.172V40.15C138.905 37.961 140.544 36.168 142.876 36.168C144.295 36.168 145.153 36.663 145.89 37.367L145.021 38.368C144.405 37.796 143.745 37.411 142.865 37.411C141.391 37.411 140.324 38.621 140.324 40.128V40.15C140.324 41.657 141.391 42.889 142.865 42.889C143.811 42.889 144.416 42.504 145.076 41.888L145.945 42.768C145.142 43.604 144.262 44.132 142.821 44.132ZM147.213 44V35.97H148.544V39.094C148.918 38.544 149.457 38.071 150.359 38.071C151.668 38.071 152.427 38.951 152.427 40.304V44H151.096V40.7C151.096 39.798 150.645 39.281 149.853 39.281C149.083 39.281 148.544 39.82 148.544 40.722V44H147.213ZM156.696 44.132C155.013 44.132 153.715 42.911 153.715 41.118V41.096C153.715 39.435 154.892 38.071 156.553 38.071C158.401 38.071 159.336 39.523 159.336 41.195C159.336 41.316 159.325 41.437 159.314 41.569H155.046C155.189 42.515 155.86 43.043 156.718 43.043C157.367 43.043 157.829 42.801 158.291 42.35L159.072 43.043C158.522 43.703 157.763 44.132 156.696 44.132ZM155.035 40.689H158.016C157.928 39.831 157.422 39.16 156.542 39.16C155.728 39.16 155.156 39.787 155.035 40.689ZM163.357 44.132C161.63 44.132 160.354 42.779 160.354 41.129V41.107C160.354 39.457 161.63 38.071 163.368 38.071C164.468 38.071 165.15 38.478 165.689 39.072L164.864 39.963C164.457 39.534 164.028 39.237 163.357 39.237C162.389 39.237 161.685 40.073 161.685 41.085V41.107C161.685 42.141 162.4 42.977 163.423 42.977C164.05 42.977 164.512 42.68 164.93 42.251L165.733 43.043C165.161 43.681 164.49 44.132 163.357 44.132ZM166.957 44V35.97H168.288V40.766L170.697 38.192H172.314L170.004 40.557L172.391 44H170.851L169.102 41.492L168.288 42.339V44H166.957ZM175.841 44.132C174.07 44.132 172.761 42.779 172.761 41.129V41.107C172.761 39.446 174.081 38.071 175.863 38.071C177.645 38.071 178.954 39.424 178.954 41.085V41.107C178.954 42.757 177.634 44.132 175.841 44.132ZM175.863 42.977C176.941 42.977 177.623 42.13 177.623 41.129V41.107C177.623 40.084 176.886 39.237 175.841 39.237C174.774 39.237 174.092 40.073 174.092 41.085V41.107C174.092 42.119 174.829 42.977 175.863 42.977ZM182.312 44.121C181.003 44.121 180.244 43.241 180.244 41.888V38.192H181.575V41.492C181.575 42.394 182.026 42.911 182.818 42.911C183.588 42.911 184.127 42.372 184.127 41.47V38.192H185.458V44H184.127V43.098C183.753 43.648 183.214 44.121 182.312 44.121ZM189.078 44.099C188.099 44.099 187.406 43.67 187.406 42.394V39.336H186.669V38.192H187.406V36.597H188.737V38.192H190.299V39.336H188.737V42.185C188.737 42.702 189.001 42.911 189.452 42.911C189.749 42.911 190.013 42.845 190.277 42.713V43.802C189.947 43.989 189.573 44.099 189.078 44.099ZM197.789 44.11C196.612 44.11 195.501 43.703 194.577 42.878L195.391 41.91C196.128 42.548 196.865 42.911 197.822 42.911C198.658 42.911 199.186 42.526 199.186 41.943V41.921C199.186 41.371 198.878 41.074 197.448 40.744C195.809 40.348 194.885 39.864 194.885 38.445V38.423C194.885 37.103 195.985 36.19 197.514 36.19C198.636 36.19 199.527 36.531 200.308 37.158L199.582 38.181C198.889 37.664 198.196 37.389 197.492 37.389C196.7 37.389 196.238 37.796 196.238 38.302V38.324C196.238 38.918 196.59 39.182 198.064 39.534C199.692 39.93 200.539 40.513 200.539 41.789V41.811C200.539 43.252 199.406 44.11 197.789 44.11ZM201.977 44V35.97H203.308V39.094C203.682 38.544 204.221 38.071 205.123 38.071C206.432 38.071 207.191 38.951 207.191 40.304V44H205.86V40.7C205.86 39.798 205.409 39.281 204.617 39.281C203.847 39.281 203.308 39.82 203.308 40.722V44H201.977ZM211.559 44.132C209.788 44.132 208.479 42.779 208.479 41.129V41.107C208.479 39.446 209.799 38.071 211.581 38.071C213.363 38.071 214.672 39.424 214.672 41.085V41.107C214.672 42.757 213.352 44.132 211.559 44.132ZM211.581 42.977C212.659 42.977 213.341 42.13 213.341 41.129V41.107C213.341 40.084 212.604 39.237 211.559 39.237C210.492 39.237 209.81 40.073 209.81 41.085V41.107C209.81 42.119 210.547 42.977 211.581 42.977ZM216.027 45.76V38.192H217.358V39.16C217.787 38.555 218.392 38.071 219.327 38.071C220.702 38.071 222.033 39.16 222.033 41.085V41.107C222.033 43.032 220.713 44.121 219.327 44.121C218.37 44.121 217.765 43.637 217.358 43.098V45.76H216.027ZM219.019 42.966C219.932 42.966 220.68 42.251 220.68 41.107V41.085C220.68 39.963 219.921 39.226 219.019 39.226C218.117 39.226 217.325 39.974 217.325 41.085V41.107C217.325 42.229 218.117 42.966 219.019 42.966ZM223.397 45.76V38.192H224.728V39.16C225.157 38.555 225.762 38.071 226.697 38.071C228.072 38.071 229.403 39.16 229.403 41.085V41.107C229.403 43.032 228.083 44.121 226.697 44.121C225.74 44.121 225.135 43.637 224.728 43.098V45.76H223.397ZM226.389 42.966C227.302 42.966 228.05 42.251 228.05 41.107V41.085C228.05 39.963 227.291 39.226 226.389 39.226C225.487 39.226 224.695 39.974 224.695 41.085V41.107C224.695 42.229 225.487 42.966 226.389 42.966ZM230.788 37.301V36.036H232.218V37.301H230.788ZM230.843 44V38.192H232.174V44H230.843ZM233.913 44V38.192H235.244V39.094C235.618 38.544 236.157 38.071 237.059 38.071C238.368 38.071 239.127 38.951 239.127 40.304V44H237.796V40.7C237.796 39.798 237.345 39.281 236.553 39.281C235.783 39.281 235.244 39.82 235.244 40.722V44H233.913ZM243.319 45.782C242.362 45.782 241.471 45.54 240.723 45.089L241.218 44.088C241.834 44.473 242.494 44.704 243.286 44.704C244.474 44.704 245.123 44.088 245.123 42.922V42.471C244.639 43.098 244.034 43.538 243.077 43.538C241.713 43.538 240.437 42.526 240.437 40.821V40.799C240.437 39.083 241.724 38.071 243.077 38.071C244.056 38.071 244.661 38.522 245.112 39.061V38.192H246.443V42.812C246.443 43.791 246.19 44.517 245.706 45.001C245.178 45.529 244.364 45.782 243.319 45.782ZM243.429 42.416C244.353 42.416 245.134 41.756 245.134 40.821V40.799C245.134 39.842 244.353 39.193 243.429 39.193C242.505 39.193 241.779 39.831 241.779 40.788V40.81C241.779 41.767 242.516 42.416 243.429 42.416ZM255.13 44.132C252.886 44.132 251.214 42.383 251.214 40.172V40.15C251.214 37.961 252.853 36.168 255.185 36.168C256.604 36.168 257.462 36.663 258.199 37.367L257.33 38.368C256.714 37.796 256.054 37.411 255.174 37.411C253.7 37.411 252.633 38.621 252.633 40.128V40.15C252.633 41.657 253.7 42.889 255.174 42.889C256.12 42.889 256.725 42.504 257.385 41.888L258.254 42.768C257.451 43.604 256.571 44.132 255.13 44.132ZM264.396 44H263.076V43.285C262.68 43.758 262.075 44.121 261.195 44.121C260.095 44.121 259.127 43.494 259.127 42.328V42.306C259.127 41.019 260.128 40.403 261.481 40.403C262.185 40.403 262.636 40.502 263.087 40.645V40.535C263.087 39.732 262.581 39.292 261.657 39.292C261.008 39.292 260.524 39.435 259.996 39.655L259.633 38.588C260.271 38.302 260.898 38.104 261.844 38.104C263.56 38.104 264.396 39.006 264.396 40.557V44ZM263.109 41.899V41.569C262.768 41.437 262.295 41.338 261.778 41.338C260.942 41.338 260.447 41.679 260.447 42.24V42.262C260.447 42.812 260.942 43.12 261.569 43.12C262.449 43.12 263.109 42.625 263.109 41.899ZM265.979 44V38.192H267.31V39.501C267.673 38.632 268.344 38.038 269.367 38.082V39.49H269.29C268.124 39.49 267.31 40.249 267.31 41.789V44H265.979ZM272.47 44.099C271.491 44.099 270.798 43.67 270.798 42.394V39.336H270.061V38.192H270.798V36.597H272.129V38.192H273.691V39.336H272.129V42.185C272.129 42.702 272.393 42.911 272.844 42.911C273.141 42.911 273.405 42.845 273.669 42.713V43.802C273.339 43.989 272.965 44.099 272.47 44.099Z"
            fill="#0FA958"
          />
          <Path
            d="M27.9529 23.1031L31.9874 19.06L27.4486 14.4394H39.4799V8.66351H27.4486L32.0594 4.04284L27.9529 -0.000244141L16.426 11.5514L27.9529 23.1031ZM42.3617 57.7581C43.9466 57.7581 45.303 57.1931 46.4307 56.0629C47.5584 54.9328 48.1233 53.5726 48.1252 51.9823C48.1271 50.392 47.5623 49.0328 46.4307 47.9046C45.2991 46.7763 43.9428 46.2103 42.3617 46.2065C40.7806 46.2026 39.4233 46.7686 38.2898 47.9046C37.1563 49.0405 36.5924 50.3997 36.5982 51.9823C36.6039 53.5649 37.1678 54.9251 38.2898 56.0629C39.4117 57.2008 40.769 57.7658 42.3617 57.7581ZM13.5442 57.7581C15.1292 57.7581 16.4855 57.1931 17.6132 56.0629C18.741 54.9328 19.3058 53.5726 19.3077 51.9823C19.3096 50.392 18.7448 49.0328 17.6132 47.9046C16.4817 46.7763 15.1253 46.2103 13.5442 46.2065C11.9631 46.2026 10.6058 46.7686 9.4723 47.9046C8.33881 49.0405 7.77495 50.3997 7.78071 51.9823C7.78648 53.5649 8.35034 54.9251 9.4723 56.0629C10.5943 57.2008 11.9516 57.7658 13.5442 57.7581ZM59.6522 5.77559V-0.000244141H50.2144L37.967 25.991H17.7948L6.55597 5.77559H-8.79169e-06L14.3367 31.7669H39.1918L42.3617 37.5427H7.78071V43.3185H52.0876L43.5144 27.7238L53.8887 5.77559H59.6522Z"
            fill="#0FA958"
          />
          <Path
            d="M53.2609 26.7485H73.8551M56.5749 35.9804H89.9517M64.1498 2.84033H88.5314M58.2319 11.3621H98"
            stroke="#0FA958"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
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
              <List scannedItems={scannedItems} showImage={false} />
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
            onPress={() => router.push("/payment-success")}
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
