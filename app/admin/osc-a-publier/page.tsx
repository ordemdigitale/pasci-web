"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { fetchWithAuth } from "@/lib/auth";
import {
  Building2,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Eye,
  UploadCloud,
  KeyRound,
  Copy,
  RefreshCw,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface OscEnAttente {
  id: number;
  name: string;
  sigle?: string | null;
  slug?: string | null;
  region_nom?: string | null;
  email?: string | null;
  is_visible?: boolean;
  created_at: string;
  crasc?: { name?: string | null } | null;
}

interface DemandeSansOsc {
  id: number;
  nom_organisation: string;
  sigle?: string | null;
  region: string;
  email: string;
  crasc_nom?: string | null;
  created_at: string;
}

interface Credentials {
  osc_id: number;
  osc_name: string;
  email: string;
  username: string;
  temp_password: string;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OscAPublierPage() {
  const [oscs, setOscs] = useState<OscEnAttente[]>([]);
  const [demandes, setDemandes] = useState<DemandeSansOsc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [oscRes, demandeRes] = await Promise.all([
        fetchWithAuth(`${API_BASE}/api/v1/crasc/osc/admin/en-attente`),
        fetchWithAuth(`${API_BASE}/api/v1/adhesion/admin/sans-osc`),
      ]);
      setOscs(oscRes.ok ? await oscRes.json() : []);
      setDemandes(demandeRes.ok ? await demandeRes.json() : []);
      if (!oscRes.ok && !demandeRes.ok) {
        setError("Impossible de charger la liste. Vérifie que tu es connecté en tant qu'administrateur.");
      }
      setSelected(new Set());
    } catch (e) {
      console.error(e);
      setError("Erreur réseau lors du chargement.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.size === oscs.length ? new Set() : new Set(oscs.map((o) => o.id))));
  };

  /** Publie les OSC déjà créées mais restées invisibles. */
  const publier = async (ids: number[] | "toutes") => {
    setBusy(ids === "toutes" ? "all" : `pub-${ids.join(",")}`);
    setError(null);
    setNotice(null);
    try {
      const url =
        ids === "toutes"
          ? `${API_BASE}/api/v1/crasc/osc/admin/publier-en-attente`
          : `${API_BASE}/api/v1/crasc/osc/admin/publier-en-attente?ids=${ids.join(",")}`;
      const res = await fetchWithAuth(url, { method: "PATCH" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(
          typeof body?.detail === "string" ? body.detail : `Échec de la publication (HTTP ${res.status}).`
        );
        return;
      }
      const data: { published: number } = await res.json();
      setNotice(
        `${data.published} OSC ${data.published > 1 ? "sont" : "est"} maintenant en ligne sur le site.`
      );
      await load();
    } catch (e) {
      console.error(e);
      setError("Erreur réseau lors de la publication.");
    } finally {
      setBusy(null);
    }
  };

  /** Recrée l'OSC + le compte des demandes approuvées restées sans OSC. */
  const provisionner = async (cibles: DemandeSansOsc[]) => {
    setBusy(cibles.length === demandes.length ? "all-demandes" : `prov-${cibles[0]?.id}`);
    setError(null);
    setNotice(null);
    const nouvelles: Credentials[] = [];
    const echecs: string[] = [];
    try {
      for (const demande of cibles) {
        const res = await fetchWithAuth(`${API_BASE}/api/v1/adhesion/${demande.id}/provisionner`, {
          method: "POST",
        });
        if (res.ok) {
          nouvelles.push(await res.json());
        } else {
          const body = await res.json().catch(() => null);
          echecs.push(
            `${demande.nom_organisation} — ${typeof body?.detail === "string" ? body.detail : `HTTP ${res.status}`}`
          );
        }
      }
      if (nouvelles.length) {
        setCredentials((prev) => [...prev, ...nouvelles]);
        setNotice(`${nouvelles.length} OSC créée${nouvelles.length > 1 ? "s" : ""} et mise${nouvelles.length > 1 ? "s" : ""} en ligne.`);
      }
      if (echecs.length) setError(`${echecs.length} échec(s) :\n${echecs.join("\n")}`);
      await load();
    } finally {
      setBusy(null);
    }
  };

  const copyCredentials = () => {
    const lignes = [
      "OSC\tEmail\tIdentifiant\tMot de passe",
      ...credentials.map((c) => `${c.osc_name}\t${c.email}\t${c.username}\t${c.temp_password}`),
    ];
    navigator.clipboard?.writeText(lignes.join("\n"));
    setNotice("Identifiants copiés dans le presse-papier.");
  };

  const total = oscs.length + demandes.length;

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-[#E05017]" /> OSC approuvées à mettre en ligne
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {loading
                ? "Chargement…"
                : total === 0
                ? "Toutes les OSC approuvées sont en ligne."
                : `${total} OSC approuvée${total > 1 ? "s" : ""} n'apparaissent pas encore sur le site.`}
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Rafraîchir
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 whitespace-pre-line">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {notice && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* ── Section 1 : OSC créées mais invisibles ───────────────────── */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    OSC créées mais pas encore publiées
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {oscs.length}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    La fiche existe déjà en base. Les publier les fait apparaître immédiatement dans
                    l&apos;annuaire public.
                  </p>
                </div>
                {oscs.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => publier([...selected])}
                      disabled={selected.size === 0 || busy !== null}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 disabled:opacity-40"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Publier la sélection ({selected.size})
                    </button>
                    <button
                      onClick={() => publier("toutes")}
                      disabled={busy !== null}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-40"
                    >
                      {busy === "all" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                      Tout publier ({oscs.length})
                    </button>
                  </div>
                )}
              </div>

              {oscs.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                  Aucune OSC en attente de publication.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-3 py-2 w-10">
                          <input
                            type="checkbox"
                            checked={selected.size === oscs.length && oscs.length > 0}
                            onChange={toggleAll}
                            aria-label="Tout sélectionner"
                          />
                        </th>
                        <th className="px-3 py-2">OSC</th>
                        <th className="px-3 py-2">Région</th>
                        <th className="px-3 py-2">CRASC</th>
                        <th className="px-3 py-2">Créée le</th>
                        <th className="px-3 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {oscs.map((osc) => (
                        <tr key={osc.id} className={selected.has(osc.id) ? "bg-orange-50/50" : ""}>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selected.has(osc.id)}
                              onChange={() => toggle(osc.id)}
                              aria-label={`Sélectionner ${osc.name}`}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <span className="font-semibold text-gray-900">{osc.name}</span>
                            {osc.sigle && <span className="text-gray-400"> ({osc.sigle})</span>}
                            {osc.is_visible === false && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                masquée
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-600">{osc.region_nom || "—"}</td>
                          <td className="px-3 py-2 text-gray-600">{osc.crasc?.name || "—"}</td>
                          <td className="px-3 py-2 text-gray-500">{formatDate(osc.created_at)}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-2">
                              {osc.slug && (
                                <Link
                                  href={`/admin/gestion-des-crasc/osc/${osc.slug}`}
                                  target="_blank"
                                  className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Voir
                                </Link>
                              )}
                              <button
                                onClick={() => publier([osc.id])}
                                disabled={busy !== null}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-40"
                              >
                                {busy === `pub-${osc.id}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                )}
                                Mettre en ligne
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* ── Section 2 : demandes approuvées sans OSC ─────────────────── */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Demandes approuvées sans OSC
                    <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      {demandes.length}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    La demande a été approuvée mais la fiche OSC et le compte n&apos;ont jamais été créés.
                    Les provisionner crée la fiche, le compte utilisateur et publie l&apos;OSC.
                  </p>
                </div>
                {demandes.length > 0 && (
                  <button
                    onClick={() => provisionner(demandes)}
                    disabled={busy !== null}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-[#E05017] rounded-lg hover:bg-[#c4460f] disabled:opacity-40"
                  >
                    {busy === "all-demandes" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    Tout créer ({demandes.length})
                  </button>
                )}
              </div>

              {demandes.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                  Aucune demande approuvée sans OSC.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-3 py-2">Organisation</th>
                        <th className="px-3 py-2">Région</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Demande du</th>
                        <th className="px-3 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {demandes.map((demande) => (
                        <tr key={demande.id}>
                          <td className="px-3 py-2">
                            <span className="font-semibold text-gray-900">{demande.nom_organisation}</span>
                            {demande.sigle && <span className="text-gray-400"> ({demande.sigle})</span>}
                          </td>
                          <td className="px-3 py-2 text-gray-600">{demande.region}</td>
                          <td className="px-3 py-2 text-gray-600">{demande.email}</td>
                          <td className="px-3 py-2 text-gray-500">{formatDate(demande.created_at)}</td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href="/admin/demandes-adhesion"
                                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200"
                              >
                                <Eye className="w-3.5 h-3.5" /> Demande
                              </Link>
                              <button
                                onClick={() => provisionner([demande])}
                                disabled={busy !== null}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-white bg-[#E05017] rounded-lg hover:bg-[#c4460f] disabled:opacity-40"
                              >
                                {busy === `prov-${demande.id}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <KeyRound className="w-3.5 h-3.5" />
                                )}
                                Créer l&apos;OSC
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* ── Identifiants générés ─────────────────────────────────────── */}
            {credentials.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      Identifiants générés ({credentials.length})
                    </h2>
                    <p className="text-xs text-red-600 mt-0.5 font-medium">
                      À copier maintenant : les mots de passe temporaires ne sont plus consultables
                      après avoir quitté cette page.
                    </p>
                  </div>
                  <button
                    onClick={copyCredentials}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200"
                  >
                    <Copy className="w-4 h-4" /> Tout copier
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <table className="w-full text-sm">
                    <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-800">
                      <tr>
                        <th className="px-3 py-2">OSC</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Identifiant</th>
                        <th className="px-3 py-2">Mot de passe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100">
                      {credentials.map((c) => (
                        <tr key={`${c.osc_id}-${c.username}`}>
                          <td className="px-3 py-2 font-semibold text-gray-900">{c.osc_name}</td>
                          <td className="px-3 py-2 text-gray-600">{c.email}</td>
                          <td className="px-3 py-2 font-mono text-xs text-gray-700">{c.username}</td>
                          <td className="px-3 py-2 font-mono text-xs text-gray-700">{c.temp_password}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
