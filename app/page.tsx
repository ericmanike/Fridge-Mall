import Link from "next/link";
import { ArrowRight, Banknote, Gift, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

const perks: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Free delivery",
    description: "We deliver anywhere in Ghana at no extra cost.",
    Icon: Truck,
  },
  {
    title: "Pay on delivery",
    description: "Pay with cash or MoMo when your fridge arrives.",
    Icon: Banknote,
  },
  {
    title: "Refer & earn GHS 50",
    description: "Share your code — earn instantly when friends buy.",
    Icon: Gift,
  },
];

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden bg-linear-to-br from-[#0066FF] via-sky-700 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white" />
          <div className="absolute -bottom-10 left-10 h-60 w-60 rounded-full bg-sky-300" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-200">
            Ghana&apos;s fridge marketplace
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Quality fridges, delivered free to your door
          </h1>
          <p className="mt-5 max-w-xl text-lg text-sky-100">
            Browse top brands, order online, and pay only when we deliver.
            Refer a friend and earn GHS 50 instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0066FF] transition hover:bg-sky-50"
            >
              Shop all fridges
            </Link>
            <Link
              href="/referral"
              className="rounded-[10px]  px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Refer &amp; earn GHS 50
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full bg-linear-to-br from-sky-50 to-white  px-4 py-14 sm:px-6">
        <div className=" w-full grid gap-4 sm:grid-cols-3">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <perk.Icon className="h-8 w-8 text-sky-600" strokeWidth={1.75} />
              <h3 className="mt-3 font-bold text-slate-900">{perk.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{perk.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#E2E8F0] py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Popular fridges
              </h2>
              <p className="mt-1 text-slate-600">
                Hand-picked models for every budget
              </p>
            </div>
            <Link
              href="/products"
              className="hidden text-sm font-semibold text-[#0066ffe2] hover:text-[#0066FF] sm:block"
            >
              <span className="inline-flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
