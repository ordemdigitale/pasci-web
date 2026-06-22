"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Trash2, Eye, CheckCircle, XCircle, Clock, X, Loader2, Heart } from "lucide-react";
import { getToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Don {
  id: number;
  nom: string;
  prenoms: string | null;
  email: string;
  telephone: string | null;
  montant: number;
  message: string | null;
  transaction_id: string | null;
  operateur: string | null;
  statut: "en_attente" | "soumis" | "success" | "rejete";
  created_at: string;
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  soumis: "À valider",
  success: "Confirmé",
  rejete: "Rejeté",
};

const STATUT_COLORS: Record<string, string> = {
  en_attente: "bg-gray-100 text-gray-700",
  soumis: "bg-orange-100 text-orange-800",
  success: "bg-green-100 text-green-800",
  rejete: "bg-red-100 text-red-800",
};

export default function DonsPage() {
  const [dons, setDons] = useState<Don[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [selected, setSelected] = useState<Don | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const url = filterStatut
        ? `${API_BASE_URL}/api/v1/dons?statut=${filterStatut}&limit=200`
        : `${API_BASE_URL}/api/v1/dons?limit=200`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setDons(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatut]);

  useEffect(() => { load(); }, [load]);

  const filtered = dons.filter((d) =>
    (d.nom + " " + (d.prenoms || "")).toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.transaction_id || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleConfirmer(id: number) {
    if (!confirm("Confirmer ce don ?")) return;
    setActionLoading(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/dons/${id}/confirmer`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDons(prev => prev.map(d => d.id === id ? { ...d, statut: "success" } : d));
        if (selected?.id === id) setSelected(prev => prev ? { ...prev, statut: "success" } : null);
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRejeter(id: number) {
    if (!confirm("Rejeter ce don ?")) return;
    setActionLoading(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/dons/${id}/rejeter`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDons(prev => prev.map(d => d.id === id ? { ...d, statut: "rejete" } : d));
        if (selected?.id === id) setSelected(prev => prev ? { ...prev, statut: "rejete" } : null);
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce don ?")) return;
    setActionLoading(id);
    try {
      const token = getToken();
      await fetch(`${API_BASE_URL}/api/v1/dons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDons(prev => prev.filter(d => d.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setActionLoading(null);
    }
  }

  const totalRecu = dons.filter(d => d.statut === "success").reduce((s, d) => s + d.montant, 0);

  return (
    <div className="p-4 sm:p-6 font-poppins">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#E05017]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-[#E05017]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des dons</h1>
          <p className="text-sm text-gray-500">{dons.length} don(s) enregistré(s)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-500 mb-1">Total confirmé</p>
          <p className="text-lg font-bold text-green-700">{totalRecu.toLocaleString("fr-FR")} FCFA</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">À valider</p>
          <p className="text-xl font-bold text-orange-600">{dons.filter(d => d.statut === "soumis").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Confirmés</p>
          <p className="text-xl font-bold text-green-700">{dons.filter(d => d.statut === "success").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-xl font-bold text-gray-600">{dons.filter(d => d.statut === "en_attente").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Nom, email ou code transaction..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]" />
        </div>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] bg-white">
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="soumis">À valider</option>
          <option value="success">Confirmé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#E05017]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">Aucun don trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Donateur</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Montant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Opérateur / Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((don) => (
                  <tr key={don.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{don.prenoms ? `${don.prenoms} ${don.nom}` : don.nom}</p>
                      <p className="text-xs text-gray-500">{don.email}</p>
                      {don.telephone && <p className="text-xs text-gray-400">{don.telephone}</p>}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {don.montant.toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-4 py-3">
                      {don.operateur && <p className="text-xs font-semibold text-gray-700 capitalize">{don.operateur.replace("_", " ")}</p>}
                      {don.transaction_id
                        ? <p className="font-mono text-xs text-gray-600 break-all">{don.transaction_id}</p>
                        : <p className="text-xs text-gray-400">—</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${STATUT_COLORS[don.statut]}`}>
                        {don.statut === "success" && <CheckCircle className="w-3 h-3" />}
                        {don.statut === "soumis" && <Clock className="w-3 h-3" />}
                        {don.statut === "en_attente" && <Clock className="w-3 h-3" />}
                        {don.statut === "rejete" && <XCircle className="w-3 h-3" />}
                        {STATUT_LABELS[don.statut]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(don.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {don.statut === "soumis" && (
                          <>
                            <button onClick={() => handleConfirmer(don.id)} disabled={actionLoading === don.id}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 disabled:opacity-50 transition-colors">
                              {actionLoading === don.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirmer"}
                            </button>
                            <button onClick={() => handleRejeter(don.id)} disabled={actionLoading === don.id}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 disabled:opacity-50 transition-colors">
                              Rejeter
                            </button>
                          </>
                        )}
                        <button onClick={() => setSelected(don)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(don.id)} disabled={actionLoading === don.id}
                          className="p-1.5 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg text-gray-900">Don #{selected.id}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500 mb-1">Nom</p><p className="font-medium">{selected.prenoms ? `${selected.prenoms} ${selected.nom}` : selected.nom}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Email</p><p className="font-medium break-all">{selected.email}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Téléphone</p><p className="font-medium">{selected.telephone || "—"}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Montant</p><p className="font-bold text-green-700 text-base">{selected.montant.toLocaleString("fr-FR")} FCFA</p></div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Statut</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${STATUT_COLORS[selected.statut]}`}>
                    {STATUT_LABELS[selected.statut]}
                  </span>
                </div>
                {selected.operateur && (
                  <div><p className="text-xs text-gray-500 mb-1">Opérateur</p><p className="font-medium capitalize">{selected.operateur.replace("_", " ")}</p></div>
                )}
                {selected.transaction_id && (
                  <div className="col-span-2"><p className="text-xs text-gray-500 mb-1">Code transaction</p><p className="font-mono text-xs text-gray-700 break-all">{selected.transaction_id}</p></div>
                )}
                {selected.message && (
                  <div className="col-span-2"><p className="text-xs text-gray-500 mb-1">Message</p><p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selected.message}</p></div>
                )}
                <div className="col-span-2"><p className="text-xs text-gray-500 mb-1">Date</p><p>{new Date(selected.created_at).toLocaleString("fr-FR")}</p></div>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-3">
              {selected.statut === "soumis" && (
                <>
                  <button onClick={() => handleConfirmer(selected.id)} disabled={actionLoading === selected.id}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-200 disabled:opacity-50">
                    Confirmer
                  </button>
                  <button onClick={() => handleRejeter(selected.id)} disabled={actionLoading === selected.id}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 disabled:opacity-50">
                    Rejeter
                  </button>
                </>
              )}
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
