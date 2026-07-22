import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { formatCurrency, formatCapacity } from "@/lib/utils";
import dbConnect from "@/lib/mongoose";
import ProductModel from "@/models/Products";
import { products as staticProducts } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
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

async function fetchProduct(id: string) {
  // 1. Try static list first
  const staticProduct = staticProducts.find((p) => p.id === id);
  if (staticProduct) {
    return staticProduct;
  }

  // 2. Try database
  try {
    await dbConnect();
    const dbProduct = await ProductModel.findById(id);
    if (dbProduct) {
      return {
        id: dbProduct._id.toString(),
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: dbProduct.price,
        capacity: dbProduct.capacity,
        energyRating: dbProduct.energyRating,
        description: dbProduct.description,
        features: dbProduct.features,
        image: dbProduct.image,
        inStock: dbProduct.inStock,
      };
    }
  } catch (err) {
    console.error("Error fetching product from DB:", err);
  }

  return undefined;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} | Fridge Mall`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) notFound();

  const energyStars = getEnergyStars(product.energyRating);

  return (
    <div className="mx-auto w-full bg-[#E2E8F0] px-4 py-10 sm:px-6">
      <Link
        href="/products"
        className="text-sm font-medium text-[#0066FF] hover:text-[#0066ffbc]"
      >
        <span className="inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </span>
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 items-center justify-center">
        <div className="flex w-fit items-center justify-center rounded-2xl bg-linear-to-b from-sky-50 to-white px-8 p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={200}
            className="object-cover rounded-2xl"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-700">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {formatCurrency(product.price)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {formatCapacity(product.capacity)}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="text-slate-600 font-medium">Energy:</span>
              <span className="inline-flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= energyStars
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-300 fill-slate-200"
                    }`}
                  />
                ))}
              </span>
            </span>

            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Pay on delivery
            </span>
          </div>

          <p className="mt-6 text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <ul className="mt-6 space-y-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <BadgeCheck className="h-5 w-5 shrink-0 text-white fill-[#252260]" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 ">
            <AddToCartButton product={product} className="w-[80%] md:w-fit w-full py-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
