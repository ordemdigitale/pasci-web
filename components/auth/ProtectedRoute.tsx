"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperuser?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = true,
  requireSuperuser = false,
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isSuperuser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated - redirect to login
        router.push("/admin/login");
        return;
      }

      if (requireSuperuser && !isSuperuser) {
        // Requires superuser but user isn't one
        router.push("/admin");
        return;
      }

      if (requireAdmin && !isAdmin) {
        // Requires admin but user isn't one
        router.push("/");
        return;
      }
    }
  }, [user, loading, isAdmin, isSuperuser, requireAdmin, requireSuperuser, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2a591d]/10 rounded-full mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-[#2a591d]" />
          </div>
          <p className="text-gray-600 font-medium">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  // Show nothing if not authorized (will redirect)
  if (!user) {
    return null;
  }

  if (requireSuperuser && !isSuperuser) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  // User is authorized, show children
  return <>{children}</>;
}
