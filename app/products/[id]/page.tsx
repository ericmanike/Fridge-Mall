import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductById } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} | Fridge Mall`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto width-full bg-[#E2E8F0] px-4 py-10 sm:px-6">
      <Link
        href="/products"
        className="text-sm font-medium text-[#0066FF] hover:text-[#0066ffbc]"
      >
        <span className="inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </span>
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flex items-center justify-center rounded-2xl bg-linear-to-b from-sky-50 to-white p-12">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={300}
            className="object-contain"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {formatCurrency(product.price)}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {product.capacity}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Energy {product.energyRating}
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              Free delivery
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
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
