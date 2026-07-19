import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Banknote, Gift, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import dbConnect from "@/lib/mongoose";
import ProductModel from "@/models/Products";
import { products as staticProducts } from "@/lib/products";
import HeroSlider from "@/components/HeroSlider";

const heroSlides = [
  {
    id: 1,
    title: "Don't miss out on insider perks",
    description: "What are you waiting for? Make the most of Fridge Mall account benefits.",
    ctaText: "Sign in",
    ctaLink: "/auth/signIn",
    backgroundImage: "/hero-lifestyle.png",
    imageAlt: "Insider perks lifestyle",
  },
  {
    id: 2,
    title: "Quality fridges, delivered free to your door",
    description: "Browse top brands, order online, and pay only when we deliver.",
    ctaText: "Shop all fridges",
    ctaLink: "/products",
    backgroundImage: "/hero-fridge-1.png",
    imageAlt: "Premium modern kitchen with smart refrigerator",
  },
];


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
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
  <section className="bg-[#E2E8F0] py-14"> 

   <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between text-black rounded-3xl bg-white/90 px-4 sm:px-6 py-4 md:py-10">
 <div>
   <h1 className=" text-2xl text-slate-600 font-extrabold"> Refer And Earn</h1>
 <h2 className="font-semibold twxt-1xl"> Refer a friend and earn GHS 50 instantly.</h2>
 </div>
 <Link href="/referral" className=" mt-2 max-h-11 flex items-center justify-center  text-[white] px-4 md:px-6 py-2 bg-[#000000] rounded-3xl text-2xl"> Start now</Link>


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

      {/* Right Column (Asymmetrical Collage Grid) */}
      <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
        {/* Column 1: LG Fridge */}
        <div className="relative aspect-[3/4.5] w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl mt-8 bg-white">
          <Image
            src="/brands/lg.png"
            alt="LG Fridge"
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            className="object-cover"
          />
        </div>

        {/* Column 2: Samsung Fridge (Top) + Wolverine (Bottom) */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3.5] w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl bg-white">
            <Image
              src="/brands/samsung.png"
              alt="Samsung Fridge"
              fill
              sizes="(max-width: 768px) 50vw, 15vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5.5] w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
            <Image
              src="/brands/funko-wolverine.png"
              alt="Funko Wolverine"
              fill
              sizes="(max-width: 768px) 50vw, 15vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Column 3: Funko Girl (Tall) */}
        <div className="relative aspect-[3/4.8] w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl mt-4">
          <Image
            src="/brands/funko-girl.png"
            alt="Funko Girl"
            fill
            sizes="(max-width: 768px) 50vw, 15vw"
            className="object-cover"
          />
        </div>

        {/* Column 4: Gengar (Top) + Hisense Fridge (Bottom) */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3.8] w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
            <Image
              src="/brands/pokemon-gengar.png"
              alt="Pokemon Gengar"
              fill
              sizes="(max-width: 768px) 50vw, 15vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/6] w-full rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl bg-white">
            <Image
              src="/brands/hisense.png"
              alt="Hisense Fridge"
              fill
              sizes="(max-width: 768px) 50vw, 15vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

</div>
);
}
