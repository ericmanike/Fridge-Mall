import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Banknote, Gift, Truck, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import dbConnect from "@/lib/mongoose";
import ProductModel from "@/models/Products";
import { products as staticProducts } from "@/lib/products";
import HeroSlider from "@/components/HeroSlider";
import { Metadata } from "next"; 


const heroSlides = [
  {
    id: 1,
    title: "Earn GHS 50 Cash Rewards",
    description: "Refer friends & family to Fridge Mall and get GHS 50 instant cash reward on every order.",
    ctaText: "Start Earning",
    ctaLink: "/dashboard/referral",
    backgroundImage: "/hero-lifestyle.png",
    imageAlt: "Earn GHS 50 cash rewards",
  },
  {
    id: 2,
    title: "Quality fridges, delivered to your door",
    description: "Browse top brands, order online, and pay on delivery.",
    ctaText: "Shop all fridges",
    ctaLink: "/products",
    backgroundImage: "/hero-fridge-1.png",
    imageAlt: "Premium modern kitchen with smart refrigerator",
  },
];


const perks: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    title: "Nationwide delivery",
    description: "We deliver across Accra, Kumasi, and all regions in Ghana.",
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

export const metadata: Metadata = {
  title: "Fridge Mall — Pay on Delivery",
  description:
    "Shop quality refrigerators in Ghana, pay on delivery. Refer friends and earn GHS 50 instantly.",
};


export default async function Home() {
  let displayProducts = [];
  try {
    await dbConnect();
    const dbProducts = await ProductModel.find().limit(4);
    if (dbProducts.length > 0) {
      displayProducts = dbProducts.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        brand: p.brand,
        price: p.price,
        capacity: p.capacity,
        energyRating: p.energyRating,
        description: p.description,
        features: p.features,
        image: p.image,
        inStock: p.inStock,
      }));
    } else {
      displayProducts = staticProducts.slice(0, 4);
    }
  } catch (err) {
    console.error("Failed to load products for homepage, falling back:", err);
    displayProducts = staticProducts.slice(0, 4);
  }

  const featured = displayProducts;

  return (
    <div className="bg-white w-full">
      <HeroSlider slides={heroSlides} />

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
          <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-4 h-fit">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E2E8F0] py-14"> 
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between text-[#252260] rounded-3xl bg-white/90 px-4 sm:px-6 py-4 md:py-10 shadow-xl">
          <div>
            <h1 className="text-2xl text-[#252260] font-extrabold">Refer And Earn</h1>
            <h2 className="font-semibold text-1xl text-[#252260]">Refer a friend and earn GHS 50 instantly.</h2>
          </div>
          <Link href="/dashboard/referral" className="mt-2 max-h-11 flex items-center justify-center text-white px-4 md:px-6 py-2 bg-[#252260] hover:bg-[#1c1a4b] transition-colors rounded-3xl text-2xl shadow-md">Start now</Link>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#632cf5] text-white py-16 lg:py-24">
        {/* Decorative background gradients or patterns */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[#a855f7] blur-3xl" />
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#3b82f6] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Text & Button) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start">
            <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-[1.15] text-white">
              Shop the Best. <br />
              Pay on delivery.
            </h2>
            <p className="mt-4 text-lg text-purple-100/90 max-w-md">
              Discover international brands with discount.
            </p>
            <div className="mt-8">
              <Link
                href="/products"
                className="inline-block rounded-full bg-[#E0E7FF] text-[#4F46E5] px-8 py-3.5 text-base font-bold transition-all duration-200 hover:bg-white hover:scale-[1.03] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                Shop now
              </Link>
            </div>
          </div>
            
          {/* Right Column: Showcase Cards */}
          <div className="lg:col-span-7 max-w-md w-full lg:justify-self-end ml-auto grid grid-cols-1 gap-4">
            <div className="rounded-2xl bg-[#E2E8F0] p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  Instant Cash
                </span>
                <div className="h-9 w-9 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                  <Gift className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#252260]">GHS 50 Referral Reward</h3>
              <p className="mt-1.5 text-xs text-[#252260]/80 leading-relaxed">
                Earn GHS 50 straight to your wallet for every friend who orders a fridge.
              </p>
            </div>

            <div className="rounded-2xl bg-[#E2E8F0] p-5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                  Zero Upfront Risk
                </span>
                <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Banknote className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#252260]">Pay on Delivery</h3>
              <p className="mt-1.5 text-xs text-[#252260]/80 leading-relaxed">
                Inspect your appliance at your doorstep before paying with cash or MoMo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
