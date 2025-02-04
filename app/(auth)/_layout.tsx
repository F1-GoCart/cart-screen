import useStatusStore from "~/lib/statusStore";
import { Href, Redirect, Slot } from "expo-router";
import { useEffect } from "react";
import { supabase } from "~/lib/supabase";
import { ShoppingCart } from "~/lib/interfaces";

export default function AuthLayout() {
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

  if (status === "in_use") {
    return <Redirect href={"/" as Href} />;
  }

  return <Slot />;
}
