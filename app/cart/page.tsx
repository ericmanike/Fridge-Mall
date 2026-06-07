"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full bg-white px-4 py-20 text-center sm:px-6">
        <ShoppingCart className="mx-auto h-16 w-16 text-slate-300" strokeWidth={1.25} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-slate-600">
          Browse our fridges and add one to get started.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Shop fridges
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full bg-[#E2E8F0] px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Your cart</h1>
      <p className="mt-1 text-slate-600">{items.length} item(s)</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={50}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-xs font-medium text-sky-600">
                  {product.brand}
                </p>
                <h3 className="font-semibold text-slate-900">{product.name}</h3>
                <p className="mt-1 font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button
                      onClick={() =>
                        quantity > 1
                          ? updateQuantity(product.id, quantity - 1)
                          : removeFromCart(product.id)
                      }
                      className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, quantity + 1)
                      }
                      className="px-3 py-1 text-slate-600 hover:bg-slate-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Delivery</span>
              <span className="font-medium">FREE</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
              <span>Total (pay on delivery)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-xl bg-[#0066FF] py-3 text-center text-sm font-semibold text-white hover:bg-[#0066ffbc]"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
