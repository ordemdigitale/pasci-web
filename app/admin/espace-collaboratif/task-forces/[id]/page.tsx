"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Users, FolderOpen, Plus, Trash2, Loader2, Crown, Search,
  X, Save, Download, FileText,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface TaskForce {
  id: number;
  nom: string;
  slug?: string | null;
  zone?: string | null;
  thematique?: string | null;
  description?: string | null;
  nb_personnes: number;
  nb_documents: number;
}

interface Personne {
  id: number;
  osc_id?: number | null;
  osc_nom?: string | null;
  titre?: string | null;
  nom: string;
  fonction?: string | null;
  contact?: string | null;
  email?: string | null;
  zone_crasc?: string | null;
  groupes_thematiques?: string | null;
  role?: string | null;
  est_coordonnateur: boolean;
}

interface DocumentTf {
  id: number;
  categorie: string;
  sous_categorie?: string | null;
  titre: string;
  description?: string | null;
  fichier_url?: string | null;
  fichier_nom?: string | null;
  taille_octets?: number | null;
  auteur_nom?: string | null;
  created_at: string;
}

interface CategorieDoc {
  categorie: string;
  sous_categories: string[];
  nb_documents: number;
}

interface OscMini {
  id: number;
  name: string;
  region_nom?: string | null;
}

const PERSONNE_VIDE = {
  osc_id: null as number | null,
  osc_nom: "",
  titre: "",
  nom: "",
  fonction: "",
  contact: "",
  email: "",
  groupes_thematiques: "",
  role: "",
  est_coordonnateur: false,
};

const DOCUMENT_VIDE = {
  titre: "",
  categorie: "",
  sous_categorie: "",
  description: "",
  fichier: null as File | null,
};

