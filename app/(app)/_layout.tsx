import { useEffect } from "react";
import { supabase } from "~/lib/supabase";
import useStatusStore from "~/lib/statusStore";
import { ShoppingCart } from "~/lib/interfaces";
import { Href, Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const status = useStatusStore((state) => state.status);
  const setStatus = useStatusStore((state) => state.setStatus);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("shopping_carts")
        .select("status")
        .eq("cart_id", "go-cart-01")
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

  if (status === "in_use") {
    return <Slot />;
  }

  return <Slot />;
}
