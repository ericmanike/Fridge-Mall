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
  Clock,
  XCircle,
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
  const processingOrders = await Order.countDocuments({ status: "processing" });
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.Icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`rounded-lg p-1.5 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                <p className="mt-0.5 text-[11px] text-slate-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status Breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Orders Summary</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Verification</p>
              <p className="text-base font-bold text-slate-800">{pendingOrders} orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <Truck className="h-4 w-4 text-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Processing &amp; Shipping</p>
              <p className="text-base font-bold text-slate-800">{processingOrders} orders</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Completed Deliveries</p>
              <p className="text-base font-bold text-slate-800">{deliveredOrders} orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and catalog quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders List */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 lg:col-span-2 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Customer Activity</h3>
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
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="py-2 pr-3 whitespace-nowrap">Order ID</th>
                    <th className="py-2 px-3 whitespace-nowrap">Customer</th>
                    <th className="py-2 px-3 whitespace-nowrap">Amount</th>
                    <th className="py-2 pl-3 text-right whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map((o) => (
                    <tr key={o.orderId} className="hover:bg-slate-50/50 transition">
                      <td className="py-2.5 pr-3 font-mono font-bold text-slate-800 whitespace-nowrap">{o.orderId}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-semibold whitespace-nowrap">{o.details.fullName}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-950 whitespace-nowrap">{formatCurrency(o.total)}</td>
                      <td className="py-2.5 pl-3 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white ${
                            o.status === "delivered"
                              ? "bg-emerald-600"
                              : o.status === "processing"
                              ? "bg-blue-600"
                              : o.status === "cancelled"
                              ? "bg-red-600"
                              : "bg-amber-500"
                          }`}
                        >
                          {o.status === "delivered" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : o.status === "processing" ? (
                            <Truck className="h-3 w-3" />
                          ) : o.status === "cancelled" ? (
                            <XCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
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
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 min-w-0">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Operations Shortcuts</h3>
          <div className="space-y-2.5">
            <Link
              href="/admin/products"
              className="block rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 p-3 transition text-left"
            >
              <p className="font-bold text-slate-800 text-xs sm:text-sm">Add New Fridge</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Insert new brand or model specification into catalog</p>
            </Link>
            <Link
              href="/admin/orders"
              className="block rounded-lg border border-slate-200 hover:border-pink-500 hover:bg-pink-50/20 p-3 transition text-left"
            >
              <p className="font-bold text-slate-800 text-xs sm:text-sm">Manage Orders</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Track customer checkouts, verify payments, and update shipping status</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
