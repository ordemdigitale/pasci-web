"use client";

import React, { useState } from 'react'
import { Karla, Poppins } from "next/font/google";
import "../globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"]
});

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" className={`${karla.variable} ${poppins.variable} antialiased`}>
      <body>
        <div className="flex h-screen bg-cyan-50/50 font-poppins">
          {/* Sidebar */}
          <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <AdminNavbar setSidebarOpen={setSidebarOpen} />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>

            {/* Footer */}
            <AdminFooter />
          </div>
        </div>
      </body>
    </html>
  )
}
