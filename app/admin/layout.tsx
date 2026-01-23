"use client";

import React, { useState } from 'react'
import { usePathname } from 'next/navigation';
import { Karla, Poppins } from "next/font/google";
import "../globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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
  const pathname = usePathname();

  // Pages qui ne doivent pas afficher le sidebar et la navbar
  const isAuthPage = pathname === '/admin/login';

  return (
    <html lang="en" className={`${karla.variable} ${poppins.variable} antialiased`}>
      <body>
        <AuthProvider>
          {isAuthPage ? (
            // Layout simple pour les pages d'authentification
            <div className="h-screen overflow-hidden">
              {children}
            </div>
          ) : (
            // Layout complet avec sidebar et navbar pour les autres pages (protégé)
            <ProtectedRoute requireAdmin={true}>
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
            </ProtectedRoute>
          )}
        </AuthProvider>
      </body>
    </html>
  )
}
