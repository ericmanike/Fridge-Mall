import Link from "next/link";
import Image from "next/image";
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
          Shop the world. <br />
          Ship for free.
        </h2>
        <p className="mt-4 text-lg text-purple-100/90 max-w-md">
          Discover international finds with free shipping included.
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
