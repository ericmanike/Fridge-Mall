import { Product } from "./types";

export const products: Product[] = [

];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
