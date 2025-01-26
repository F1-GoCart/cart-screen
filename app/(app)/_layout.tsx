import { useEffect } from "react";
import { supabase } from "~/lib/supabase";
import useStatusStore from "~/lib/statusStore";
import { ShoppingCart } from "~/lib/interfaces";
import { Href, Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const status = useStatusStore((state) => state.status);
  const setStatus = useStatusStore((state) => state.setStatus);

  useEffect(() => {
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [setStatus]);

  if (status === "not_in_use") {
    return <Redirect href={"/(auth)/login" as Href} />;
  }

  if (status === "in_use") {
    return <Slot />;
  }

  return <Slot />;
}
