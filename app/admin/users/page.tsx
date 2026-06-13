"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Users,
  Edit2,
  CheckCircle,
  X,
  Shield,
  Wallet,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatCurrency } from "@/lib/utils";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin" | "moderator";
  walletBalance: number;
  phone?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form State
  const [role, setRole] = useState<UserProfile["role"]>("user");
  const [walletBalance, setWalletBalance] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        toast.error("Failed to load users");
      }
    } catch (err) {
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setRole(user.role);
    setWalletBalance(user.walletBalance.toString());
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    const parsedBalance = parseFloat(walletBalance);

    if (isNaN(parsedBalance) || parsedBalance < 0) {
      toast.error("Please enter a valid wallet balance");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingUser._id,
          role,
          walletBalance: parsedBalance,
        }),
      });

      if (res.ok) {
        toast.success(`User ${editingUser.name} updated successfully!`);
        setEditingUser(null);
        fetchUsers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update user");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header Panel */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Manage Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor registered shoppers, edit account roles, and load funds.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-1">
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search users by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border-0 bg-transparent py-3 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-800">No users found</h3>
          <p className="text-sm text-slate-500">There are no user accounts matching this criteria.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Phone</th>
                  <th className="py-3.5 px-6">Wallet Balance</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Registered On</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-855 flex items-center gap-1.5">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{u.phone || "Not Set"}</td>
                    <td className="py-4 px-6 font-black text-slate-950">
                      {formatCurrency(u.walletBalance)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : u.role === "agent"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : u.role === "moderator"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString("en-GH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openEditModal(u)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Modify User Privileges
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="mt-4 space-y-4">
              {/* User details display */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-bold">{editingUser.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{editingUser.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600">Account Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserProfile["role"])}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white font-semibold text-slate-700"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600">Wallet Balance (GHS)</label>
                <div className="relative mt-1 flex items-center">
                  <Wallet className="pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={walletBalance}
                    onChange={(e) => setWalletBalance(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-bold text-white transition cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Updating..." : "Update Privileges"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
