"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Edit3, Eye, EyeOff, Handshake, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const URL_API = `${API_BASE}/api/v1/partenaires-accueil`;

interface Partenaire {
  id: number;
  nom: string;
  logo_url?: string | null;
  site_web?: string | null;
  ordre: number;
  actif: boolean;
}

async function erreurDe(res: Response, defaut: string) {
  const data = await res.json().catch(() => ({}));
  return typeof data.detail === "string" ? data.detail : defaut;
}

/** Section « Nos partenaires » de l'accueil : logos, liens, ordre et affichage. */
export default function PartenairesAccueilPage() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState<number | "nouveau" | null>(null);
  const [erreur, setErreur] = useState("");
  const [nouveau, setNouveau] = useState<{ nom: string; site_web: string; logo: File | null }>({ nom: "", site_web: "", logo: null });
  const [edition, setEdition] = useState<{ id: number; nom: string; site_web: string; ordre: number } | null>(null);
  const [cleLogo, setCleLogo] = useState(0);

  const charger = useCallback(async () => {
    const res = await fetchWithAuth(`${URL_API}?tous=true`);
    if (res.ok) setPartenaires(await res.json());
    setChargement(false);
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function envoyer(id: number | "nouveau", url: string, method: string, fd: FormData, defaut: string) {
    setEnvoi(id);
    setErreur("");
    try {
      const res = await fetchWithAuth(url, { method, body: fd });
      if (!res.ok) throw new Error(await erreurDe(res, defaut));
      await charger();
      return true;
    } catch (err) {
      setErreur(err instanceof Error ? err.message : defaut);
      return false;
    } finally {
      setEnvoi(null);
    }
  }

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    if (!nouveau.nom.trim()) return;
    const fd = new FormData();
    fd.append("nom", nouveau.nom.trim());
    if (nouveau.site_web.trim()) fd.append("site_web", nouveau.site_web.trim());
    if (nouveau.logo) fd.append("logo", nouveau.logo);
    if (await envoyer("nouveau", URL_API, "POST", fd, "Ajout impossible.")) {
      setNouveau({ nom: "", site_web: "", logo: null });
      setCleLogo((k) => k + 1);
    }
  }

  const champ = (p: Partenaire, valeurs: Record<string, string | Blob>) => {
    const fd = new FormData();
    Object.entries(valeurs).forEach(([k, v]) => fd.append(k, v));
    return envoyer(p.id, `${URL_API}/${p.id}`, "PATCH", fd, "Modification impossible.");
  };

  async function enregistrerEdition() {
    if (!edition) return;
    const p = partenaires.find((x) => x.id === edition.id);
    if (p && (await champ(p, { nom: edition.nom, site_web: edition.site_web, ordre: String(edition.ordre) }))) setEdition(null);
  }

  async function supprimer(p: Partenaire) {
    if (!confirm(`Retirer « ${p.nom} » des partenaires ?`)) return;
    setEnvoi(p.id);
    const res = await fetchWithAuth(`${URL_API}/${p.id}`, { method: "DELETE" });
    if (!res.ok) setErreur(await erreurDe(res, "Suppression impossible."));
    await charger();
    setEnvoi(null);
  }

  return (
    <div className="p-6 font-poppins max-w-5xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#E05017]/10 rounded-lg"><Handshake className="w-6 h-6 text-[#E05017]" /></div>
        <h1 className="text-2xl font-bold text-gray-900">Partenaires de l&apos;accueil</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Logos de la section « Nos partenaires » de la page d&apos;accueil (site et application). Logo : JPG, PNG ou WebP, 5 Mo
        maximum, fond transparent ou blanc de préférence.
      </p>

      {erreur && (
        <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {erreur}
          <button onClick={() => setErreur("")} aria-label="Fermer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {chargement ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#E05017]" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {partenaires.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 ${p.actif ? "" : "opacity-60"}`}>
              <div className="h-24 flex items-center justify-center bg-gray-50 rounded-lg mb-3">
                {p.logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.logo_url} alt={p.nom} className="max-h-20 max-w-[80%] object-contain" />
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">Logo à téléverser</span>
                )}
              </div>
              {edition?.id === p.id ? (
                <div className="space-y-2">
                  <input value={edition.nom} onChange={(e) => setEdition({ ...edition, nom: e.target.value })} className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm" aria-label="Nom" />
                  <input value={edition.site_web} onChange={(e) => setEdition({ ...edition, site_web: e.target.value })} placeholder="https://…" className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm" aria-label="Site web" />
                  <input type="number" min={0} value={edition.ordre} onChange={(e) => setEdition({ ...edition, ordre: Number(e.target.value) || 0 })} className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-sm" aria-label="Ordre" />
                  <div className="flex gap-2">
                    <button onClick={enregistrerEdition} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E05017] text-white rounded-lg text-xs font-bold"><Check className="w-3.5 h-3.5" /> Enregistrer</button>
                    <button onClick={() => setEdition(null)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-gray-900 text-sm">{p.nom} <span className="text-xs text-gray-400 font-normal">#{p.ordre}</span></p>
                  <p className="text-xs text-gray-500 truncate">{p.site_web || "Pas de site web"}</p>
                  <div className="flex items-center gap-1 mt-3">
                    <label className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer" title="Changer le logo">
                      {envoi === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" aria-label={`Logo de ${p.nom}`}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) champ(p, { logo: f }); e.target.value = ""; }} />
                    </label>
                    <button onClick={() => setEdition({ id: p.id, nom: p.nom, site_web: p.site_web || "", ordre: p.ordre })} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg" title="Modifier"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => champ(p, { actif: String(!p.actif) })} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg" title={p.actif ? "Masquer" : "Afficher"}>
                      {p.actif ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => supprimer(p)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg ml-auto" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={ajouter} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3 max-w-xl">
        <h2 className="font-bold text-gray-900">Ajouter un partenaire</h2>
        <input value={nouveau.nom} onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })} placeholder="Nom du partenaire *" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label="Nom du nouveau partenaire" />
        <input value={nouveau.site_web} onChange={(e) => setNouveau({ ...nouveau, site_web: e.target.value })} placeholder="Site web (facultatif)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label="Site web du nouveau partenaire" />
        <input key={cleLogo} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setNouveau({ ...nouveau, logo: e.target.files?.[0] || null })} className="block text-sm" aria-label="Logo du nouveau partenaire" />
        <button type="submit" disabled={envoi === "nouveau" || !nouveau.nom.trim()} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold disabled:opacity-50">
          {envoi === "nouveau" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Ajouter
        </button>
      </form>
    </div>
  );
}
