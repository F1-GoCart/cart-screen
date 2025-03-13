import { useEffect } from "react";
import { supabase } from "~/lib/supabase";
import useStatusStore from "~/stores/StatusStore";
import { ShoppingCart } from "~/lib/interfaces";
import { Href, Redirect, Stack } from "expo-router";
import { cart_id } from "~/lib/constants";

export default function AppLayout() {
  const status = useStatusStore((state) => state.status);
  const setStatus = useStatusStore((state) => state.setStatus);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("shopping_carts")
        .select("status")
        .eq("cart_id", cart_id)
        .single();

      if (error) {
        console.error("Error fetching status:", error);
        console.error("Supabase debug info:", error.details);
        return;
      }

      console.log(data.status);

      setStatus(data.status as "not_in_use" | "in_use");
    };

    fetchStatus();

    const channel = supabase
      .channel("shopping_carts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => {
          const data = payload.new as ShoppingCart;

          setStatus(data.status);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setStatus]);

  if (status === "not_in_use") {
    return <Redirect href={"/(auth)/idle" as Href} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "simple_push",
      }}
    />
  );
}
