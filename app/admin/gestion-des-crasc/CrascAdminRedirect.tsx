"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Redirige automatiquement un admin CRASC vers la page de gestion
 * de son propre CRASC (évite qu'il voie la liste de tous les CRASC).
 */
export default function CrascAdminRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isCrascAdmin = !!user?.is_staff && !user?.is_superuser && !!user?.crasc_id;

  useEffect(() => {
    if (loading || !isCrascAdmin || !user?.crasc_id) return;

    fetch(`${API_BASE}/api/v1/crasc/crasc`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: any[]) => {
        const mine = list.find(
          (c) => c.id === user.crasc_id || Number(c.id) === Number(user.crasc_id)
        );
        if (mine?.slug) {
          router.replace(`/admin/gestion-des-crasc/${mine.slug}`);
        }
      })
      .catch(() => {});
  }, [loading, isCrascAdmin, user?.crasc_id]);

  return null;
}
