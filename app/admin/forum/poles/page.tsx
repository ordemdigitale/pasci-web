"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { fetchWithAuth } from "@/lib/auth";
import {
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Loader2,
  Pin,
  BarChart3,
  GitMerge,
  Link2,
  X,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RattrapageResultat {
  simulation: boolean;
  oscs_examinees: number;
  oscs_rattachees: number;
  poles: number;
  types: number;
  regions: number;
  details: { osc_id: number; osc: string; pole?: string; type?: string; region?: string }[];
}
import { useAuth } from "@/contexts/AuthContext";

interface IPoleConcertation {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  image_path: string | null;
  image_url?: string | null;
  objectifs: string | null;
  is_active: boolean;
  sujets_count: number;
  created_at: string;
}

export default function AdminForumPolesPage() {
  const { user } = useAuth();
  const isCrascAdmin = !!user?.is_staff && !user?.is_superuser && !!user?.crasc_id;
  const [poles, setPoles] = useState<IPoleConcertation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const isSuperuser = !!user?.is_superuser;

  // Fusion de pôles (superadmin)
  const [fusionSource, setFusionSource] = useState<IPoleConcertation | null>(null);
  const [fusionCible, setFusionCible] = useState("");
  const [fusionNom, setFusionNom] = useState("");
  const [fusionEnCours, setFusionEnCours] = useState(false);

  // Rattachement des OSC existantes à leur pôle / type / région (superadmin)
  const [rattrapage, setRattrapage] = useState<RattrapageResultat | null>(null);
  const [rattrapageEnCours, setRattrapageEnCours] = useState(false);

  useEffect(() => {
    fetchPoles();
  }, []);

  async function handleFusion() {
    if (!fusionSource || !fusionCible) return;
    const cible = poles.find((p) => p.slug === fusionCible);
    const nomFinal = fusionNom.trim() || cible?.name;
    if (
      !confirm(
        `Fusionner « ${fusionSource.name} » dans « ${cible?.name} »${nomFinal !== cible?.name ? ` (renommé « ${nomFinal} »)` : ""} ?\n\n` +
          "Les OSC membres, discussions et sondages seront déplacés, et le pôle source sera désactivé."
      )
    )
      return;
    setFusionEnCours(true);
    try {
      const res = await fetchWithAuth(`${API_ENDPOINTS.forum.poleBySlug(fusionSource.slug)}/fusionner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cible_slug: fusionCible, nouveau_nom: fusionNom.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.detail === "string" ? data.detail : "La fusion a échoué.");
      }
      setFusionSource(null);
      setFusionCible("");
      setFusionNom("");
      await fetchPoles();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "La fusion a échoué.");
    } finally {
      setFusionEnCours(false);
    }
  }

  async function lancerRattrapage(simulation: boolean) {
    if (!simulation && !confirm("Enregistrer ces rattachements en base ?")) return;
    setRattrapageEnCours(true);
    try {
      const res = await fetchWithAuth(
        `${API_BASE}/api/v1/adhesion/admin/rattrapage-rattachements?simulation=${simulation}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.detail === "string" ? data.detail : `Erreur HTTP ${res.status}`);
      }
      setRattrapage(await res.json());
      if (!simulation) await fetchPoles();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Le rattachement a échoué.");
    } finally {
      setRattrapageEnCours(false);
    }
  }

  async function fetchPoles() {
    setLoading(true);
    try {
      // Fetch all poles including inactive (admin view)
      const res = await fetchWithAuth(API_ENDPOINTS.forum.poles + "?limit=100&include_inactive=true");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(pole: IPoleConcertation) {
    setTogglingSlug(pole.slug);
    try {
      const formData = new FormData();
      formData.append("is_active", String(!pole.is_active));
      const res = await fetchWithAuth(API_ENDPOINTS.forum.poleBySlug(pole.slug), {
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Erreur lors de la mise à jour.");
      }
      const updated: IPoleConcertation = await res.json();
      setPoles((prev) =>
        prev.map((p) => (p.slug === pole.slug ? { ...p, is_active: updated.is_active } : p))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur lors de la mise à jour.");
    } finally {
      setTogglingSlug(null);
    }
  }

  async function handleDelete(pole: IPoleConcertation) {
    if (!confirm(`Supprimer le pôle "${pole.name}" ? Tous ses sujets seront supprimés.`)) return;
    setDeletingSlug(pole.slug);
    try {
      const res = await fetchWithAuth(API_ENDPOINTS.forum.poleBySlug(pole.slug), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setPoles((prev) => prev.filter((p) => p.slug !== pole.slug));
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingSlug(null);
    }
  }

  const filtered = poles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              Pôles de concertation
            </h1>
            <p className="text-gray-600">Gérez les pôles du forum collaboratif</p>
          </div>
          {!isCrascAdmin && (
            <Link href="/admin/forum/poles/ajouter">
              <button className="flex items-center gap-2 px-5 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold">
                <Plus className="w-5 h-5" />
                Nouveau pôle
              </button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total pôles</p>
            <p className="text-3xl font-bold text-gray-900">{poles.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Pôles actifs</p>
            <p className="text-3xl font-bold text-green-600">
              {poles.filter((p) => p.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total sujets</p>
            <p className="text-3xl font-bold text-[#E05017]">
              {poles.reduce((sum, p) => sum + p.sujets_count, 0)}
            </p>
          </div>
        </div>

        {/* Rattachement des OSC existantes (superadmin) */}
        {isSuperuser && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[#E05017]" /> Rattacher les OSC à leur pôle
                </h2>
                <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                  Les OSC sans pôle sont inscrites dans le pôle de leur 1er domaine prioritaire ; leur type
                  et leur région sont complétés s&apos;ils manquent. Rien n&apos;est remplacé. Commencez par une simulation.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => lancerRattrapage(true)}
                  disabled={rattrapageEnCours}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  {rattrapageEnCours ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simuler"}
                </button>
                <button
                  onClick={() => lancerRattrapage(false)}
                  disabled={rattrapageEnCours || !rattrapage?.simulation || rattrapage.oscs_rattachees === 0}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#E05017] rounded-lg hover:bg-[#c44315] disabled:opacity-40"
                  title="Lancez d'abord une simulation"
                >
                  Appliquer
                </button>
              </div>
            </div>
            {rattrapage && (
              <div className="mt-4 text-sm">
                <p className={rattrapage.simulation ? "text-amber-700" : "text-green-700"}>
                  {rattrapage.simulation ? "Simulation : " : "Enregistré : "}
                  {rattrapage.oscs_rattachees} OSC sur {rattrapage.oscs_examinees} — {rattrapage.poles} pôle(s),{" "}
                  {rattrapage.types} type(s), {rattrapage.regions} région(s).
                </p>
                {rattrapage.details.length > 0 && (
                  <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-gray-100">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                          <th className="px-3 py-1.5">OSC</th>
                          <th className="px-3 py-1.5">Pôle</th>
                          <th className="px-3 py-1.5">Type</th>
                          <th className="px-3 py-1.5">Région</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {rattrapage.details.map((d) => (
                          <tr key={d.osc_id}>
                            <td className="px-3 py-1.5 font-medium text-gray-800">{d.osc}</td>
                            <td className="px-3 py-1.5 text-gray-600">{d.pole || "—"}</td>
                            <td className="px-3 py-1.5 text-gray-600">{d.type || "—"}</td>
                            <td className="px-3 py-1.5 text-gray-600">{d.region || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Fusion de pôles (superadmin) */}
        {isSuperuser && fusionSource && (
          <div className="bg-orange-50 rounded-xl border border-orange-200 p-5 mb-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-[#E05017]" /> Fusionner « {fusionSource.name} »
              </h2>
              <button onClick={() => setFusionSource(null)} className="text-gray-400 hover:text-gray-600" aria-label="Annuler">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <select
                value={fusionCible}
                onChange={(e) => setFusionCible(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Dans le pôle…</option>
                {poles
                  .filter((p) => p.slug !== fusionSource.slug && p.is_active)
                  .map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
              </select>
              <input
                value={fusionNom}
                onChange={(e) => setFusionNom(e.target.value)}
                placeholder="Nouveau nom (facultatif)"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              />
              <button
                onClick={handleFusion}
                disabled={!fusionCible || fusionEnCours}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#E05017] rounded-lg hover:bg-[#c44315] disabled:opacity-40"
              >
                {fusionEnCours ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitMerge className="w-4 h-4" />}
                Fusionner
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Les OSC membres, discussions et sondages passent dans le pôle choisi ; les domaines prioritaires des OSC
              sont mis à jour ; « {fusionSource.name} » est désactivé (conservé pour l&apos;historique).
            </p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un pôle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017] text-sm"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((pole) => (
              <div
                key={pole.id}
                className={`bg-white rounded-xl border shadow-sm p-5 flex items-center gap-4 ${
                  pole.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
                }`}
              >
                {/* Image / Icon */}
                <div className="flex-shrink-0">
                  {pole.image_url ? (
                    <img
                      src={pole.image_url}
                      alt={pole.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#E05017]/10 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-[#E05017]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{pole.name}</h3>
                    {!pole.is_active && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        Inactif
                      </span>
                    )}
                  </div>
                  {pole.category && (
                    <span className="inline-block text-xs px-2 py-0.5 bg-[#E05017]/10 text-[#E05017] rounded-md font-medium mb-1">
                      {pole.category}
                    </span>
                  )}
                  {pole.description && (
                    <p className="text-sm text-gray-500 truncate">{pole.description}</p>
                  )}
                </div>

                {/* Sujets count */}
                <div className="flex-shrink-0 text-center">
                  <p className="text-2xl font-bold text-gray-900">{pole.sujets_count}</p>
                  <p className="text-xs text-gray-400">sujet{pole.sujets_count !== 1 ? "s" : ""}</p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Link href={`/admin/forum/poles/${pole.slug}/sujets`}>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les sujets"
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                  </Link>
                  {!isCrascAdmin && (
                    <>
                      <Link href={`/admin/forum/poles/${pole.slug}/sondages`}>
                        <button
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Gérer les sondages"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/admin/forum/poles/${pole.slug}/modifier`}>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleToggleActive(pole)}
                        disabled={togglingSlug === pole.slug}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        title={pole.is_active ? "Désactiver" : "Activer"}
                      >
                        {togglingSlug === pole.slug ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : pole.is_active ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      {isSuperuser && pole.is_active && (
                        <button
                          onClick={() => {
                            setFusionSource(pole);
                            setFusionCible("");
                            setFusionNom("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Fusionner dans un autre pôle"
                        >
                          <GitMerge className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(pole)}
                        disabled={deletingSlug === pole.slug}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingSlug === pole.slug ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucun pôle trouvé.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
