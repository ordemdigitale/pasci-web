"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  X,
  Loader2,
  ClipboardList,
  Copy,
  KeyRound,
  Building2,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface OscCredentials {
  osc_id: number;
  osc_name: string;
  email: string;
  username: string;
  temp_password: string;
}

interface DemandeAdhesion {
  id: number;
  nom_organisation: string;
  type_organisation: string;
  crasc_nom: string | null;
  type_osc: string | null;
  region: string;
  ville: string | null;
  email: string;
  telephone: string;
  description: string | null;
  motivation: string;
  statut: "en_attente" | "approuvee" | "rejetee";
  note_admin: string | null;
  created_at: string;
  updated_at: string;
  credentials?: OscCredentials | null;
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  approuvee: "Approuvée",
  rejetee: "Rejetée",
};

const STATUT_COLORS: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-800",
  approuvee: "bg-green-100 text-green-800",
  rejetee: "bg-red-100 text-red-800",
};

function CredentialsPanel({ creds, onClose }: { creds: OscCredentials; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ value, id }: { value: string; id: string }) => (
    <button
      onClick={() => copy(value, id)}
      className="ml-2 p-1 rounded text-gray-400 hover:text-[#2A591D] hover:bg-green-50 transition-colors"
      title="Copier"
    >
      {copied === id ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} />}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <KeyRound size={20} className="text-green-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Compte créé avec succès</h3>
                <p className="text-xs text-gray-500">Transmettez ces identifiants à l'organisation</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
            <Building2 size={16} className="text-green-700 flex-shrink-0" />
            <span className="text-sm font-semibold text-green-800">{creds.osc_name}</span>
          </div>

          {[
            { label: "Email de connexion", value: creds.email, id: "email" },
            { label: "Nom d'utilisateur", value: creds.username, id: "username" },
            { label: "Mot de passe temporaire", value: creds.temp_password, id: "password" },
          ].map(({ label, value, id }) => (
            <div key={id}>
              <div className="text-xs text-gray-500 font-medium mb-1">{label}</div>
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <code className="text-sm font-mono text-gray-800 break-all">{value}</code>
                <CopyBtn value={value} id={id} />
              </div>
            </div>
          ))}

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Notez bien ce mot de passe — il ne sera plus affiché. L'utilisateur devra le changer à sa première connexion.
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#2A591D] hover:bg-[#1e4015] text-white font-semibold rounded-xl transition-colors"
          >
            J'ai noté les identifiants
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DemandesAdhesionPage() {
  const [demandes, setDemandes] = useState<DemandeAdhesion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [selected, setSelected] = useState<DemandeAdhesion | null>(null);
  const [noteAdmin, setNoteAdmin] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<OscCredentials | null>(null);

  const loadDemandes = async () => {
    try {
      const url = filterStatut
        ? `${API_BASE_URL}/api/v1/adhesion?statut=${filterStatut}&limit=200`
        : `${API_BASE_URL}/api/v1/adhesion?limit=200`;
      const res = await fetch(url);
      if (res.ok) setDemandes(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDemandes();
  }, [filterStatut]);

  const filtered = demandes.filter((d) =>
    d.nom_organisation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDetail = (demande: DemandeAdhesion) => {
    setSelected(demande);
    setNoteAdmin(demande.note_admin || "");
  };

  const closeDetail = () => {
    setSelected(null);
    setNoteAdmin("");
  };

  const handleUpdateStatut = async (statut: "approuvee" | "rejetee") => {
    if (!selected) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/adhesion/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut, note_admin: noteAdmin || null }),
      });
      if (res.ok) {
        const updated: DemandeAdhesion = await res.json();
        setDemandes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        setSelected(updated);
        // Afficher les credentials si une OSC vient d'être créée
        if (statut === "approuvee" && updated.credentials) {
          setPendingCredentials(updated.credentials);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selected) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/adhesion/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note_admin: noteAdmin || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDemandes((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
        setSelected(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette demande définitivement ?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/adhesion/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDemandes((prev) => prev.filter((d) => d.id !== id));
        if (selected?.id === id) closeDetail();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const counts = {
    total: demandes.length,
    en_attente: demandes.filter((d) => d.statut === "en_attente").length,
    approuvee: demandes.filter((d) => d.statut === "approuvee").length,
    rejetee: demandes.filter((d) => d.statut === "rejetee").length,
  };

  return (
    <div className="p-6 font-poppins">
      {/* Credentials modal */}
      {pendingCredentials && (
        <CredentialsPanel
          creds={pendingCredentials}
          onClose={() => setPendingCredentials(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList size={24} className="text-[#2a591d]" />
          Demandes d'adhésion
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérer les demandes d'adhésion soumises via le formulaire
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: counts.total, color: "text-gray-800", bg: "bg-gray-50" },
          { label: "En attente", value: counts.en_attente, color: "text-yellow-700", bg: "bg-yellow-50" },
          { label: "Approuvées", value: counts.approuvee, color: "text-green-700", bg: "bg-green-50" },
          { label: "Rejetées", value: counts.rejetee, color: "text-red-700", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, région..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="approuvee">Approuvée</option>
          <option value="rejetee">Rejetée</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-[#2a591d]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Aucune demande trouvée.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Organisation</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Région</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((demande) => (
                  <tr
                    key={demande.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{demande.nom_organisation}</td>
                    <td className="px-4 py-3 text-gray-600">{demande.type_osc || demande.type_organisation}</td>
                    <td className="px-4 py-3 text-gray-600">{demande.region}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800">{demande.email}</div>
                      <div className="text-gray-400 text-xs">{demande.telephone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUT_COLORS[demande.statut]}`}>
                        {demande.statut === "en_attente" && <Clock size={12} />}
                        {demande.statut === "approuvee" && <CheckCircle size={12} />}
                        {demande.statut === "rejetee" && <XCircle size={12} />}
                        {STATUT_LABELS[demande.statut]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(demande.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetail(demande)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Voir le détail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(demande.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.nom_organisation}</h2>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${STATUT_COLORS[selected.statut]}`}>
                  {selected.statut === "en_attente" && <Clock size={11} />}
                  {selected.statut === "approuvee" && <CheckCircle size={11} />}
                  {selected.statut === "rejetee" && <XCircle size={11} />}
                  {STATUT_LABELS[selected.statut]}
                </span>
              </div>
              <button onClick={closeDetail} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {selected.crasc_nom && (
                  <div>
                    <div className="text-gray-500 text-xs mb-0.5">CRASC</div>
                    <div className="font-medium">{selected.crasc_nom}</div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500 text-xs mb-0.5">Type d'OSC</div>
                  <div className="font-medium">{selected.type_osc || selected.type_organisation}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-0.5">Région</div>
                  <div className="font-medium">{selected.region}{selected.ville ? ` — ${selected.ville}` : ""}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-0.5">Email</div>
                  <div className="font-medium">{selected.email}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-0.5">Téléphone</div>
                  <div className="font-medium">{selected.telephone}</div>
                </div>
              </div>

              {selected.description && (
                <div>
                  <div className="text-gray-500 text-xs mb-1">Description</div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.description}</p>
                </div>
              )}

              <div>
                <div className="text-gray-500 text-xs mb-1">Motivation</div>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.motivation}</p>
              </div>

              {/* Note admin */}
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Note de l'administrateur</label>
                <textarea
                  value={noteAdmin}
                  onChange={(e) => setNoteAdmin(e.target.value)}
                  rows={3}
                  placeholder="Ajouter une note interne..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-200"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={isUpdating}
                  className="mt-2 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Enregistrement..." : "Enregistrer la note"}
                </button>
              </div>
            </div>

            {/* Actions */}
            {selected.statut === "en_attente" && (
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => handleUpdateStatut("approuvee")}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  {isUpdating ? "Création en cours..." : "Approuver & créer le compte"}
                </button>
                <button
                  onClick={() => handleUpdateStatut("rejetee")}
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                  Rejeter
                </button>
              </div>
            )}
            {selected.statut !== "en_attente" && (
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleUpdateStatut(selected.statut === "approuvee" ? "rejetee" : "approuvee")}
                  disabled={isUpdating}
                  className="w-full py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Mise à jour..." : `Passer en "${selected.statut === "approuvee" ? "rejetée" : "approuvée"}"`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
