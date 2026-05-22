"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Eye, X, Loader2, Mail } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ContactMessage {
  id: number;
  categorie_acteur: string | null;
  nom: string;
  prenoms: string;
  fonction: string | null;
  sexe: string | null;
  tranche_age: string | null;
  email: string;
  contact: string | null;
  pays: string | null;
  lieu_residence: string | null;
  motif: string;
  message: string | null;
  statut: "nouveau" | "lu" | "traite";
  created_at: string;
}

const STATUT_LABELS: Record<string, string> = {
  nouveau: "Nouveau",
  lu: "Lu",
  traite: "Traité",
};

const STATUT_COLORS: Record<string, string> = {
  nouveau: "bg-blue-100 text-blue-800",
  lu: "bg-yellow-100 text-yellow-800",
  traite: "bg-green-100 text-green-800",
};

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterMotif, setFilterMotif] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const load = async () => {
    try {
      const url = filterStatut
        ? `${API_BASE_URL}/api/v1/contact?statut=${filterStatut}&limit=200`
        : `${API_BASE_URL}/api/v1/contact?limit=200`;
      const res = await fetchWithAuth(url);
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterStatut]);

  const filtered = messages.filter((m) => {
    const matchSearch =
      `${m.nom} ${m.prenoms}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.motif.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMotif = filterMotif ? m.motif === filterMotif : true;
    return matchSearch && matchMotif;
  });

  const openDetail = async (m: ContactMessage) => {
    setSelected(m);
    // Marquer comme "lu" si encore "nouveau"
    if (m.statut === "nouveau") {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/contact/${m.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: "lu" }),
        });
        if (res.ok) {
          const updated = await res.json();
          setMessages((prev) => prev.map((msg) => msg.id === updated.id ? updated : msg));
          setSelected(updated);
        }
      } catch {}
    }
  };

  const handleStatut = async (statut: string) => {
    if (!selected) return;
    setIsUpdating(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/v1/contact/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) => prev.map((m) => m.id === updated.id ? updated : m));
        setSelected(updated);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce message ?")) return;
    setIsDeleting(true);
    try {
      await fetchWithAuth(`${API_BASE_URL}/api/v1/contact/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const nouveaux = messages.filter((m) => m.statut === "nouveau").length;
  const lus = messages.filter((m) => m.statut === "lu").length;
  const traites = messages.filter((m) => m.statut === "traite").length;

  return (
    <div className="p-4 sm:p-6 font-poppins">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#E05017]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-[#E05017]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Messages de contact</h1>
          <p className="text-sm text-gray-500">{messages.length} message(s) reçu(s)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Nouveaux</p>
          <p className="text-xl font-bold text-blue-600">{nouveaux}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Lus</p>
          <p className="text-xl font-bold text-yellow-600">{lus}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Traités</p>
          <p className="text-xl font-bold text-green-600">{traites}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Nom, email ou motif..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
          />
        </div>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="nouveau">Nouveau</option>
          <option value="lu">Lu</option>
          <option value="traite">Traité</option>
        </select>
        <select
          value={filterMotif}
          onChange={(e) => setFilterMotif(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] bg-white"
        >
          <option value="">Tous les motifs</option>
          <option value="Renseignement">Renseignement</option>
          <option value="Formation">Formation</option>
          <option value="Bénévolat">Bénévolat</option>
          <option value="Recherche">Recherche</option>
          <option value="Adhésion">Adhésion</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#E05017]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">Aucun message trouvé.</div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Expéditeur</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Catégorie</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Motif</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((m) => (
                    <tr key={m.id} className={`hover:bg-gray-50 ${m.statut === "nouveau" ? "font-semibold" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="text-gray-900">{m.nom} {m.prenoms}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{m.categorie_acteur || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 font-medium">
                          {m.motif}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{m.contact || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${STATUT_COLORS[m.statut]}`}>
                          {STATUT_LABELS[m.statut]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openDetail(m)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {filtered.map((m) => (
                <div key={m.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className={`text-gray-900 text-sm truncate ${m.statut === "nouveau" ? "font-bold" : "font-medium"}`}>
                        {m.nom} {m.prenoms}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{m.email}</p>
                      <p className="text-xs text-orange-700 mt-0.5">{m.motif}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUT_COLORS[m.statut]}`}>
                      {STATUT_LABELS[m.statut]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString("fr-FR")}</p>
                    <div className="flex gap-2">
                      <button onClick={() => openDetail(m)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <div>
                <h2 className="font-bold text-lg text-gray-900">{selected.nom} {selected.prenoms}</h2>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_COLORS[selected.statut]}`}>
                  {STATUT_LABELS[selected.statut]}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-medium break-all">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <p className="font-medium">{selected.contact || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Catégorie</p>
                  <p className="font-medium">{selected.categorie_acteur || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Fonction</p>
                  <p className="font-medium">{selected.fonction || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sexe</p>
                  <p className="font-medium">{selected.sexe || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tranche d'âge</p>
                  <p className="font-medium">{selected.tranche_age || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pays</p>
                  <p className="font-medium">{selected.pays || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Lieu de résidence</p>
                  <p className="font-medium">{selected.lieu_residence || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Motif</p>
                  <span className="inline-flex px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 font-semibold">
                    {selected.motif}
                  </span>
                </div>
                {selected.message && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Message</p>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </p>
                  </div>
                )}
                <div className="col-span-2 text-xs text-gray-400">
                  Reçu le {new Date(selected.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                </div>
              </div>

              {/* Changer statut */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Changer le statut</p>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleStatut("nouveau")} disabled={isUpdating || selected.statut === "nouveau"}
                    className="py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100 disabled:opacity-40">
                    Nouveau
                  </button>
                  <button onClick={() => handleStatut("lu")} disabled={isUpdating || selected.statut === "lu"}
                    className="py-2 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-semibold hover:bg-yellow-100 disabled:opacity-40">
                    Lu
                  </button>
                  <button onClick={() => handleStatut("traite")} disabled={isUpdating || selected.statut === "traite"}
                    className="py-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold hover:bg-green-100 disabled:opacity-40">
                    Traité
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t flex justify-between sticky bottom-0 bg-white">
              <button onClick={() => handleDelete(selected.id)} disabled={isDeleting}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 disabled:opacity-50">
                Supprimer
              </button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
