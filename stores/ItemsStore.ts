import { create } from "zustand";
import { Database } from "~/lib/database.types";

type ScannedItem = Database["public"]["Tables"]["scanned_items"]["Row"] & {
  product_details: Database["public"]["Tables"]["product_details"]["Row"];
};

interface ItemState {
  scannedItems: ScannedItem[];
  setScannedItems: (items: ScannedItem[]) => void;
  totalItems: number;
  setTotalItems: (total: number) => void;
  totalAmount: number;
  setTotalAmount: (total: number) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  scannedItems: [],
  setScannedItems: (items) => set({ scannedItems: items }),
  totalItems: 0,
  setTotalItems: (total) => set({ totalItems: total }),
  totalAmount: 0,
  setTotalAmount: (total) => set({ totalAmount: total }),
}));
