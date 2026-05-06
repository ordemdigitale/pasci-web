"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface CrascGuardProps {
  /** ID du CRASC de la ressource consultée (number ou string selon la source) */
  crascId: number | string | null | undefined;
  children: React.ReactNode;
}

/**
 * Protège un composant contre l'accès d'un admin CRASC
 * à des données d'un autre CRASC.
 *
 * - Superuser → accès total, pas de redirection
 * - Staff sans crasc_id configuré → redirigé vers /admin/forbidden
 * - Staff dont crasc_id ≠ crascId de la ressource → redirigé vers /admin/forbidden
 * - crascId non encore chargé (undefined) → attente silencieuse
 */
export default function CrascGuard({ crascId, children }: CrascGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    // Superuser : accès total
    if (user.is_superuser) return;

    // Staff sans CRASC rattaché
    if (user.is_staff && !user.crasc_id) {
      router.replace("/admin/forbidden");
      return;
    }

    // crascId pas encore résolu (chargement en cours de la ressource)
    if (crascId === undefined) return;

    // Staff qui tente d'accéder à un autre CRASC (comparaison normalisée en number)
    if (user.is_staff && crascId !== null) {
      const resourceCrascId = Number(crascId);
      if (user.crasc_id !== resourceCrascId) {
        router.replace("/admin/forbidden");
      }
    }
  }, [loading, user, crascId, router]);

  return <>{children}</>;
}
