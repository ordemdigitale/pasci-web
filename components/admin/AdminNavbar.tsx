"use client";

import Link from "next/link";
import { Menu, Bell, User } from "lucide-react";

interface AdminNavbarProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
}

export default function AdminNavbar({ setSidebarOpen, title = "Tableau de bord" }: AdminNavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-semibold text-xl text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="hover:underline text-sm text-gray-600 hover:text-gray-900"
        >
          Visiter le site
        </Link>
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#2a591d] rounded-full"></span>
        </button>
        <div className="w-8 h-8 bg-[#2a591d] rounded-full flex items-center justify-center text-white">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
