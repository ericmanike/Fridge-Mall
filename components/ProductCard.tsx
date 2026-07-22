import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { formatCurrency, formatCapacity } from "@/lib/utils";
import { Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
}

function getEnergyStars(rating: string | number) {
  if (!rating) return 5;
  const num = parseInt(String(rating).replace(/[^0-9]/g, ""), 10);
  if (!isNaN(num) && num >= 1 && num <= 5) return num;
  const str = String(rating).toUpperCase();
  if (str.includes("A+++") || str.includes("5")) return 5;
  if (str.includes("A++") || str.includes("4")) return 4;
  if (str.includes("A+") || str.includes("3")) return 3;
  if (str.includes("A") || str.includes("2")) return 2;
  return 5;
}

export default function ProductCard({ product }: ProductCardProps) {
  const energyStars = getEnergyStars(product.energyRating);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-[10px] bg-white shadow-lg transition hover:border-sky-200 hover:shadow-md"
    >
      <div className="relative flex h-48  items-center justify-center bg-linear-to-b from-sky-50 to-white ">
        <Image
          src={product.image}
          alt={product.name}
         fill
          className="object-cover overflow-hidden transition group-hover:scale-105  "
        /> 
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-700 px-2 py-0.5 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[#0066FF]">
          {product.brand}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-[#0066FF]">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <span>{formatCapacity(product.capacity)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= energyStars
                    ? "text-amber-500 fill-amber-500"
                    : "text-slate-200 fill-slate-200"
                }`}
              />
            ))}
          </span>
        </div>
        <div className=" h-fit grid grid-cols-1 w-full m-auto justify-center items-center">
        <p className=" pt-3 text-[16px]  font-bold text-slate-900">
          {formatCurrency(product.price)}
        </p>
        <AddToCartButton product={product} />
        </div>
      </div>
    </Link>
  );
}
