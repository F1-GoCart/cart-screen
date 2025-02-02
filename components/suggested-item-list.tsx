export type SuggestedItems = {
  image: any;
  itemName: string;
  itemSize: string;
  itemPrice: number;
};

export const suggestedItems: SuggestedItems[] = [
  {
    image: require("../assets/images/item1.png"),
    itemName: "Chuckie Opti-Grow Flavoured Milk",
    itemSize: "110ml",
    itemPrice: 14.16,
  },
  {
    image: require("../assets/images/item17.png"),
    itemName: "Nutriboost Choco",
    itemSize: "110ml",
    itemPrice: 14.16,
  },
  {
    image: require("../assets/images/item18.png"),
    itemName: "Hygienix Alcohol Germ Kill with Moisturizer",
    itemSize: "110ml",
    itemPrice: 14.16,
  },
];
