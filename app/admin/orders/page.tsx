"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  X,
  XCircle,
  MapPin,
  Phone,
  User,
  ShoppingBag,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatCurrency } from "@/lib/utils";

interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  notes?: string;
  referralCode?: string;
}

interface Order {
  orderId: string;
  userId?: string;
  items: OrderItem[];
  details: OrderDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cod";
  status: "pending" | "processing" | "delivered" | "cancelled";
  referralCodeUsed?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processing" | "delivered" | "cancelled">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingDeliveryFee, setEditingDeliveryFee] = useState<string>("0");
  const [savingFee, setSavingFee] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setEditingDeliveryFee((selectedOrder.deliveryFee ?? 0).toString());
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (err) {
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order ${orderId} updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update order status");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleSaveDeliveryFee = async () => {
    if (!selectedOrder) return;
    const fee = parseFloat(editingDeliveryFee);
    if (isNaN(fee) || fee < 0) {
      toast.error("Please enter a valid non-negative delivery fee.");
      return;
    }

    setSavingFee(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.orderId,
          deliveryFee: fee,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Delivery fee updated successfully!");
        fetchOrders();
        if (data.order) {
          setSelectedOrder(data.order);
        }
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update delivery fee");
      }
    } catch (err) {
      toast.error("An error occurred while updating delivery fee");
    } finally {
      setSavingFee(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.details.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.details.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header Panel */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Manage Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          Verify checkouts, arrange free deliveries, and edit order status.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex items-center max-w-md w-full">
          <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by ID, name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["all", "pending", "processing", "delivered", "cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                statusFilter === status
                  ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-800">No orders found</h3>
          <p className="text-sm text-slate-500">There are no checkouts matching this criteria.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Total Value</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-800">{o.orderId}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-850">{o.details.fullName}</p>
                        <p className="text-xs text-slate-500">{o.details.phone}</p>
                        {o.referralCodeUsed && (
                          <p className="mt-1 text-[10px] font-bold text-amber-600 font-mono">
                            Ref: {o.referralCodeUsed}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {o.details.city}, {o.details.region}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString("en-GH", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-black text-slate-950">{formatCurrency(o.total)}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {o.deliveryFee > 0 ? `Delivery: ${formatCurrency(o.deliveryFee)}` : "Free Delivery"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white ${
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
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateStatus(o.orderId, e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 font-mono">
                Order {selectedOrder.orderId} Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6">
              {/* Delivery Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recipient Information
                </h4>
                <div className="grid gap-3.5 bg-slate-50 p-4 rounded-xl text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-semibold">{selectedOrder.details.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{selectedOrder.details.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {selectedOrder.details.address}, {selectedOrder.details.city},{" "}
                      {selectedOrder.details.region}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Purchased Items
                </h4>
                <div className="divide-y divide-slate-100 border-y border-slate-100 py-1">
                  {selectedOrder.items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center py-2.5">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">Brand: {item.brand}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-600 font-semibold">
                        {formatCurrency(item.price)} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order total */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold flex items-center gap-1.5 text-xs text-slate-600">
                    <Truck className="h-3.5 w-3.5 text-blue-600" />
                    Delivery Fee (GHS)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={editingDeliveryFee}
                      onChange={(e) => setEditingDeliveryFee(e.target.value)}
                      className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 font-bold outline-none focus:border-blue-500 transition"
                    />
                    <button
                      onClick={handleSaveDeliveryFee}
                      disabled={savingFee}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-1 text-xs font-bold text-white transition cursor-pointer shadow-xs"
                    >
                      {savingFee ? "Saving..." : "Update Fee"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900">
                  <span>Total Amount</span>
                  <span>
                    {formatCurrency(
                      selectedOrder.subtotal + (parseFloat(editingDeliveryFee) || 0)
                    )}
                  </span>
                </div>
              </div>

              {/* Extra details (notes & referrals) */}
              {(selectedOrder.details.notes || selectedOrder.referralCodeUsed) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Additional Details
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    {selectedOrder.details.notes && (
                      <p>
                        <strong>Notes:</strong> {selectedOrder.details.notes}
                      </p>
                    )}
                    {selectedOrder.referralCodeUsed && (
                      <p>
                        <strong>Referral Code Used:</strong>{" "}
                        <span className="font-mono font-bold text-amber-600">
                          {selectedOrder.referralCodeUsed}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Status Switcher Inside Modal */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