function poidsLisible(octets?: number | null): string {
  if (!octets) return "";
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function DetailTaskForcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [taskForce, setTaskForce] = useState<TaskForce | null>(null);
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [documents, setDocuments] = useState<DocumentTf[]>([]);
  const [arborescence, setArborescence] = useState<CategorieDoc[]>([]);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState<"membres" | "documents">("membres");

  // Lucarne « Membres »
  const [fichePersonne, setFichePersonne] = useState<typeof PERSONNE_VIDE | null>(null);
  const [rechercheOsc, setRechercheOsc] = useState("");
  const [resultatsOsc, setResultatsOsc] = useState<OscMini[]>([]);
  const [envoiPersonne, setEnvoiPersonne] = useState(false);
  const [erreurPersonne, setErreurPersonne] = useState("");

  // Dépôt de document
  const [ficheDocument, setFicheDocument] = useState<typeof DOCUMENT_VIDE | null>(null);
  const [envoiDocument, setEnvoiDocument] = useState(false);
  const [erreurDocument, setErreurDocument] = useState("");
  const [filtreCategorie, setFiltreCategorie] = useState("");

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const [tfRes, persRes, docRes, arbRes] = await Promise.all([
        fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces?include_inactive=true`),
        fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/${id}/membres`),
        fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/documents?task_force_id=${id}`),
        fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/documents/arborescence?task_force_id=${id}`),
      ]);
      if (tfRes.ok) {
        const liste: TaskForce[] = await tfRes.json();
        setTaskForce(liste.find((t) => String(t.id) === id) || null);
      }
      if (persRes.ok) setPersonnes(await persRes.json());
      if (docRes.ok) setDocuments(await docRes.json());
      if (arbRes.ok) setArborescence(await arbRes.json());
    } finally {
      setChargement(false);
    }
  }, [id]);

  useEffect(() => { charger(); }, [charger]);

  useEffect(() => {
    if (window.location.hash === "#documents") setOnglet("documents");
  }, []);

  // Recherche d'OSC différée
  useEffect(() => {
    if (rechercheOsc.trim().length < 3) { setResultatsOsc([]); return; }
    const minuteur = setTimeout(async () => {
      const res = await fetch(`${API_BASE}/api/v1/crasc/osc?search=${encodeURIComponent(rechercheOsc.trim())}&size=15`);
      if (res.ok) {
        const data = await res.json();
        setResultatsOsc((data.items ?? []).map((o: OscMini) => ({ id: o.id, name: o.name, region_nom: o.region_nom })));
      }
    }, 350);
    return () => clearTimeout(minuteur);
  }, [rechercheOsc]);

  async function enregistrerPersonne() {
    if (!fichePersonne) return;
    setErreurPersonne("");
    if (!fichePersonne.nom.trim()) { setErreurPersonne("Le nom du membre est obligatoire."); return; }
    setEnvoiPersonne(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/${id}/membres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          osc_id: fichePersonne.osc_id,
          titre: fichePersonne.titre.trim() || null,
          nom: fichePersonne.nom.trim(),
          fonction: fichePersonne.fonction.trim() || null,
          contact: fichePersonne.contact.trim() || null,
          email: fichePersonne.email.trim() || null,
          groupes_thematiques: fichePersonne.groupes_thematiques.trim() || null,
          role: fichePersonne.role.trim() || null,
          est_coordonnateur: fichePersonne.est_coordonnateur,
        }),
      });
      if (res.ok) {
        setFichePersonne(null);
        setRechercheOsc("");
        await charger();
      } else {
        const d = await res.json().catch(() => null);
        setErreurPersonne(typeof d?.detail === "string" ? d.detail : "Enregistrement impossible.");
      }
    } finally {
      setEnvoiPersonne(false);
    }
  }

  async function basculerCoordonnateur(personne: Personne) {
    const res = await fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/membres/${personne.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ est_coordonnateur: !personne.est_coordonnateur }),
    });
    if (res.ok) await charger();
  }

  async function retirerPersonne(personne: Personne) {
    if (!confirm(`Retirer ${personne.nom} de cette task force ?`)) return;
    const res = await fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/membres/${personne.id}`, { method: "DELETE" });
    if (res.ok) await charger();
  }

  async function deposerDocument() {
    if (!ficheDocument) return;
    setErreurDocument("");
    if (!ficheDocument.titre.trim() || !ficheDocument.categorie) {
      setErreurDocument("Le titre et la catégorie sont obligatoires.");
      return;
    }
    setEnvoiDocument(true);
    try {
      const fd = new FormData();
      fd.append("titre", ficheDocument.titre.trim());
      fd.append("categorie", ficheDocument.categorie);
      if (ficheDocument.sous_categorie) fd.append("sous_categorie", ficheDocument.sous_categorie);
      if (ficheDocument.description.trim()) fd.append("description", ficheDocument.description.trim());
      fd.append("task_force_id", id);
      if (ficheDocument.fichier) fd.append("fichier", ficheDocument.fichier);

      const res = await fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/documents`, {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        setFicheDocument(null);
        await charger();
      } else {
        const d = await res.json().catch(() => null);
        setErreurDocument(typeof d?.detail === "string" ? d.detail : "Dépôt impossible.");
      }
    } finally {
      setEnvoiDocument(false);
    }
  }

  async function supprimerDocument(doc: DocumentTf) {
    if (!confirm(`Supprimer « ${doc.titre} » ?`)) return;
    const res = await fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/documents/${doc.id}`, { method: "DELETE" });
    if (res.ok) await charger();
  }

  const sousCategories = arborescence.find((c) => c.categorie === ficheDocument?.categorie)?.sous_categories ?? [];
  const documentsAffiches = filtreCategorie ? documents.filter((d) => d.categorie === filtreCategorie) : documents;

  if (chargement) {
    return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-[#2A591D]" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 font-poppins">
      <Link href="/admin/espace-collaboratif/task-forces"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Toutes les task forces
      </Link>

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{taskForce?.nom ?? "Task force"}</h1>
        <p className="text-sm text-gray-500">
          {taskForce?.zone ? `Zone ${taskForce.zone}` : "Sans zone"}
          {taskForce?.thematique ? ` · ${taskForce.thematique}` : ""}
        </p>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 mb-5 border-b border-gray-200">
        <button onClick={() => setOnglet("membres")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            onglet === "membres" ? "border-[#2A591D] text-[#2A591D]" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}>
          <Users className="w-4 h-4 inline mr-1.5" />
          Membres ({personnes.length})
        </button>
        <button onClick={() => setOnglet("documents")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            onglet === "documents" ? "border-[#E05017] text-[#E05017]" : "border-transparent text-gray-500 hover:text-gray-800"
          }`}>
          <FolderOpen className="w-4 h-4 inline mr-1.5" />
          Espace documentaire ({documents.length})
        </button>
      </div>

      {/* ── Membres ─────────────────────────────────────────────── */}
      {onglet === "membres" && (
        <>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-500">
              Les coordonnateurs siègent d&apos;office à la task force nationale.
            </p>
            <button onClick={() => { setFichePersonne({ ...PERSONNE_VIDE }); setErreurPersonne(""); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white text-sm font-semibold rounded-xl hover:bg-[#244a17] transition-colors">
              <Plus className="w-4 h-4" /> Ajouter un membre
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {personnes.length === 0 ? (
              <p className="text-center py-12 text-sm text-gray-500">Aucun membre enregistré.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Membre</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Fonction</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">OSC / zone CRASC</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">GT</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Rôle</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {personnes.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 align-top">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {p.titre ? `${p.titre} ` : ""}{p.nom}
                          </p>
                          {p.est_coordonnateur && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E05017]">
                              <Crown className="w-3 h-3" /> Coordonnateur
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{p.fonction || "—"}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <p>{p.contact || "—"}</p>
                          {p.email && <p className="text-xs text-gray-500 break-all">{p.email}</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[200px]">
                          <p className="line-clamp-2">{p.osc_nom || "—"}</p>
                          {p.zone_crasc && <p className="text-xs text-gray-500">{p.zone_crasc}</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[160px]">
                          <p className="line-clamp-2">{p.groupes_thematiques || "—"}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{p.role || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => basculerCoordonnateur(p)}
                              title={p.est_coordonnateur ? "Retirer le rôle de coordonnateur" : "Désigner coordonnateur"}
                              className={`p-1.5 rounded-lg transition-colors ${
                                p.est_coordonnateur ? "text-[#E05017] hover:bg-orange-50" : "text-gray-300 hover:text-gray-600 hover:bg-gray-100"
                              }`}>
                              <Crown className="w-4 h-4" />
                            </button>
                            <button onClick={() => retirerPersonne(p)} title="Retirer"
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
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
        </>
      )}

      {/* ── Espace documentaire ─────────────────────────────────── */}
      {onglet === "documents" && (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
            <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]">
              <option value="">Toutes les catégories</option>
              {arborescence.map((c) => (
                <option key={c.categorie} value={c.categorie}>{c.categorie} ({c.nb_documents})</option>
              ))}
            </select>
            <button onClick={() => { setFicheDocument({ ...DOCUMENT_VIDE }); setErreurDocument(""); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white text-sm font-semibold rounded-xl hover:bg-[#c7450f] transition-colors">
              <Plus className="w-4 h-4" /> Déposer un document
            </button>
          </div>

          <div className="space-y-4">
            {arborescence.map((cat) => {
              const docsCat = documentsAffiches.filter((d) => d.categorie === cat.categorie);
              if (filtreCategorie && filtreCategorie !== cat.categorie) return null;
              return (
                <div key={cat.categorie} className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-gray-900 mb-2">
                    {cat.categorie}
                    <span className="ml-2 text-xs font-normal text-gray-400">{docsCat.length} document(s)</span>
                  </p>
                  {docsCat.length === 0 ? (
                    <p className="text-xs text-gray-400">
                      Aucun dépôt. Sous-dossiers : {cat.sous_categories.join(" · ")}
                    </p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {docsCat.map((doc) => (
                        <div key={doc.id} className="py-2 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{doc.titre}</p>
                            <p className="text-xs text-gray-500">
                              {doc.sous_categorie ? `${doc.sous_categorie} · ` : ""}
                              {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                              {doc.auteur_nom ? ` · ${doc.auteur_nom}` : ""}
                              {doc.taille_octets ? ` · ${poidsLisible(doc.taille_octets)}` : ""}
                            </p>
                            {doc.description && <p className="text-xs text-gray-600 mt-0.5">{doc.description}</p>}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {doc.fichier_url && (
                              <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer"
                                title="Télécharger"
                                className="p-1.5 text-[#2A591D] hover:bg-green-50 rounded-lg transition-colors">
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                            <button onClick={() => supprimerDocument(doc)} title="Supprimer"
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Lucarne « Membres » : saisie d'une personne */}
      {fichePersonne && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">Ajouter un membre</h2>
              <button onClick={() => setFichePersonne(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {/* OSC représentée */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">OSC représentée</p>
                {fichePersonne.osc_id ? (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="flex-1 text-sm text-gray-800 truncate">{fichePersonne.osc_nom}</span>
                    <button onClick={() => setFichePersonne({ ...fichePersonne, osc_id: null, osc_nom: "" })}
                      className="text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={rechercheOsc} onChange={(e) => setRechercheOsc(e.target.value)}
                        placeholder="Rechercher l'OSC (3 caractères minimum)…"
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                    </div>
                    {resultatsOsc.length > 0 && (
                      <div className="border border-gray-100 rounded-xl max-h-36 overflow-y-auto mt-1">
                        {resultatsOsc.map((o) => (
                          <button key={o.id}
                            onClick={() => { setFichePersonne({ ...fichePersonne, osc_id: o.id, osc_nom: o.name }); setResultatsOsc([]); setRechercheOsc(""); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0">
                            {o.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  La zone CRASC du membre est reprise de l&apos;OSC.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="text-xs font-semibold text-gray-600">
                  Titre
                  <input type="text" value={fichePersonne.titre} placeholder="M., Mme, Dr…"
                    onChange={(e) => setFichePersonne({ ...fichePersonne, titre: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
                <label className="text-xs font-semibold text-gray-600 sm:col-span-2">
                  Nom et prénoms *
                  <input type="text" value={fichePersonne.nom}
                    onChange={(e) => setFichePersonne({ ...fichePersonne, nom: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
                <label className="text-xs font-semibold text-gray-600 sm:col-span-2">
                  Fonction
                  <input type="text" value={fichePersonne.fonction}
                    onChange={(e) => setFichePersonne({ ...fichePersonne, fonction: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  Rôle
                  <input type="text" value={fichePersonne.role} placeholder="1, 2, 3…"
                    onChange={(e) => setFichePersonne({ ...fichePersonne, role: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  Contact
                  <input type="tel" value={fichePersonne.contact}
                    onChange={(e) => setFichePersonne({ ...fichePersonne, contact: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
                <label className="text-xs font-semibold text-gray-600 sm:col-span-2">
                  Email
                  <input type="email" value={fichePersonne.email}
                    onChange={(e) => setFichePersonne({ ...fichePersonne, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
              </div>

              <label className="text-xs font-semibold text-gray-600 block">
                Groupes thématiques (GT)
                <input type="text" value={fichePersonne.groupes_thematiques}
                  placeholder="GT1 Gouvernance, GT3 Plaidoyer"
                  onChange={(e) => setFichePersonne({ ...fichePersonne, groupes_thematiques: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input type="checkbox" checked={fichePersonne.est_coordonnateur}
                  onChange={(e) => setFichePersonne({ ...fichePersonne, est_coordonnateur: e.target.checked })}
                  className="accent-[#E05017]" />
                Coordonnateur — siège à la task force nationale
              </label>

              {erreurPersonne && <p className="text-sm text-red-600">{erreurPersonne}</p>}
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-gray-100 sticky bottom-0 bg-white">
              <button onClick={() => setFichePersonne(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Annuler</button>
              <button onClick={enregistrerPersonne} disabled={envoiPersonne}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white text-sm font-semibold rounded-xl hover:bg-[#244a17] disabled:opacity-50">
                {envoiPersonne ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dépôt de document */}
      {ficheDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Déposer un document</h2>
              <button onClick={() => setFicheDocument(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <label className="text-xs font-semibold text-gray-600 block">
                Titre *
                <input type="text" value={ficheDocument.titre}
                  onChange={(e) => setFicheDocument({ ...ficheDocument, titre: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017]" />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-600">
                  Catégorie *
                  <select value={ficheDocument.categorie}
                    onChange={(e) => setFicheDocument({ ...ficheDocument, categorie: e.target.value, sous_categorie: "" })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017]">
                    <option value="">Choisir…</option>
                    {arborescence.map((c) => <option key={c.categorie} value={c.categorie}>{c.categorie}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  Sous-catégorie
                  <select value={ficheDocument.sous_categorie} disabled={!ficheDocument.categorie}
                    onChange={(e) => setFicheDocument({ ...ficheDocument, sous_categorie: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017] disabled:bg-gray-50">
                    <option value="">Racine de la catégorie</option>
                    {sousCategories.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
                  </select>
                </label>
              </div>

              <label className="text-xs font-semibold text-gray-600 block">
                Description
                <textarea value={ficheDocument.description} rows={3}
                  onChange={(e) => setFicheDocument({ ...ficheDocument, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-y" />
              </label>

              <label className="text-xs font-semibold text-gray-600 block">
                Fichier (PDF, Word, Excel, image — 10 Mo maximum)
                <input type="file"
                  onChange={(e) => setFicheDocument({ ...ficheDocument, fichier: e.target.files?.[0] ?? null })}
                  className="mt-1 w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#E05017]/10 file:text-[#E05017] file:text-sm file:font-semibold" />
              </label>
              {ficheDocument.fichier && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> {ficheDocument.fichier.name}
                </p>
              )}

              {erreurDocument && <p className="text-sm text-red-600">{erreurDocument}</p>}
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setFicheDocument(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl">Annuler</button>
              <button onClick={deposerDocument} disabled={envoiDocument}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white text-sm font-semibold rounded-xl hover:bg-[#c7450f] disabled:opacity-50">
                {envoiDocument ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Déposer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
