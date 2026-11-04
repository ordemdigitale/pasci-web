"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, CheckCircle, XCircle, Clock, Loader2, CreditCard, Trash2, RotateCcw, AlertTriangle, X } from "lucide-react";
import { getToken } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Inscription {
  id: number;
  formation_id: number;
  formation_title?: string | null;
  participant_name: string;
  participant_email: string;
  participant_phone: string | null;
  payment_status: "pending" | "soumis" | "confirmed" | "failed" | "gratuite";
  payment_amount: number | null;
  payment_transaction_id: string | null;
  payment_operator: string | null;
  payment_date: string | null;
  created_at: string;
}

const STATUT_LABELS: Record<string, string> = {
  pending: "En attente",
  soumis: "À valider",
  confirmed: "Confirmé",
  failed: "Rejeté",
};

const STATUT_COLORS: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  soumis: "bg-orange-100 text-orange-800",
  confirmed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export default function PaiementsFormationsPage() {
  const { user } = useAuth();
  // Suppression et réinitialisation réservées au super administrateur
  const isSuperAdmin = !!user?.is_superuser;

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [resetScope, setResetScope] = useState<"en_attente" | "tout">("en_attente");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/inscriptions/en-attente`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setInscriptions(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = inscriptions.filter(i =>
    i.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.participant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.payment_transaction_id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.formation_title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleValider(id: number) {
    if (!confirm("Valider ce paiement ?")) return;
    setActionLoading(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/inscriptions/${id}/valider-paiement`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInscriptions(prev => prev.filter(i => i.id !== id));
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRejeter(id: number) {
    const raison = prompt("Motif de rejet (optionnel) :");
    setActionLoading(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/inscriptions/${id}/rejeter-paiement`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ raison: raison || null }),
      });
      if (res.ok) {
        setInscriptions(prev => prev.filter(i => i.id !== id));
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSupprimer(id: number) {
    if (!confirm("Supprimer définitivement cette inscription et son paiement ?")) return;
    setActionLoading(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/inscriptions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInscriptions(prev => prev.filter(i => i.id !== id));
      } else {
        const erreur = await res.json().catch(() => null);
        alert(erreur?.detail || "Suppression impossible.");
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReinitialiser() {
    setIsResetting(true);
    setResetMessage("");
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/api/v1/formations/inscriptions/reinitialiser`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ portee: resetScope }),
      });
      if (res.ok) {
        const data = await res.json();
        setResetMessage(`${data.supprimees} inscription(s) supprimée(s).`);
        await load();
        setTimeout(() => { setShowReset(false); setResetMessage(""); }, 1800);
      } else {
        const erreur = await res.json().catch(() => null);
        setResetMessage(erreur?.detail || "Réinitialisation impossible.");
      }
    } finally {
      setIsResetting(false);
    }
  }

  const nbEnAttente = inscriptions.filter(i => i.payment_status === "pending").length;
  const nbSoumis = inscriptions.filter(i => i.payment_status === "soumis").length;

  return (
    <div className="p-4 sm:p-6 font-poppins">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#E05017]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-5 h-5 text-[#E05017]" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Paiements formations</h1>
          <p className="text-sm text-gray-500">{inscriptions.length} inscription(s) en attente de validation</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => { setResetScope("en_attente"); setResetMessage(""); setShowReset(true); }}
            disabled={inscriptions.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Vider la liste des paiements à traiter"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Réinitialiser la liste</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-xs text-orange-600 mb-1">À valider</p>
          <p className="text-2xl font-bold text-orange-700">{nbSoumis}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">En attente de paiement</p>
          <p className="text-2xl font-bold text-gray-700">{nbEnAttente}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Nom, email, formation ou code transaction..."
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#E05017]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">Aucun paiement en attente.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Participant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Formation</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Montant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Opérateur / Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((insc) => (
                  <tr key={insc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{insc.participant_name}</p>
                      <p className="text-xs text-gray-500">{insc.participant_email}</p>
                      {insc.participant_phone && <p className="text-xs text-gray-400">{insc.participant_phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-800 max-w-[220px]">
                      <p className="line-clamp-2">{insc.formation_title || `Formation #${insc.formation_id}`}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {insc.payment_amount ? `${insc.payment_amount.toLocaleString("fr-FR")} FCFA` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {insc.payment_operator && (
                        <p className="text-xs font-semibold text-gray-700 capitalize">{insc.payment_operator.replace("_", " ")}</p>
                      )}
                      {insc.payment_transaction_id
                        ? <p className="font-mono text-xs text-gray-600 break-all">{insc.payment_transaction_id}</p>
                        : <p className="text-xs text-gray-400">—</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${STATUT_COLORS[insc.payment_status] || "bg-gray-100 text-gray-700"}`}>
                        {insc.payment_status === "confirmed" && <CheckCircle className="w-3 h-3" />}
                        {insc.payment_status === "soumis" && <Clock className="w-3 h-3" />}
                        {insc.payment_status === "pending" && <Clock className="w-3 h-3" />}
                        {insc.payment_status === "failed" && <XCircle className="w-3 h-3" />}
                        {STATUT_LABELS[insc.payment_status] || insc.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(insc.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {insc.payment_status === "soumis" && (
                          <>
                            <button onClick={() => handleValider(insc.id)} disabled={actionLoading === insc.id}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 disabled:opacity-50 transition-colors">
                              {actionLoading === insc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Valider"}
                            </button>
                            <button onClick={() => handleRejeter(insc.id)} disabled={actionLoading === insc.id}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 disabled:opacity-50 transition-colors">
                              Rejeter
                            </button>
                          </>
                        )}
                        {isSuperAdmin && (
                          <button onClick={() => handleSupprimer(insc.id)} disabled={actionLoading === insc.id}
                            title="Supprimer cette inscription"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Réinitialisation de la liste — super administrateur uniquement */}
      {showReset && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-start gap-3 p-5 border-b border-gray-100">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-900">Réinitialiser la liste</h2>
                <p className="text-sm text-gray-500">Action irréversible, réservée au super administrateur.</p>
              </div>
              <button onClick={() => setShowReset(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <label className={`flex gap-3 p-3 rounded-xl border cursor-pointer ${resetScope === "en_attente" ? "border-[#E05017] bg-[#E05017]/5" : "border-gray-200"}`}>
                <input type="radio" name="portee" checked={resetScope === "en_attente"}
                  onChange={() => setResetScope("en_attente")} className="mt-1 accent-[#E05017]" />
                <span className="text-sm">
                  <span className="font-semibold text-gray-900 block">Inscriptions jamais payées</span>
                  <span className="text-gray-500">Supprime les {nbEnAttente} inscription(s) en attente de paiement. Les codes de transaction soumis sont conservés.</span>
                </span>
              </label>

              <label className={`flex gap-3 p-3 rounded-xl border cursor-pointer ${resetScope === "tout" ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
                <input type="radio" name="portee" checked={resetScope === "tout"}
                  onChange={() => setResetScope("tout")} className="mt-1 accent-red-600" />
                <span className="text-sm">
                  <span className="font-semibold text-gray-900 block">Vider toute la liste</span>
                  <span className="text-gray-500">Supprime les {nbEnAttente + nbSoumis} inscription(s) affichées, y compris les {nbSoumis} paiement(s) soumis non validés.</span>
                </span>
              </label>

              <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-3">
                Les paiements déjà confirmés ne sont jamais supprimés.
              </p>

              {resetMessage && (
                <p className="text-sm font-semibold text-gray-700">{resetMessage}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowReset(false)} disabled={isResetting}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={handleReinitialiser} disabled={isResetting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">
                {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
