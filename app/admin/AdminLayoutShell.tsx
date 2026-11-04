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

// Routes NON autorisées pour les admins CRASC (paramètres globaux plateforme)
const CRASC_ADMIN_BLOCKED_PREFIXES = [
  "/admin/mon-osc",
  "/admin/dons",
  "/admin/volontaires",
  "/admin/contact",
  "/admin/ptf",
];

// Routes autorisées pour les rédacteurs CRASC
const REDACTEUR_CRASC_ALLOWED_PREFIXES = [
  "/admin/formations",
  "/admin/actualites",
  "/admin/gestion-des-actualites",
  "/admin/gestion-des-crasc/articles",
  "/admin/gestion-des-crasc/videos",
  "/admin/gestion-des-crasc/agenda",
  // Liste et recherche avancée des OSC (en lecture : la modification reste aux admins)
  "/admin/gestion-des-crasc/osc",
  "/admin/profile",
  "/admin/settings",
];

// Routes autorisées pour les experts des pôles (l'ajout, la modification et
// les sondages d'un pôle restent réservés au staff)
const EXPERT_ALLOWED_PREFIXES = ["/admin/forum/poles", "/admin/forum/sujets", "/admin/profile"];
const EXPERT_BLOCKED = /^\/admin\/forum\/poles\/(ajouter|[^/]+\/(modifier|sondages))/;

/** Expert des pôles (sans autre rôle d'administration). */
function estExpertSeul(user: ReturnType<typeof useAuth>["user"]) {
  return !!user?.is_expert && !user?.is_staff && !user?.is_superuser && !user?.is_redacteur;
}

function ExpertRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isExpert = estExpertSeul(user);

  useEffect(() => {
    if (loading || !isExpert) return;
    if (pathname === "/admin") {
      // Sans OSC, le tableau de bord n'a rien à montrer : direction ses pôles
      if (!user?.osc_id) router.replace("/admin/forum/poles");
      return;
    }
    if (user?.osc_id && pathname.startsWith("/admin/mon-osc")) return;
    const allowed = EXPERT_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && !EXPERT_BLOCKED.test(pathname);
    if (!allowed) router.replace("/admin/forum/poles");
  }, [loading, isExpert, user?.osc_id, pathname, router]);

  return <>{children}</>;
}

function OscRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isOscUser = !!user?.osc_id && !user?.is_staff && !user?.is_superuser && !user?.is_expert;

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

function RedacteurCrascRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isRedacteurCrasc = !!user?.is_redacteur && !!user?.crasc_id && !user?.is_staff && !user?.is_superuser;

  useEffect(() => {
    if (loading || !isRedacteurCrasc) return;
    if (pathname === "/admin") return;
    const allowed = REDACTEUR_CRASC_ALLOWED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    ) && !(pathname.startsWith("/admin/gestion-des-crasc/osc") && (pathname.endsWith("/modifier") || pathname.endsWith("/ajouter-osc")));
    if (!allowed) router.replace("/admin");
  }, [loading, isRedacteurCrasc, pathname, router]);

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
    const blocked = CRASC_ADMIN_BLOCKED_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix)
    );
    if (blocked) router.replace("/admin");
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
            <RedacteurCrascRouteGuard>
            <CrascAdminRouteGuard>
            <ExpertRouteGuard>
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
            </ExpertRouteGuard>
            </CrascAdminRouteGuard>
            </RedacteurCrascRouteGuard>
          </OscRouteGuard>
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
