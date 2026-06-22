"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, ShieldAlert, ChevronDown } from "lucide-react";

export default function ProfileDropdown() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (status === "loading") {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />;
  }

  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center gap-1.5 rounded-full bg-[#0066FF] hover:bg-[#0066ffe7] px-4 py-2 text-sm font-bold text-white transition shadow-sm"
      >
        <User className="h-4 w-4" />
        <span>Sign In</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700 transition cursor-pointer select-none"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase">
          {session.user?.name?.slice(0, 2) || "U"}
        </div>

        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {isDropdownOpen && (
        <>
          {/* Overlay to handle click outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2.5 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-lg ring-1 ring-black/5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-bold text-slate-800 truncate">{session.user?.name || ""}</p>
              <p className="text-[11px] font-semibold text-slate-400 truncate">{session.user?.email || ""}</p>
              <span className="mt-1.5 inline-flex items-center rounded-md bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[9px] font-bold text-blue-600 uppercase tracking-wider">
                {(session.user as any)?.role || "user"}
              </span>
            </div>

            <div className="mt-2 p-1.5 space-y-0.5">
              <Link
                href="/dashboard"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                <User className="h-4 w-4 text-slate-400" />
                Dashboard
              </Link>

            

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-slate-400" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
