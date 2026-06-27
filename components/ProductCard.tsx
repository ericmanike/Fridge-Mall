import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-[10px] bg-white shadow-lg transition hover:border-sky-200 hover:shadow-md"
    >
      <div className="relative flex h-48 items-center justify-center bg-linear-to-b from-sky-50 to-white p-6">
        <Image
          src={product.image}
          alt={product.name}
          width={120}
          height={180}
          className="object-contain transition group-hover:scale-105"
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
          <span>{product.capacity}</span>
          <span>·</span>
          <span>{product.energyRating}</span>
        </div>
        <div className=" h-fit grid grid-cols-1 w-full m-auto justify-center items-center">
        <p className=" pt-3 text-[14px] text-center font-bold text-slate-900">
          {formatCurrency(product.price)}
        </p>
        <AddToCartButton product={product} />
        </div>
      </div>
    </Link>
  );
}
