"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { orders: localOrders } = useCart();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        // Merge & deduplicate local storage orders & database orders
        const mergedMap = new Map();

        // Load local ones first
        localOrders.forEach((o) => {
          const id = o.id || (o as any).orderId;
          mergedMap.set(id, {
            orderId: id,
            createdAt: o.createdAt,
            total: o.total,
            status: o.status,
            items: o.items,
            details: o.details,
          });
        });

        // Overwrite/supplement with DB ones
        data.orders.forEach((o: any) => {
          mergedMap.set(o.orderId, o);
        });

        const list = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(list);
      } else {
        setOrders(localOrders);
      }
    } catch (err) {
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [localOrders]);

  return (
    <div className="rounded-2xl h-screen border border-slate-200 bg-white p-6 shadow-xs animate-in fade-in duration-300">
      <h3 className="text-lg font-bold text-slate-900 mb-4">My Orders</h3>
      {loading ? (
        <div className="space-y-4 py-6">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
          <h4 className="mt-4 font-bold text-slate-800">No orders found</h4>
          <p className="mt-1 text-sm text-slate-500">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition"
          >
            Shop Fridges
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-3 pr-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((o) => (
                <tr key={o.orderId} className="group hover:bg-slate-50/50 transition duration-150">
                  <td className="py-4 pr-4 font-mono font-bold text-slate-800">{o.orderId}</td>
                  <td className="py-4 px-4 text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString("en-GH")}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {o.items?.map((item: any) => `${item.name} (x${item.quantity})`).join(", ") || "Fridge Product"}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-950">{formatCurrency(o.total)}</td>
                  <td className="py-4 pl-4 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        o.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
