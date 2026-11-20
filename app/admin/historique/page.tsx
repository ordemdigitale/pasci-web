"use client";

import { useState, useEffect, useCallback } from "react";
import { History, Search, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TAILLE_PAGE = 50;

interface ActionJournal {
  id: number;
  utilisateur: string | null;
  action: string;
  action_libelle: string;
  cible_type: string | null;
  cible_id: string | null;
  cible_libelle: string | null;
  details: string | null;
  created_at: string;
}

interface TypeAction {
  code: string;
  libelle: string;
}

// Couleur par famille d'action : un rejet doit se repérer d'un coup d'œil
function couleurAction(code: string): string {
  if (code.includes("rejet") || code.includes("supprim") || code.includes("reinitialis")) {
    return "bg-red-100 text-red-700";
  }
  if (code.includes("publie") || code.includes("approuv") || code.includes("valide") || code.includes("activee")) {
    return "bg-green-100 text-green-700";
  }
  if (code.includes("export") || code.includes("message")) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HistoriquePage() {
  const [items, setItems] = useState<ActionJournal[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [typesActions, setTypesActions] = useState<TypeAction[]>([]);
  const [action, setAction] = useState("");
  const [utilisateur, setUtilisateur] = useState("");
  const [recherche, setRecherche] = useState("");
  const [rechercheSaisie, setRechercheSaisie] = useState("");
  const [depuis, setDepuis] = useState("");
  const [jusquA, setJusquA] = useState("");

  const charger = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), size: String(TAILLE_PAGE) });
      if (action) params.set("action", action);
      if (utilisateur.trim()) params.set("utilisateur", utilisateur.trim());
      if (recherche) params.set("search", recherche);
      if (depuis) params.set("depuis", depuis);
      if (jusquA) params.set("jusqu_a", jusquA);
      const res = await fetchWithAuth(`${API_BASE}/api/v1/journal?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
        setPages(data.pages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, action, utilisateur, recherche, depuis, jusquA]);

  useEffect(() => { charger(); }, [charger]);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/api/v1/journal/actions`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: TypeAction[]) => Array.isArray(data) && setTypesActions(data))
      .catch(() => {});
  }, []);

  const filtresActifs = action || utilisateur || recherche || depuis || jusquA;
  const effacer = () => {
    setAction(""); setUtilisateur(""); setRecherche(""); setRechercheSaisie("");
    setDepuis(""); setJusquA(""); setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 font-poppins">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#E05017]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <History className="w-5 h-5 text-[#E05017]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Historique des actions</h1>
          <p className="text-sm text-gray-500">
            {total.toLocaleString("fr-FR")} action(s) enregistrée(s)
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les actions (contenu, détail, auteur)…"
              value={rechercheSaisie}
              onChange={(e) => setRechercheSaisie(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setRecherche(rechercheSaisie); setPage(1); } }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            />
          </div>
          <button
            onClick={() => { setRecherche(rechercheSaisie); setPage(1); }}
            className="px-4 py-2 bg-[#2A591D] text-white text-sm font-semibold rounded-xl hover:bg-[#244a17] transition-colors"
          >
            Rechercher
          </button>
          {filtresActifs && (
            <button
              onClick={effacer}
              className="inline-flex items-center gap-1 px-4 py-2 border border-gray-200 text-sm rounded-xl hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" /> Effacer
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="text-xs font-semibold text-gray-600">
            Type d&apos;action
            <select
              value={action}
              onChange={(e) => { setAction(e.target.value); setPage(1); }}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            >
              <option value="">Toutes les actions</option>
              {typesActions.map((t) => <option key={t.code} value={t.code}>{t.libelle}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Utilisateur
            <input
              type="text"
              value={utilisateur}
              onChange={(e) => { setUtilisateur(e.target.value); setPage(1); }}
              placeholder="Nom ou email"
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Du
            <input
              type="date"
              value={depuis}
              onChange={(e) => { setDepuis(e.target.value); setPage(1); }}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            />
          </label>
          <label className="text-xs font-semibold text-gray-600">
            Au
            <input
              type="date"
              value={jusquA}
              onChange={(e) => { setJusquA(e.target.value); setPage(1); }}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            />
          </label>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#E05017]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            Aucune action ne correspond à ces critères.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Date et heure</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Utilisateur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Concerne</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Détail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((ligne) => (
                  <tr key={ligne.id} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(ligne.created_at)}</td>
                    <td className="px-4 py-3 text-gray-900">{ligne.utilisateur || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${couleurAction(ligne.action)}`}>
                        {ligne.action_libelle}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800 max-w-[260px]">
                      <p className="line-clamp-2">{ligne.cible_libelle || "—"}</p>
                      {ligne.cible_type && (
                        <p className="text-[11px] text-gray-400 capitalize">{ligne.cible_type.replace("_", " ")}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[280px]">
                      <p className="line-clamp-2">{ligne.details || "—"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Page {page} sur {pages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
