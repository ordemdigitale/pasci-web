"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, Eye, X, Loader2, Users } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Volontaire {
  id: number;
  nom: string;
  email: string;
  telephone: string | null;
  profession: string | null;
  domaine: string;
  disponibilite: string | null;
  motivation: string;
  statut: "en_attente" | "contacte" | "accepte" | "rejete";
  note_admin: string | null;
  created_at: string;
  updated_at: string;
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  contacte: "Contacté",
  accepte: "Accepté",
  rejete: "Rejeté",
};

const STATUT_COLORS: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-800",
  contacte: "bg-blue-100 text-blue-800",
  accepte: "bg-green-100 text-green-800",
  rejete: "bg-red-100 text-red-800",
};

export default function VolontairesPage() {
  const [volontaires, setVolontaires] = useState<Volontaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [selected, setSelected] = useState<Volontaire | null>(null);
  const [noteAdmin, setNoteAdmin] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = async () => {
    try {
      const url = filterStatut
        ? `${API_BASE_URL}/api/v1/volontaires?statut=${filterStatut}&limit=200`
        : `${API_BASE_URL}/api/v1/volontaires?limit=200`;
      const res = await fetch(url);
      if (res.ok) setVolontaires(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterStatut]);

  const filtered = volontaires.filter((v) =>
    v.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.domaine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDetail = (v: Volontaire) => {
    setSelected(v);
    setNoteAdmin(v.note_admin || "");
  };

  const handleUpdate = async (statut: string) => {
    if (!selected) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/volontaires/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut, note_admin: noteAdmin }),
      });
      if (res.ok) {
        const updated = await res.json();
        setVolontaires((prev) => prev.map((v) => v.id === updated.id ? updated : v));
        setSelected(updated);
        setNoteAdmin(updated.note_admin || "");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette candidature ?")) return;
    setIsDeleting(true);
    try {
      await fetch(`${API_BASE_URL}/api/v1/volontaires/${id}`, { method: "DELETE" });
      setVolontaires((prev) => prev.filter((v) => v.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 font-poppins">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#2a591d]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 text-[#2a591d]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Volontaires</h1>
          <p className="text-sm text-gray-500">{volontaires.length} candidature(s) reçue(s)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { statut: "en_attente", label: "En attente", color: "text-yellow-600" },
          { statut: "contacte", label: "Contactés", color: "text-blue-600" },
          { statut: "accepte", label: "Acceptés", color: "text-green-600" },
          { statut: "rejete", label: "Rejetés", color: "text-red-600" },
        ].map(({ statut, label, color }) => (
          <div key={statut} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${color}`}>{volontaires.filter((v) => v.statut === statut).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Nom, email ou domaine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d]"
          />
        </div>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d] bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="contacte">Contacté</option>
          <option value="accepte">Accepté</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      {/* Table desktop / Cards mobile */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#2a591d]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">Aucune candidature trouvée.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Candidat</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Domaine</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Disponibilité</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{v.nom}</p>
                        <p className="text-xs text-gray-500">{v.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                        <span className="truncate block">{v.domaine}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.disponibilite || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${STATUT_COLORS[v.statut]}`}>
                          {STATUT_LABELS[v.statut]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(v.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openDetail(v)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => handleDelete(v.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
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
              {filtered.map((v) => (
                <div key={v.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-semibold text-gray-900 text-sm truncate">{v.nom}</p>
                      <p className="text-xs text-gray-500 truncate">{v.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{v.domaine}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUT_COLORS[v.statut]}`}>
                      {STATUT_LABELS[v.statut]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">{new Date(v.created_at).toLocaleDateString("fr-FR")}</p>
                    <div className="flex gap-2">
                      <button onClick={() => openDetail(v)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
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

      {/* Detail Modal — slide up sur mobile */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h2 className="font-bold text-lg text-gray-900 truncate">{selected.nom}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-medium break-all">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                  <p className="font-medium">{selected.telephone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Profession</p>
                  <p className="font-medium">{selected.profession || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Disponibilité</p>
                  <p className="font-medium">{selected.disponibilite || "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Domaine</p>
                  <p className="font-medium">{selected.domaine}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Motivation</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{selected.motivation}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Statut actuel</p>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${STATUT_COLORS[selected.statut]}`}>
                  {STATUT_LABELS[selected.statut]}
                </span>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Note interne</label>
                <textarea
                  rows={3}
                  value={noteAdmin}
                  onChange={(e) => setNoteAdmin(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a591d] resize-none"
                  placeholder="Ajouter une note..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleUpdate("contacte")} disabled={isUpdating}
                  className="py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100 disabled:opacity-50">
                  Contacté
                </button>
                <button onClick={() => handleUpdate("accepte")} disabled={isUpdating}
                  className="py-2.5 bg-green-50 text-green-700 rounded-xl text-xs font-semibold hover:bg-green-100 disabled:opacity-50">
                  Accepter
                </button>
                <button onClick={() => handleUpdate("rejete")} disabled={isUpdating}
                  className="py-2.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold hover:bg-red-100 disabled:opacity-50">
                  Rejeter
                </button>
                <button onClick={() => handleUpdate("en_attente")} disabled={isUpdating}
                  className="py-2.5 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-semibold hover:bg-yellow-100 disabled:opacity-50">
                  En attente
                </button>
              </div>
            </div>
            <div className="p-5 border-t flex justify-between sticky bottom-0 bg-white">
              <button onClick={() => handleDelete(selected.id)} disabled={isDeleting}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100">
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
