"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink, FolderOpen, Lock } from "lucide-react";
import { getToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ISupportFormation {
  id: number;
  titre: string;
  description?: string | null;
  type: "fichier" | "lien";
  nom?: string | null;
  taille: number;
  public: boolean;
  url?: string | null;
  verrouille: boolean;
}

const taille = (o: number) =>
  !o ? "" : o >= 1024 * 1024 ? `${(o / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(o / 1024))} Ko`;

/**
 * « Lucarne » des supports de formation : documents et liens fournis par le
 * formateur. Les supports réservés ne sont téléchargeables qu'après inscription
 * (formation gratuite ou paiement validé) ; `rafraichir` change quand l'accès change.
 */
export default function SupportsFormation({ slug, rafraichir }: { slug: string; rafraichir?: unknown }) {
  const [supports, setSupports] = useState<ISupportFormation[]>([]);

  useEffect(() => {
    const token = getToken();
    fetch(`${API_BASE_URL}/api/v1/formations/${slug}/supports`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setSupports(Array.isArray(data) ? data : []))
      .catch(() => setSupports([]));
  }, [slug, rafraichir]);

  if (supports.length === 0) return null;

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
      <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-[#E05017]" /> Supports de formation
      </h2>
      <ul className="divide-y divide-gray-100">
        {supports.map((s) => (
          <li key={s.id} className="py-2.5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800">{s.titre}</p>
              {s.description && <p className="text-xs text-gray-500">{s.description}</p>}
              {s.type === "fichier" && (s.nom || s.taille > 0) && (
                <p className="text-[11px] text-gray-400">
                  {[s.nom, taille(s.taille)].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            {s.verrouille || !s.url ? (
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs text-gray-400" title="Réservé aux participants inscrits">
                <Lock className="w-3.5 h-3.5" /> Réservé aux inscrits
              </span>
            ) : (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E05017]/10 text-[#E05017] text-xs font-semibold hover:bg-[#E05017]/20"
              >
                {s.type === "lien" ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                {s.type === "lien" ? "Ouvrir" : "Télécharger"}
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
