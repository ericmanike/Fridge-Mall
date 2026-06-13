import React from "react";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import ProductModel from "@/models/Products";
import Order from "@/models/Order";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  CheckCircle,
  Truck,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Panel | Fridge Mall",
};

export default async function AdminDashboardPage() {
  await dbConnect();

  // Fetch counts and metrics
  const totalUsers = await User.countDocuments();
  const totalProducts = await ProductModel.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Calculate total revenue from orders
  const allOrders = await Order.find();
  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  // Status breakdown
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  const confirmedOrders = await Order.countDocuments({ status: "confirmed" });
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });

  // Get recent 5 orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5);

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Gross merchandise value",
      Icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      description: "Lifetime checkouts",
      Icon: TrendingUp,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Products Catalog",
      value: totalProducts.toString(),
      description: "Unique fridges active",
      Icon: ShoppingBag,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Registered Users",
      value: totalUsers.toString(),
      description: "Registered shoppers",
      Icon: Users,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Store overview, catalog metrics, and customer analytics.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.Icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`rounded-xl p-2.5 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                <p className="mt-1 text-xs text-slate-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4">Order Funnel Summary</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Pending Verification</p>
              <p className="text-lg font-bold text-slate-800">{pendingOrders} orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
            <Truck className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Confirmed &amp; Shipping</p>
              <p className="text-lg font-bold text-slate-800">{confirmedOrders} orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">Completed Deliveries</p>
              <p className="text-lg font-bold text-slate-800">{deliveredOrders} orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and catalog quick actions */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Recent Customer Activity</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
            >
              View All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No orders have been placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="py-2 pr-4">Order ID</th>
                    <th className="py-2 px-4">Customer</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((o) => (
                    <tr key={o.orderId} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 pr-4 font-mono font-bold text-slate-800">{o.orderId}</td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">{o.details.fullName}</td>
                      <td className="py-3 px-4 font-bold text-slate-950">{formatCurrency(o.total)}</td>
                      <td className="py-3 pl-4 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
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

        {/* Quick Management Shortcuts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">Operations Shortcuts</h3>
          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="block rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 p-4 transition text-left"
            >
              <p className="font-bold text-slate-800">Add New Fridge</p>
              <p className="text-xs text-slate-500 mt-0.5">Insert new brand or model specification into catalog</p>
            </Link>
            <Link
              href="/admin/users"
              className="block rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/20 p-4 transition text-left"
            >
              <p className="font-bold text-slate-800">Manage Privileges</p>
              <p className="text-xs text-slate-500 mt-0.5">Grant admin roles or configure tester credit wallets</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
