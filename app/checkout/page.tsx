"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { REFERRAL_REWARD_AMOUNT } from "@/lib/referral";

export default function CheckoutPage() {
  const { items, subtotal, placeOrder } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fridgemall-referredby");
      if (stored) {
        setReferralCode(stored);
      }
    }
  }, []);

  if (items.length === 0 && !submitted) {
    return (
      <div className="mx-auto w-full bg-white px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Nothing to checkout</h1>
        <Link
          href="/products"
          className="mt-4 inline-block text-sky-600 hover:text-sky-700"
        >
          <span className="inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </span>
        </Link>
      </div>
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const order = placeOrder({
      fullName: form.get("fullName") as string,
      phone: form.get("phone") as string,
      email: form.get("email") as string,
      address: form.get("address") as string,
      city: form.get("city") as string,
      region: form.get("region") as string,
      notes: (form.get("notes") as string) || undefined,
      referralCode: (form.get("referralCode") as string) || undefined,
    });
    setOrderId(order.id);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto w-full bg-white px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CircleCheck className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Order placed successfully!
        </h1>
        <p className="mt-2 text-slate-600">
          Order <span className="font-mono font-semibold">{orderId}</span> is
          confirmed. We&apos;ll call you to arrange free delivery. Pay when your
          fridge arrives.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className=" h-fit mx-auto w-full bg-[#E2E8F0] px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      <p className="mt-1 text-slate-600">
        Pay on delivery (cash or MoMo)
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className=" text-slate-900 space-y-4 lg:col-span-2">
          <div className=" rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold text-slate-900">Delivery details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">
                  Full name
                </span>
                <input
                  name="fullName"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Phone number
                </span>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="e.g. 024 123 4567"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Email (optional)
                </span>
                <input
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">
                  Delivery address
                </span>
                <input
                  name="address"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">City</span>
                <input
                  name="city"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Region
                </span>
                <select
                  name="region"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">Select region</option>
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Western">Western</option>
                  <option value="Central">Central</option>
                  <option value="Eastern">Eastern</option>
                  <option value="Northern">Northern</option>
                  <option value="Volta">Volta</option>
                  <option value="Bono">Bono</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">
                  Delivery notes (optional)
                </span>
                <textarea
                  name="notes"
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-bold text-slate-900">Have a referral code?</h2>
            <p className="mt-1 text-sm text-slate-600">
              Enter a friend&apos;s code. They&apos;ll earn{" "}
              {formatCurrency(REFERRAL_REWARD_AMOUNT)} instantly
              when you complete this order.
            </p>
            <input
              name="referralCode"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="e.g. FMABC123"
              className="mt-3 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm uppercase outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">Order summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between">
                <span>
                  {product.name} × {quantity}
                </span>
                <span>{formatCurrency(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Delivery Fee</span>
              <span className="font-medium">Not Set Yet</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-slate-900">
              <span>Pay on delivery</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[#0066FF] py-3 text-sm font-semibold text-white hover:bg-[#0066ffbc]"
          >
            Place order
          </button>
        </div>
      </form>
    </div>
  );
}
