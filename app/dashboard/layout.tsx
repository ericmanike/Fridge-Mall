import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import DashboardLayoutClient from "@/app/dashboard/DashboardLayoutClient";

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
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
  };

  return (
    <DashboardLayoutClient user={user}>
      {children}
    </DashboardLayoutClient>
  );
}

