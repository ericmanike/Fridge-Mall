import { Product } from "./types";

export const products: Product[] = [
  {
    id: "lg-450l-double-door",
    name: "LG 450L Double Door Refrigerator",
    brand: "LG",
    price: 4200,
    capacity: "450L",
    energyRating: "A++",
    description:
      "Spacious double-door fridge with frost-free technology, adjustable shelves, and a dedicated vegetable crisper. Perfect for medium to large households.",
    features: [
      "Frost-free cooling",
      "LED interior lighting",
      "Adjustable glass shelves",
      "10-year compressor warranty",
    ],
    image: "/fridges/lg-double-door.svg",
    inStock: true,
  },
  {
    id: "samsung-380l-top-freezer",
    name: "Samsung 380L Top Freezer",
    brand: "Samsung",
    price: 3650,
    capacity: "380L",
    energyRating: "A+",
    description:
      "Reliable top-freezer design with digital inverter technology for energy savings and consistent cooling performance.",
    features: [
      "Digital inverter compressor",
      "Power cool & power freeze",
      "Deodorizer filter",
      "Tempered glass shelves",
    ],
    image: "/fridges/samsung-top-freezer.svg",
    inStock: true,
  },
  {
    id: "midea-260l-single-door",
    name: "Midea 260L Single Door",
    brand: "Midea",
    price: 1850,
    capacity: "260L",
    energyRating: "A",
    description:
      "Compact and affordable single-door refrigerator ideal for studios, small apartments, and office use.",
    features: [
      "Direct cool technology",
      "Mechanical temperature control",
      "Reversible door hinge",
      "Low noise operation",
    ],
    image: "/fridges/midea-single-door.svg",
    inStock: true,
  },
  {
    id: "hisense-520l-side-by-side",
    name: "Hisense 520L Side-by-Side",
    brand: "Hisense",
    price: 5800,
    capacity: "520L",
    energyRating: "A++",
    description:
      "Premium side-by-side refrigerator with water dispenser, multi-air flow system, and generous freezer capacity.",
    features: [
      "Built-in water dispenser",
      "Multi-air flow system",
      "Super cool function",
      "Touch control panel",
    ],
    image: "/fridges/hisense-side-by-side.svg",
    inStock: true,
  },
  {
    id: "nasco-180l-mini",
    name: "Nasco 180L Mini Fridge",
    brand: "Nasco",
    price: 1200,
    capacity: "180L",
    energyRating: "A",
    description:
      "Budget-friendly mini fridge for students and first-time buyers. Reliable cooling in a compact footprint.",
    features: [
      "Compact design",
      "Separate freezer compartment",
      "Interior light",
      "1-year warranty",
    ],
    image: "/fridges/nasco-mini.svg",
    inStock: true,
  },
  {
    id: "whirlpool-400l-french-door",
    name: "Whirlpool 400L French Door",
    brand: "Whirlpool",
    price: 4950,
    capacity: "400L",
    energyRating: "A++",
    description:
      "Elegant French door design with flexible storage options and advanced freshness preservation technology.",
    features: [
      "6th Sense technology",
      "Fresh flow air tower",
      "Convertible freezer",
      "Anti-bacterial gasket",
    ],
    image: "/fridges/whirlpool-french-door.svg",
    inStock: true,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
