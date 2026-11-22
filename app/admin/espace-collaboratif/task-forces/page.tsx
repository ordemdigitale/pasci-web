"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Edit3, Trash2, Loader2, Save, X, Crown, Search } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Membre {
  id: number;
  name: string;
  sigle?: string | null;
  region_nom?: string | null;
  email?: string | null;
  chef_de_file: boolean;
}

interface TaskForce {
  id: number;
  nom: string;
  slug?: string | null;
  thematique?: string | null;
  description?: string | null;
  pole_id?: number | null;
  pole_nom?: string | null;
  ordre: number;
  actif: boolean;
  nb_membres: number;
  membres: Membre[];
}

interface OscMini {
  id: number;
  name: string;
  region_nom?: string | null;
}

interface Pole {
  id: number;
  name: string;
}

interface Brouillon {
  id?: number;
  nom: string;
  thematique: string;
  description: string;
  pole_id: string;
  ordre: number;
  actif: boolean;
  osc_ids: number[];
  chef_de_file_id: number | null;
}

const VIDE: Brouillon = {
  nom: "", thematique: "", description: "", pole_id: "", ordre: 0,
  actif: true, osc_ids: [], chef_de_file_id: null,
};

export default function TaskForcesOscPage() {
  const [taskForces, setTaskForces] = useState<TaskForce[]>([]);
  const [poles, setPoles] = useState<Pole[]>([]);
  const [chargement, setChargement] = useState(true);
  const [brouillon, setBrouillon] = useState<Brouillon | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  // Recherche d'OSC à rattacher : l'annuaire compte plusieurs milliers de fiches
  const [rechercheOsc, setRechercheOsc] = useState("");
  const [resultatsOsc, setResultatsOsc] = useState<OscMini[]>([]);
  const [rechercheEnCours, setRechercheEnCours] = useState(false);
  const [membresChoisis, setMembresChoisis] = useState<OscMini[]>([]);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const [tf, p] = await Promise.all([
        fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces?include_inactive=true`),
        fetch(`${API_BASE}/api/v1/forum/poles`),
      ]);
      if (tf.ok) setTaskForces(await tf.json());
      if (p.ok) {
        const data = await p.json();
        setPoles((Array.isArray(data) ? data : data?.items ?? []).map((x: Pole) => ({ id: x.id, name: x.name })));
      }
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  // Recherche différée pour ne pas interroger l'API à chaque frappe
  useEffect(() => {
    if (rechercheOsc.trim().length < 3) { setResultatsOsc([]); return; }
    const minuteur = setTimeout(async () => {
      setRechercheEnCours(true);
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/crasc/osc?search=${encodeURIComponent(rechercheOsc.trim())}&size=20`
        );
        if (res.ok) {
          const data = await res.json();
          setResultatsOsc((data.items ?? []).map((o: OscMini) => ({ id: o.id, name: o.name, region_nom: o.region_nom })));
        }
      } finally {
        setRechercheEnCours(false);
      }
    }, 350);
    return () => clearTimeout(minuteur);
  }, [rechercheOsc]);

  function ouvrirCreation() {
    setErreur("");
    setBrouillon({ ...VIDE });
    setMembresChoisis([]);
    setRechercheOsc("");
  }

  function ouvrirEdition(tf: TaskForce) {
    setErreur("");
    setBrouillon({
      id: tf.id,
      nom: tf.nom,
      thematique: tf.thematique || "",
      description: tf.description || "",
      pole_id: tf.pole_id ? String(tf.pole_id) : "",
      ordre: tf.ordre,
      actif: tf.actif,
      osc_ids: tf.membres.map((m) => m.id),
      chef_de_file_id: tf.membres.find((m) => m.chef_de_file)?.id ?? null,
    });
    setMembresChoisis(tf.membres.map((m) => ({ id: m.id, name: m.name, region_nom: m.region_nom })));
    setRechercheOsc("");
  }

  function ajouterMembre(osc: OscMini) {
    if (!brouillon || brouillon.osc_ids.includes(osc.id)) return;
    setBrouillon({ ...brouillon, osc_ids: [...brouillon.osc_ids, osc.id] });
    setMembresChoisis((prev) => [...prev, osc]);
  }

  function retirerMembre(id: number) {
    if (!brouillon) return;
    setBrouillon({
      ...brouillon,
      osc_ids: brouillon.osc_ids.filter((x) => x !== id),
      chef_de_file_id: brouillon.chef_de_file_id === id ? null : brouillon.chef_de_file_id,
    });
    setMembresChoisis((prev) => prev.filter((o) => o.id !== id));
  }

  async function enregistrer() {
    if (!brouillon) return;
    setErreur("");
    if (!brouillon.nom.trim()) { setErreur("Le nom de la task force est obligatoire."); return; }

    setEnvoi(true);
    try {
      const corps = {
        nom: brouillon.nom.trim(),
        thematique: brouillon.thematique.trim() || null,
        description: brouillon.description.trim() || null,
        pole_id: brouillon.pole_id ? Number(brouillon.pole_id) : null,
        ordre: brouillon.ordre,
        actif: brouillon.actif,
        osc_ids: brouillon.osc_ids,
        chef_de_file_id: brouillon.chef_de_file_id,
      };
      const res = await fetchWithAuth(
        brouillon.id
          ? `${API_BASE}/api/v1/forum/task-forces/${brouillon.id}`
          : `${API_BASE}/api/v1/forum/task-forces`,
        {
          method: brouillon.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corps),
        }
      );
      if (res.ok) {
        setBrouillon(null);
        await charger();
      } else {
        const data = await res.json().catch(() => null);
        setErreur(typeof data?.detail === "string" ? data.detail : "Enregistrement impossible.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(tf: TaskForce) {
    if (!confirm(`Supprimer la task force « ${tf.nom} » ? Les OSC membres ne sont pas supprimées.`)) return;
    const res = await fetchWithAuth(`${API_BASE}/api/v1/forum/task-forces/${tf.id}`, { method: "DELETE" });
    if (res.ok) setTaskForces((prev) => prev.filter((x) => x.id !== tf.id));
  }

  return (
    <div className="p-4 sm:p-6 font-poppins">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#2A591D]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="w-5 h-5 text-[#2A591D]" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Task forces</h1>
          <p className="text-sm text-gray-500">
            Groupes d&apos;OSC de l&apos;espace collaboratif — {taskForces.length} task force(s)
          </p>
        </div>
        <button
          onClick={ouvrirCreation}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white text-sm font-semibold rounded-xl hover:bg-[#244a17] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nouvelle task force
        </button>
      </div>

      {chargement ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#2A591D]" /></div>
      ) : taskForces.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-bold mb-1">Aucune task force</p>
          <p className="text-sm text-gray-500">
            Créez un groupe d&apos;OSC pour travailler sur une thématique commune.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {taskForces.map((tf) => (
            <div key={tf.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900">{tf.nom}</h2>
                  <p className="text-xs text-gray-500">
                    {tf.thematique || "Sans thématique"}
                    {tf.pole_nom ? ` · pôle ${tf.pole_nom}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!tf.actif && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">Inactive</span>
                  )}
                  <button onClick={() => ouvrirEdition(tf)} title="Modifier"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => supprimer(tf)} title="Supprimer"
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {tf.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tf.description}</p>}

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                {tf.nb_membres} OSC membre(s)
              </p>
              <div className="flex flex-wrap gap-1">
                {tf.membres.slice(0, 6).map((m) => (
                  <span key={m.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      m.chef_de_file ? "bg-[#E05017]/10 text-[#E05017] font-semibold" : "bg-gray-100 text-gray-700"
                    }`}>
                    {m.chef_de_file && <Crown className="w-3 h-3" />}
                    {m.name.length > 28 ? `${m.name.slice(0, 28)}…` : m.name}
                  </span>
                ))}
                {tf.nb_membres > 6 && (
                  <span className="text-xs text-gray-400">+ {tf.nb_membres - 6} autre(s)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Création / modification */}
      {brouillon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">
                {brouillon.id ? "Modifier la task force" : "Nouvelle task force"}
              </h2>
              <button onClick={() => setBrouillon(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-gray-600">
                  Nom *
                  <input type="text" value={brouillon.nom}
                    onChange={(e) => setBrouillon({ ...brouillon, nom: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  Thématique
                  <input type="text" value={brouillon.thematique}
                    onChange={(e) => setBrouillon({ ...brouillon, thematique: e.target.value })}
                    placeholder="Gouvernance, genre, climat…"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  Pôle de rattachement
                  <select value={brouillon.pole_id}
                    onChange={(e) => setBrouillon({ ...brouillon, pole_id: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]">
                    <option value="">Aucun</option>
                    {poles.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                  </select>
                </label>
                <label className="text-xs font-semibold text-gray-600">
                  Ordre d&apos;affichage
                  <input type="number" value={brouillon.ordre}
                    onChange={(e) => setBrouillon({ ...brouillon, ordre: Number(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </label>
              </div>

              <label className="text-xs font-semibold text-gray-600 block">
                Description
                <textarea value={brouillon.description} rows={3}
                  onChange={(e) => setBrouillon({ ...brouillon, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#2A591D] resize-y" />
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input type="checkbox" checked={brouillon.actif}
                  onChange={(e) => setBrouillon({ ...brouillon, actif: e.target.checked })}
                  className="accent-[#2A591D]" />
                Task force active (visible dans l&apos;espace collaboratif)
              </label>

              {/* OSC membres */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  OSC membres ({brouillon.osc_ids.length})
                </p>

                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={rechercheOsc}
                    onChange={(e) => setRechercheOsc(e.target.value)}
                    placeholder="Rechercher une OSC à ajouter (3 caractères minimum)…"
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2A591D]" />
                </div>

                {rechercheEnCours && <p className="text-xs text-gray-400 mb-2">Recherche…</p>}
                {resultatsOsc.length > 0 && (
                  <div className="border border-gray-100 rounded-xl max-h-40 overflow-y-auto mb-3">
                    {resultatsOsc.map((o) => (
                      <button key={o.id} onClick={() => ajouterMembre(o)}
                        disabled={brouillon.osc_ids.includes(o.id)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border-b border-gray-50 last:border-0">
                        {o.name}
                        {o.region_nom && <span className="text-xs text-gray-400"> — {o.region_nom}</span>}
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {membresChoisis.map((o) => (
                    <div key={o.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                      <button
                        onClick={() => setBrouillon({
                          ...brouillon,
                          chef_de_file_id: brouillon.chef_de_file_id === o.id ? null : o.id,
                        })}
                        title="Désigner comme chef de file"
                        className={`p-1 rounded ${brouillon.chef_de_file_id === o.id ? "text-[#E05017]" : "text-gray-300 hover:text-gray-500"}`}
                      >
                        <Crown className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-sm text-gray-800 truncate">{o.name}</span>
                      <button onClick={() => retirerMembre(o.id)} className="text-gray-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {membresChoisis.length === 0 && (
                    <p className="text-xs text-gray-400">Aucune OSC rattachée pour l&apos;instant.</p>
                  )}
                </div>
              </div>

              {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            </div>

            <div className="flex justify-end gap-2 p-5 border-t border-gray-100 sticky bottom-0 bg-white">
              <button onClick={() => setBrouillon(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                Annuler
              </button>
              <button onClick={enregistrer} disabled={envoi}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white text-sm font-semibold rounded-xl hover:bg-[#244a17] disabled:opacity-50 transition-colors">
                {envoi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
