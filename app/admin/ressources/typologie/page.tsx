"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Edit3, Eye, EyeOff, Folder, Loader2, Plus, Tags, Trash2, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import {
  TYPOLOGIE_URL,
  useTypologieRessources,
  type IRessourceCategorie,
  type IRessourceType,
} from "@/lib/fetch-ressources-typologie";

async function erreurDe(res: Response, defaut: string) {
  const data = await res.json().catch(() => ({}));
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail[0]?.msg) return data.detail[0].msg as string;
  return defaut;
}

/**
 * Typologie des ressources : types (livres, périodiques, documents officiels…)
 * et catégories détaillées (romans, BD, lois, dictionnaires…), rattachées à
 * un type ou communes à tous.
 */
export default function TypologieRessourcesPage() {
  const { types, categories, chargement, recharger } = useTypologieRessources(true);
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  // Formulaires
  const [nouveauType, setNouveauType] = useState({ nom: "", description: "" });
  const [typeEdite, setTypeEdite] = useState<{ id: number; nom: string; description: string } | null>(null);
  const [nouvelleCat, setNouvelleCat] = useState({ nom: "", type_slug: "" });
  const [catEditee, setCatEditee] = useState<{ id: number; nom: string; type_slug: string } | null>(null);
  const [filtreType, setFiltreType] = useState("");

  async function appel(url: string, method: string, body?: unknown, defaut = "Opération impossible.") {
    setErreur("");
    setEnvoi(true);
    try {
      const res = await fetchWithAuth(url, { method, body: body ? JSON.stringify(body) : undefined });
      if (!res.ok) throw new Error(await erreurDe(res, defaut));
      await recharger();
      return true;
    } catch (err) {
      setErreur(err instanceof Error ? err.message : defaut);
      return false;
    } finally {
      setEnvoi(false);
    }
  }

  async function ajouterType(e: React.FormEvent) {
    e.preventDefault();
    if (!nouveauType.nom.trim()) return;
    const ok = await appel(`${TYPOLOGIE_URL}/types`, "POST", {
      nom: nouveauType.nom.trim(),
      description: nouveauType.description.trim() || null,
    }, "Type non créé.");
    if (ok) setNouveauType({ nom: "", description: "" });
  }

  async function enregistrerType() {
    if (!typeEdite) return;
    const ok = await appel(`${TYPOLOGIE_URL}/types/${typeEdite.id}`, "PATCH", {
      nom: typeEdite.nom.trim(),
      description: typeEdite.description.trim() || null,
    }, "Type non modifié.");
    if (ok) setTypeEdite(null);
  }

  const basculerType = (t: IRessourceType) =>
    appel(`${TYPOLOGIE_URL}/types/${t.id}`, "PATCH", { nom: t.nom, description: t.description, actif: !t.actif });

  const supprimerType = (t: IRessourceType) =>
    confirm(`Supprimer le type « ${t.nom} » ?`) && appel(`${TYPOLOGIE_URL}/types/${t.id}`, "DELETE");

  async function ajouterCategorie(e: React.FormEvent) {
    e.preventDefault();
    if (!nouvelleCat.nom.trim()) return;
    const ok = await appel(`${TYPOLOGIE_URL}/categories`, "POST", {
      nom: nouvelleCat.nom.trim(),
      type_slug: nouvelleCat.type_slug || null,
    }, "Catégorie non créée.");
    if (ok) setNouvelleCat((c) => ({ ...c, nom: "" }));
  }

  async function enregistrerCategorie() {
    if (!catEditee) return;
    const ok = await appel(`${TYPOLOGIE_URL}/categories/${catEditee.id}`, "PATCH", {
      nom: catEditee.nom.trim(),
      type_slug: catEditee.type_slug || null,
    }, "Catégorie non modifiée.");
    if (ok) setCatEditee(null);
  }

  const basculerCategorie = (c: IRessourceCategorie) =>
    appel(`${TYPOLOGIE_URL}/categories/${c.id}`, "PATCH", { nom: c.nom, type_slug: c.type_slug, actif: !c.actif });

  const supprimerCategorie = (c: IRessourceCategorie) =>
    confirm(`Supprimer la catégorie « ${c.nom} » ?`) && appel(`${TYPOLOGIE_URL}/categories/${c.id}`, "DELETE");

  const nomType = (slug: string | null) => (slug ? types.find((t) => t.slug === slug)?.nom || slug : "Tous les types");

  // Catégories regroupées par type (communes d'abord)
  const groupes: { slug: string | null; nom: string; cats: IRessourceCategorie[] }[] = [
    { slug: null, nom: "Communes à tous les types", cats: categories.filter((c) => c.type_slug === null) },
    ...types.map((t) => ({ slug: t.slug, nom: t.nom, cats: categories.filter((c) => c.type_slug === t.slug) })),
  ].filter((g) => g.cats.length > 0 && (!filtreType || g.slug === filtreType || (filtreType === "__communes" && g.slug === null)));

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/ressources" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour aux ressources
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Types et catégories de ressources</h1>
        <p className="text-gray-600 mb-6">
          Les types et catégories actifs sont proposés dans le formulaire des ressources et dans les filtres du site et
          de l&apos;application. Désactivez plutôt que de supprimer un élément déjà utilisé.
        </p>

        {erreur && (
          <div className="mb-4 flex items-center justify-between gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            <span>{erreur}</span>
            <button onClick={() => setErreur("")} aria-label="Fermer"><X className="w-4 h-4" /></button>
          </div>
        )}

        {chargement ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#E05017]" /></div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* ── Types ── */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Folder className="w-5 h-5 text-[#E05017]" /> Types ({types.length})
              </h2>
              <ul className="divide-y divide-gray-100 mb-4">
                {types.map((t) =>
                  typeEdite?.id === t.id ? (
                    <li key={t.id} className="py-3 space-y-2">
                      <input
                        value={typeEdite.nom}
                        onChange={(e) => setTypeEdite({ ...typeEdite, nom: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                        aria-label="Nom du type"
                      />
                      <input
                        value={typeEdite.description}
                        onChange={(e) => setTypeEdite({ ...typeEdite, description: e.target.value })}
                        placeholder="Description (optionnelle)"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={enregistrerType} disabled={envoi} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#E05017] text-white rounded-lg text-xs font-bold disabled:opacity-50">
                          <Check className="w-3.5 h-3.5" /> Enregistrer
                        </button>
                        <button onClick={() => setTypeEdite(null)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                      </div>
                    </li>
                  ) : (
                    <li key={t.id} className={`py-3 flex items-start gap-2 ${t.actif ? "" : "opacity-50"}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {t.nom} {!t.actif && <span className="text-xs font-normal text-gray-500">(désactivé)</span>}
                        </p>
                        {t.description && <p className="text-xs text-gray-500">{t.description}</p>}
                        <p className="text-[11px] text-gray-400">
                          {t.nb_documents} ressource(s) · {categories.filter((c) => c.type_slug === t.slug).length} catégorie(s) propre(s)
                        </p>
                      </div>
                      <button onClick={() => setTypeEdite({ id: t.id, nom: t.nom, description: t.description || "" })} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Renommer">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => basculerType(t)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title={t.actif ? "Désactiver" : "Réactiver"}>
                        {t.actif ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => supprimerType(t)} disabled={t.nb_documents > 0} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed" title={t.nb_documents > 0 ? "Utilisé par des ressources : désactivez-le" : "Supprimer"}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ),
                )}
              </ul>
              <form onSubmit={ajouterType} className="space-y-2 bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700">Nouveau type</p>
                <input
                  value={nouveauType.nom}
                  onChange={(e) => setNouveauType({ ...nouveauType, nom: e.target.value })}
                  placeholder="Ex. : Thèses et mémoires"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  aria-label="Nom du nouveau type"
                />
                <input
                  value={nouveauType.description}
                  onChange={(e) => setNouveauType({ ...nouveauType, description: e.target.value })}
                  placeholder="Description (optionnelle)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button type="submit" disabled={envoi || !nouveauType.nom.trim()} className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                  <Plus className="w-4 h-4" /> Ajouter le type
                </button>
              </form>
            </section>

            {/* ── Catégories ── */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Tags className="w-5 h-5 text-[#E05017]" /> Catégories ({categories.length})
                </h2>
                <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1 text-sm" aria-label="Filtrer par type">
                  <option value="">Tous les types</option>
                  <option value="__communes">Communes</option>
                  {types.map((t) => <option key={t.slug} value={t.slug}>{t.nom}</option>)}
                </select>
              </div>

              <form onSubmit={ajouterCategorie} className="flex flex-wrap gap-2 bg-gray-50 rounded-lg p-3 mb-4">
                <input
                  value={nouvelleCat.nom}
                  onChange={(e) => setNouvelleCat({ ...nouvelleCat, nom: e.target.value })}
                  placeholder="Nouvelle catégorie (ex. : Roman)"
                  className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  aria-label="Nom de la nouvelle catégorie"
                />
                <select
                  value={nouvelleCat.type_slug}
                  onChange={(e) => setNouvelleCat({ ...nouvelleCat, type_slug: e.target.value })}
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
                  aria-label="Type de la nouvelle catégorie"
                >
                  <option value="">Tous les types</option>
                  {types.map((t) => <option key={t.slug} value={t.slug}>{t.nom}</option>)}
                </select>
                <button type="submit" disabled={envoi || !nouvelleCat.nom.trim()} className="inline-flex items-center gap-1 px-3 py-2 bg-[#E05017] text-white rounded-lg text-sm font-bold disabled:opacity-50">
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </form>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {groupes.map((g) => (
                  <div key={g.slug ?? "communes"}>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">{g.nom}</h3>
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                      {g.cats.map((c) =>
                        catEditee?.id === c.id ? (
                          <li key={c.id} className="p-2 flex flex-wrap gap-2 items-center">
                            <input
                              value={catEditee.nom}
                              onChange={(e) => setCatEditee({ ...catEditee, nom: e.target.value })}
                              className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-2 py-1 text-sm"
                              aria-label="Nom de la catégorie"
                            />
                            <select
                              value={catEditee.type_slug}
                              onChange={(e) => setCatEditee({ ...catEditee, type_slug: e.target.value })}
                              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                              aria-label="Type de la catégorie"
                            >
                              <option value="">Tous les types</option>
                              {types.map((t) => <option key={t.slug} value={t.slug}>{t.nom}</option>)}
                            </select>
                            <button onClick={enregistrerCategorie} disabled={envoi} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Enregistrer"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setCatEditee(null)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Annuler"><X className="w-4 h-4" /></button>
                          </li>
                        ) : (
                          <li key={c.id} className={`px-3 py-1.5 flex items-center gap-2 ${c.actif ? "" : "opacity-50"}`}>
                            <span className="flex-1 text-sm text-gray-800">
                              {c.nom} {!c.actif && <span className="text-xs text-gray-500">(désactivée)</span>}
                            </span>
                            <span className="text-[11px] text-gray-400" title={nomType(c.type_slug)}>{c.nb_documents} ress.</span>
                            <button onClick={() => setCatEditee({ id: c.id, nom: c.nom, type_slug: c.type_slug || "" })} className="p-1 text-gray-500 hover:bg-gray-100 rounded" title="Modifier"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => basculerCategorie(c)} className="p-1 text-gray-500 hover:bg-gray-100 rounded" title={c.actif ? "Désactiver" : "Réactiver"}>
                              {c.actif ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => supprimerCategorie(c)} disabled={c.nb_documents > 0} className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed" title={c.nb_documents > 0 ? "Utilisée par des ressources : désactivez-la" : "Supprimer"}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
