import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Link from "next/link";
import { LogOut, ShieldAlert } from "lucide-react";
import DashboardNav from "@/app/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  await dbConnect();
  const dbUser = await User.findOne({ email: session.user.email });

  if (!dbUser) {
    redirect("/auth/login");
  }

  // Serialize user details for components
  const user = {
    id: dbUser._id.toString(),
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    walletBalance: dbUser.walletBalance || 0,
    phone: dbUser.phone || "",
    createdAt: dbUser.createdAt.toISOString(),
  };

  return (
    <div className="bg-[#d1d5dc] mx-auto w-full px-4 py-8 sm:px-6 animate-in fade-in duration-300">
      {/* Shared Client Navigation Links */}
      <DashboardNav />

      {/* Main child page viewport */}
      <div className="mt-8">{children}</div>
    </div>
  );
}
