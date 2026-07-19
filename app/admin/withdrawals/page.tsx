"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Banknote,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  AlertCircle,
  ArrowLeftRight,
  Trash2,
  Smartphone,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch("/api/withdrawals");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      } else {
        toast.error("Failed to load withdrawal requests.");
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      toast.error("An error occurred while loading requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleUpdateStatus = async (requestId: string, status: "approved" | "rejected") => {
    setProcessingId(requestId);
    try {
      const res = await fetch("/api/withdrawals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || `Payout request ${status} successfully.`);
        fetchWithdrawals();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to update request status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to process request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this withdrawal request?")) return;
    setProcessingId(requestId);
    try {
      const res = await fetch(`/api/withdrawals?id=${requestId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Withdrawal request deleted successfully.");
        fetchWithdrawals();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to delete withdrawal request.");
      }
    } catch (err) {
      console.error("Error deleting withdrawal request:", err);
      toast.error("Failed to delete request.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      req.userName?.toLowerCase().includes(query) ||
      req.userEmail?.toLowerCase().includes(query) ||
      req.momoNumber?.toLowerCase().includes(query) ||
      req.beneficiaryName?.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <ToastContainer />

      {/* Header Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Banknote className="h-8 w-8 text-emerald-600 shrink-0" />
            Referral Payout Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Process, approve, or reject user referral rewards withdrawal requests.
          </p>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Payout Requests</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{requests.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="rounded-xl p-2 bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved Payouts</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</p>
          </div>
          <div className="rounded-xl p-2 bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejected Requests</p>
            <p className="text-2xl font-black text-red-600 mt-1">{rejectedCount}</p>
          </div>
          <div className="rounded-xl p-2 bg-red-50 text-red-600">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters Hub */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch">
        {/* Status Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1 self-start">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition cursor-pointer select-none ${
                statusFilter === status
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or MoMo number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {loading ? (
          <div className="space-y-4 py-8">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
            <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No withdrawal requests found matching constraints.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="py-3 pr-4">Shopper</th>
                  <th className="py-3 px-4">MoMo Details</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Requested Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/30 transition duration-150">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase shrink-0">
                          {req.userName?.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {req.userName}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {req.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {req.momoNumber ? (
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Smartphone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            {req.momoNumber}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {req.beneficiaryName || "N/A"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900 text-base">
                      {formatCurrency(req.amount)}
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {new Date(req.createdAt).toLocaleDateString("en-GH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          req.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : req.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req._id, "approved")}
                              disabled={processingId !== null}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-3 py-1.5 text-xs transition cursor-pointer select-none shadow-sm hover:shadow-md"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req._id, "rejected")}
                              disabled={processingId !== null}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 text-xs transition cursor-pointer select-none disabled:opacity-50"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(req._id)}
                          disabled={processingId !== null}
                          title="Delete Request"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-1.5 text-xs transition cursor-pointer select-none disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
