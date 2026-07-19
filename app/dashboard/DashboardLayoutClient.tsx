"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

export default function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex h-screen overflow-y-auto flex-col min-w-0 overflow-hidden xl:pl-[270px]">
        {/* Mobile Header / Top Bar */}
        <header className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-200 xl:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-slate-800 text-sm">Dashboard</span>
          </div>
        </header>

        {/* Inner Content Container */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
