"use client";

import { useCallback, useEffect, useState } from "react";
import { Crown, Edit3, Loader2, Plus, Save, Trash2, Users, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import type { TaskForce } from "@/lib/ptf-classification";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface PtfMini {
  id: number;
  name: string;
  categorie?: string | null;
}

interface Brouillon {
  id?: number;
  nom: string;
  thematique: string;
  description: string;
  ordre: number;
  actif: boolean;
  ptf_ids: number[];
  chef_de_file_id: number | null;
}

const VIDE: Brouillon = { nom: "", thematique: "", description: "", ordre: 0, actif: true, ptf_ids: [], chef_de_file_id: null };

/** Task forces thématiques : groupes de PTF affichés dans l'annuaire des PTF. */
export default function TaskForcesAdminPage() {
  const [taskForces, setTaskForces] = useState<TaskForce[]>([]);
  const [ptfs, setPtfs] = useState<PtfMini[]>([]);
  const [chargement, setChargement] = useState(true);
  const [brouillon, setBrouillon] = useState<Brouillon | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [filtrePtf, setFiltrePtf] = useState("");

  const charger = useCallback(async () => {
    const [tf, p] = await Promise.all([
      fetchWithAuth(`${API_BASE}/api/v1/task-forces?tous=true`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_BASE}/api/v1/ptf?limit=500`).then((r) => (r.ok ? r.json() : [])),
    ]);
    setTaskForces(tf);
    setPtfs(p);
    setChargement(false);
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  const editer = (tf: TaskForce | null) => {
    setErreur("");
    setFiltrePtf("");
    setBrouillon(tf ? {
      id: tf.id, nom: tf.nom, thematique: tf.thematique, description: tf.description || "", ordre: tf.ordre, actif: tf.actif,
      ptf_ids: tf.membres.map((m) => m.id), chef_de_file_id: tf.membres.find((m) => m.chef_de_file)?.id ?? null,
    } : { ...VIDE, ordre: taskForces.length });
  };

  const basculerPtf = (id: number) => setBrouillon((b) => b && ({
    ...b,
    ptf_ids: b.ptf_ids.includes(id) ? b.ptf_ids.filter((x) => x !== id) : [...b.ptf_ids, id],
    chef_de_file_id: b.ptf_ids.includes(id) && b.chef_de_file_id === id ? null : b.chef_de_file_id,
  }));

  async function enregistrer() {
    if (!brouillon) return;
    if (brouillon.nom.trim().length < 3 || brouillon.thematique.trim().length < 2) {
      setErreur("Renseignez le nom (3 caractères minimum) et la thématique.");
      return;
    }
    setEnvoi(true);
    setErreur("");
    try {
      const { id, ...corps } = brouillon;
      const res = await fetchWithAuth(`${API_BASE}/api/v1/task-forces${id ? `/${id}` : ""}`, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(corps),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Enregistrement impossible.");
      setBrouillon(null);
      await charger();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(tf: TaskForce) {
    if (!confirm(`Supprimer la task force « ${tf.nom} » ?`)) return;
    await fetchWithAuth(`${API_BASE}/api/v1/task-forces/${tf.id}`, { method: "DELETE" });
    await charger();
  }

  const CHAMP = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm";
  const ptfsFiltres = ptfs.filter((p) => p.name.toLowerCase().includes(filtrePtf.toLowerCase()));

  return (
    <div className="p-6 font-poppins max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2a591d]/10 rounded-lg"><Users className="w-6 h-6 text-[#2a591d]" /></div>
          <h1 className="text-2xl font-bold text-gray-900">Task forces thématiques</h1>
        </div>
        {!brouillon && (
          <button onClick={() => editer(null)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold">
            <Plus className="w-4 h-4" /> Nouvelle task force
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Groupes de PTF travaillant sur une même thématique, affichés dans l&apos;annuaire des PTF et sur la fiche de chaque membre.
      </p>

      {brouillon && (
        <div className="bg-white rounded-xl border-2 border-[#E05017]/30 shadow-sm p-5 mb-8 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={brouillon.nom} onChange={(e) => setBrouillon({ ...brouillon, nom: e.target.value })} placeholder="Nom (ex. : Task force Genre) *" className={CHAMP} aria-label="Nom de la task force" />
            <input value={brouillon.thematique} onChange={(e) => setBrouillon({ ...brouillon, thematique: e.target.value })} placeholder="Thématique (ex. : Égalité femmes-hommes) *" className={CHAMP} aria-label="Thématique" />
          </div>
          <textarea value={brouillon.description} onChange={(e) => setBrouillon({ ...brouillon, description: e.target.value })} placeholder="Description, objectifs, mode de fonctionnement…" rows={3} className={CHAMP} aria-label="Description" />
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">Ordre
              <input type="number" min={0} value={brouillon.ordre} onChange={(e) => setBrouillon({ ...brouillon, ordre: Number(e.target.value) || 0 })} className="w-20 border border-gray-300 rounded-lg px-2 py-1" />
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={brouillon.actif} onChange={(e) => setBrouillon({ ...brouillon, actif: e.target.checked })} /> Affichée publiquement
            </label>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <p className="text-sm font-semibold text-gray-800">PTF membres ({brouillon.ptf_ids.length}) — <Crown className="inline w-3.5 h-3.5 text-amber-500" /> = chef de file</p>
              <input value={filtrePtf} onChange={(e) => setFiltrePtf(e.target.value)} placeholder="Filtrer les PTF…" className="border border-gray-300 rounded-lg px-2 py-1 text-sm" aria-label="Filtrer les PTF" />
            </div>
            <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
              {ptfsFiltres.map((p) => {
                const membre = brouillon.ptf_ids.includes(p.id);
                const chef = brouillon.chef_de_file_id === p.id;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                    <input type="checkbox" checked={membre} onChange={() => basculerPtf(p.id)} aria-label={`Membre : ${p.name}`} />
                    <span className="flex-1">{p.name} <span className="text-xs text-gray-400">{p.categorie || ""}</span></span>
                    {membre && (
                      <button type="button" onClick={() => setBrouillon({ ...brouillon, chef_de_file_id: chef ? null : p.id })}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${chef ? "bg-amber-100 text-amber-800" : "text-gray-500 hover:bg-gray-100"}`}>
                        <Crown className="w-3.5 h-3.5" /> {chef ? "Chef de file" : "Désigner chef de file"}
                      </button>
                    )}
                  </div>
                );
              })}
              {ptfsFiltres.length === 0 && <p className="px-3 py-4 text-sm text-gray-400">Aucun PTF.</p>}
            </div>
          </div>
          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
          <div className="flex gap-2">
            <button onClick={enregistrer} disabled={envoi} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold disabled:opacity-50">
              {envoi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Enregistrer
            </button>
            <button onClick={() => setBrouillon(null)} className="inline-flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4" /> Annuler
            </button>
          </div>
        </div>
      )}

      {chargement ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#E05017]" /></div>
      ) : taskForces.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune task force pour le moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {taskForces.map((tf) => (
            <div key={tf.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 ${tf.actif ? "" : "opacity-60"}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <span className="inline-block mb-1 px-2 py-0.5 text-xs font-bold bg-[#E05017]/10 text-[#E05017] rounded-full">{tf.thematique}</span>
                  <p className="font-bold text-gray-900">{tf.nom} {!tf.actif && <span className="text-xs font-normal text-gray-500">(masquée)</span>}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {tf.membres.length} membre(s){tf.membres.find((m) => m.chef_de_file) ? ` · chef de file : ${tf.membres.find((m) => m.chef_de_file)?.name}` : ""}
                  </p>
                </div>
                <button onClick={() => editer(tf)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg" title="Modifier"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => supprimer(tf)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
