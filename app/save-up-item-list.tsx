export type SaveUpItems = {
  image: any;
  itemName: string;
  itemSize: string;
  itemPrice: number;
};

export const saveUpItems: SaveUpItems[] = [
  {
    image: require("../assets/images/item20.png"),
    itemName: "HEAD N SHOULDERS Cool Mentol",
    itemSize: "170ml",
    itemPrice: 14.16,
  },
  {
    image: require("../assets/images/item19.png"),
    itemName: "Nescafe Classic Instant Coffee",
    itemSize: "185g",
    itemPrice: 14.16,
  },
  {
    image: require("../assets/images/item21.png"),
    itemName: "Closeup Anti-Bacterial Toothpaste Red Hot",
    itemSize: "120g",
    itemPrice: 14.16,
  },
];
