"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      {isAuthPage ? (
        <div className="h-screen overflow-hidden">
          {children}
        </div>
      ) : (
        <ProtectedRoute requireAdmin={true}>
          <div className="flex h-screen overflow-hidden bg-cyan-50/50 font-poppins">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminNavbar setSidebarOpen={setSidebarOpen} />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
              <AdminFooter />
            </div>
          </div>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
