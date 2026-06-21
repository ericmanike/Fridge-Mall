"use client";

import React, { useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, Calendar, RefreshCw } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-slate-500">
        Failed to load account profile. Please try logging in again.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <ToastContainer />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066FF] text-xl font-bold text-white uppercase">
            {user.name.slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-bold text-[#0066FF] uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Account Details</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <UserIcon className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Full Name</p>
                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Email Address</p>
                <p className="text-sm font-semibold text-slate-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Phone Number</p>
                <p className="text-sm font-semibold text-slate-700">{user.phone || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Member Since</p>
                <p className="text-sm font-semibold text-slate-700">
                  {new Date(user.createdAt).toLocaleDateString("en-GH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <RefreshCw className={`${className} animate-spin`} />;
}
