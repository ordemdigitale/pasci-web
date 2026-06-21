"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/auth";
import { CheckCircle, XCircle, Loader2, Newspaper, Briefcase, BookOpen, FolderOpen, AlertCircle, Eye, Building2 } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ItemEnAttente {
  id: number | string;
  slug: string;
  title?: string;
  nom?: string;
  created_at: string;
  type: "actualite" | "emploi" | "formation" | "projet" | "video" | "osc_modification";
  changes?: Record<string, unknown>;
}

const TYPE_CONFIG = {
  actualite:  { label: "Actualité",       icon: Newspaper,  color: "text-blue-600",   bg: "bg-blue-50",  border: "border-blue-200", adminPath: "/admin/actualites" },
  emploi:     { label: "Offre d'emploi",  icon: Briefcase,  color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", adminPath: "/admin/emplois" },
  formation:  { label: "Formation",       icon: BookOpen,   color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200", adminPath: "/admin/formations" },
  projet:     { label: "Offre de projet", icon: FolderOpen, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", adminPath: "/admin/projets" },
  video:      { label: "Vidéo CRASC",     icon: CheckCircle, color: "text-teal-600",  bg: "bg-teal-50",  border: "border-teal-200",  adminPath: "/admin/gestion-des-crasc/videos" },
  osc_modification: { label: "Modification OSC", icon: Building2, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", adminPath: "/admin/gestion-des-crasc/osc" },
};

const FIELD_LABELS: Record<string, string> = {
  name: "Nom",
  sigle: "Sigle",
  description: "Description",
  thumbnail_path: "Logo / image",
  type_id: "Type d'OSC",
  email: "Email",
  phone: "Téléphone",
  region_nom: "Région",
  departement: "Département",
  sous_prefecture: "Sous-préfecture",
  ville: "Ville",
  address: "Adresse",
  type_document_formalisation: "Type de document de formalisation",
  document_formalisation_path: "Justificatif de formalisation",
  existence_siege: "Existence d'un siège",
  manuel_procedures: "Manuel de procédures",
  plan_action: "Plan d'action",
  plan_action_document_path: "Preuve du plan d'action",
  rapports_annuels: "Rapports annuels",
  rapports_annuels_document_path: "Preuve des rapports annuels",
  adhesion_crasc_statut: "Adhésion au CRASC",
  adhesion_crasc_document_path: "Preuve d'adhésion au CRASC",
};

function fieldLabel(field: string) {
  return FIELD_LABELS[field] || field.replaceAll("_", " ");
}

export default function AdminModerationPage() {
  const [items, setItems] = useState<ItemEnAttente[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [newsRes, jobsRes, formRes, projRes, videoRes, oscRes] = await Promise.allSettled([
        fetchWithAuth(`${API_BASE}/api/v1/news/admin/en-attente`),
        fetchWithAuth(`${API_BASE}/api/v1/jobs/admin/en-attente`),
        fetchWithAuth(`${API_BASE}/api/v1/formations/admin/en-attente`),
        fetchWithAuth(`${API_BASE}/api/v1/offre-projets/admin/en-attente`),
        fetchWithAuth(`${API_BASE}/api/v1/crasc/video/admin/en-attente`),
        fetchWithAuth(`${API_BASE}/api/v1/crasc/osc-modification-requests/en-attente`),
      ]);

      const parse = async (r: PromiseSettledResult<Response>, type: ItemEnAttente["type"]) => {
        if (r.status !== "fulfilled" || !r.value.ok) return [];
        const data = await r.value.json();
        return (Array.isArray(data) ? data : []).map((d: Record<string, unknown>) => ({
          id: d.id as number | string,
          slug: (d.osc_slug as string) || (d.slug as string) || String(d.id),
          title: (d.osc_name as string) || (d.title as string) || (d.nom as string) || (d.titre as string),
          created_at: d.created_at as string,
          type,
          changes: d.changes as Record<string, unknown> | undefined,
        }));
      };

      const all = [
        ...(await parse(newsRes, "actualite")),
        ...(await parse(jobsRes, "emploi")),
        ...(await parse(formRes, "formation")),
        ...(await parse(projRes, "projet")),
        ...(await parse(videoRes, "video")),
        ...(await parse(oscRes, "osc_modification")).map((item) => ({
          ...item,
          slug: item.slug,
          title: item.title ? `Modification de ${item.title}` : "Modification OSC",
        })),
      ];

      all.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setItems(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAction(item: ItemEnAttente, action: "publie" | "rejete") {
    const key = `${item.type}-${item.slug}`;
    setActionId(key);
    try {
      const urlMap: Record<ItemEnAttente["type"], string> = {
        actualite: `${API_BASE}/api/v1/news/${item.slug}/valider?action=${action}`,
        emploi:    `${API_BASE}/api/v1/jobs/${item.slug}/valider?action=${action}`,
        formation: `${API_BASE}/api/v1/formations/${item.slug}/valider?action=${action}`,
        projet:    `${API_BASE}/api/v1/offre-projets/${item.slug}/valider?action=${action}`,
        video:     `${API_BASE}/api/v1/crasc/video/${item.id}/valider?action=${action}`,
        osc_modification: `${API_BASE}/api/v1/crasc/osc-modification-requests/${item.id}/review?action=${action === "publie" ? "approuvee" : "rejetee"}`,
      };
      await fetchWithAuth(urlMap[item.type], { method: "PATCH" });
      setItems((prev) => prev.filter((i) => !(i.id === item.id && i.type === item.type)));
    } finally {
      setActionId(null);
    }
  }

  const total = items.length;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#E05017]" /> Modération
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {total === 0
              ? "Aucun contenu en attente de validation."
              : `${total} élément${total > 1 ? "s" : ""} en attente de validation`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <CheckCircle className="w-14 h-14 mx-auto mb-3 text-green-400" />
            <p className="font-semibold text-gray-600">Tout est à jour !</p>
            <p className="text-sm mt-1">Aucun contenu soumis par les rédacteurs.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const cfg = TYPE_CONFIG[item.type];
              const Icon = cfg.icon;
              const key = `${item.type}-${item.slug}`;
              const busy = actionId === key;

              return (
                <div
                  key={key}
                  className={`flex items-center gap-4 bg-white border ${cfg.border} rounded-xl px-5 py-4 shadow-sm`}
                >
                  {/* Icône type */}
                  <div className={`${cfg.bg} rounded-lg p-2 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} mr-2`}>
                        {cfg.label}
                      </span>
                      Soumis le {new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    {item.type === "osc_modification" && item.changes && (
                      <div className="text-xs text-gray-500 mt-1">
                        <p>
                          {Object.keys(item.changes).length} champ{Object.keys(item.changes).length > 1 ? "s" : ""} soumis à validation
                        </p>
                        <p className="truncate">
                          {Object.keys(item.changes).slice(0, 6).map(fieldLabel).join(", ")}
                          {Object.keys(item.changes).length > 6 ? "..." : ""}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.slug && (
                      <Link
                        href={`${cfg.adminPath}/${item.slug}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                        title="Ouvrir le contenu"
                      >
                        <Eye className="w-4 h-4" />
                        Voir
                      </Link>
                    )}
                    <button
                      onClick={() => handleAction(item, "publie")}
                      disabled={busy}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Approuver
                    </button>
                    <button
                      onClick={() => handleAction(item, "rejete")}
                      disabled={busy}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Rejeter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
