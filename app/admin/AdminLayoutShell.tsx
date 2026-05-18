"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Routes autorisées pour les utilisateurs OSC (lecture seule du dashboard + profil)
const OSC_ALLOWED_ROUTES = ["/admin", "/admin/mon-osc"];

// Routes autorisées pour les admins CRASC
const CRASC_ADMIN_ALLOWED_PREFIXES = [
  "/admin/gestion-des-crasc",
  "/admin/formations",
  "/admin/actualites",
  "/admin/profile",
];

function OscRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isOscUser = !!user?.osc_id && !user?.is_staff && !user?.is_superuser;

  useEffect(() => {
    if (loading || !isOscUser) return;
    const allowed = OSC_ALLOWED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (!allowed) {
      router.replace("/admin");
    }
  }, [loading, isOscUser, pathname, router]);

  return <>{children}</>;
}

function CrascAdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isCrascAdmin = !!user?.is_staff && !user?.is_superuser && !!user?.crasc_id;

  useEffect(() => {
    if (loading || !isCrascAdmin) return;
    if (pathname === "/admin") return;
    const allowed = CRASC_ADMIN_ALLOWED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (!allowed) router.replace("/admin");
  }, [loading, isCrascAdmin, pathname, router]);

  return <>{children}</>;
}

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
          <OscRouteGuard>
            <CrascAdminRouteGuard>
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
            </CrascAdminRouteGuard>
          </OscRouteGuard>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
