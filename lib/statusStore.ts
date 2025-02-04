import { create } from "zustand";

interface CartState {
  status: "in_use" | "not_in_use" | null;
  setStatus: (newStatus: "in_use" | "not_in_use") => void;
}

const useStatusStore = create<CartState>((set) => ({
  status: null,
  setStatus: (newStatus) => set({ status: newStatus }),
}));

export default useStatusStore;
