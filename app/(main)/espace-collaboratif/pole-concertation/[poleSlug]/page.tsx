"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { IPoleConcertation, IForumSujet, IForumSondage } from "@/types/api.types";
import { getToken, fetchWithAuth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  BarChart3,
  MessageSquare,
  Eye,
  Pin,
  Plus,
  X,
  Loader2,
  Lock,
  Target,
  Users,
  MapPin,
  Star,
  Briefcase,
  CalendarDays,
  Vote,
} from "lucide-react";

type AgendaStatus = "realise" | "en_cours" | "non_realise";
type AgendaItem = {
  date: string;
  titre: string;
  description: string;
  statut?: AgendaStatus;
};

const AGENDA_STATUS_META: Record<AgendaStatus, { label: string; className: string }> = {
  realise: { label: "Réalisé", className: "bg-green-100 text-green-700" },
  en_cours: { label: "En cours", className: "bg-blue-100 text-blue-700" },
  non_realise: { label: "Non réalisé", className: "bg-red-100 text-red-700" },
};

function parseJsonList(raw?: string | null): string[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string" && item.trim()) : [];
  } catch {
    return [];
  }
}

function parseAgenda(raw?: string | null): AgendaItem[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        date: typeof item.date === "string" ? item.date : "",
        titre: typeof item.titre === "string" ? item.titre : "",
        description: typeof item.description === "string" ? item.description : "",
        statut: ["realise", "en_cours", "non_realise"].includes(item.statut) ? item.statut : "en_cours",
      }))
      .filter((item) => item.date || item.titre || item.description);
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PagePoleForum() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const poleSlug = params.poleSlug as string;
  const { user } = useAuth();

  const [pole, setPole] = useState<IPoleConcertation | null>(null);
  const [sujets, setSujets] = useState<IForumSujet[]>([]);
  const [sondages, setSondages] = useState<IForumSondage[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [votingId, setVotingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [voteError, setVoteError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [oscPoleIds, setOscPoleIds] = useState<number[] | null>(null);

  const isOscUser = !!user?.osc_id;

  useEffect(() => {
    setToken(getToken());
  }, []);

  useEffect(() => {
    if (!isOscUser) return;
    fetchWithAuth(`${API_BASE}/api/v1/crasc/osc/me`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && Array.isArray(data.poles)) {
          setOscPoleIds(data.poles.map((p: { id: number }) => p.id));
        } else {
          setOscPoleIds([]);
        }
      })
      .catch(() => setOscPoleIds([]));
  }, [isOscUser]);

  useEffect(() => {
    const authToken = getToken();
    Promise.all([
      fetch(API_ENDPOINTS.forum.poleBySlug(poleSlug)).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(API_ENDPOINTS.forum.sujets(poleSlug)).then((r) => {
        if (!r.ok) return [];
        return r.json();
      }),
      fetch(API_ENDPOINTS.forum.sondages(poleSlug), {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      }).then((r) => {
        if (!r.ok) return [];
        return r.json();
      }),
    ])
      .then(([poleData, sujetsData, sondagesData]) => {
        // Vérifier que poleData est bien un objet avec un id (pas une erreur API)
        if (poleData && typeof poleData === "object" && poleData.id) {
          setPole(poleData);
        }
        setSujets(Array.isArray(sujetsData) ? sujetsData : []);
        const parsedSondages = Array.isArray(sondagesData) ? sondagesData : [];
        setSondages(parsedSondages);
        setSelectedOptions(
          Object.fromEntries(
            parsedSondages
              .filter((sondage: IForumSondage) => sondage.user_vote_option_id)
              .map((sondage: IForumSondage) => [sondage.id, sondage.user_vote_option_id as number])
          )
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [poleSlug]);

  async function handleCreateSujet(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(API_ENDPOINTS.forum.createSujet(poleSlug), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de la création.");
      }
      const newSujet: IForumSujet = await res.json();
      setSujets((prev) => [newSujet, ...prev]);
      setTitle("");
      setContent("");
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVote(sondage: IForumSondage) {
    if (!token) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const optionId = selectedOptions[sondage.id];
    if (!optionId) {
      setVoteError("Sélectionnez un choix avant de voter.");
      return;
    }

    setVotingId(sondage.id);
    setVoteError("");
    try {
      const res = await fetch(API_ENDPOINTS.forum.voteSondage(sondage.id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ option_id: optionId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Vote impossible.");
      }
      const updated: IForumSondage = await res.json();
      setSondages((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (updated.user_vote_option_id) {
        setSelectedOptions((prev) => ({ ...prev, [updated.id]: updated.user_vote_option_id as number }));
      }
    } catch (err: unknown) {
      setVoteError(err instanceof Error ? err.message : "Vote impossible.");
    } finally {
      setVotingId(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-48" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!pole) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Pôle introuvable.</p>
        <Link href="/espace-collaboratif/pole-concertation" className="text-[#E05017] mt-4 inline-block">
          ← Retour aux pôles
        </Link>
      </div>
    );
  }

  const objectifsAnnuels = parseJsonList(pole.objectifs_annuels);
  const regionsInfluence = parseJsonList(pole.regions_influence);
  const realisations = parseJsonList(pole.realisations);
  const projetsEnCours = parseJsonList(pole.projets_en_cours);
  const agendaItems = parseAgenda(pole.agenda);
  const nbOscMembres = pole.nb_osc_membres ?? 0;
  const nbMembresActifs = pole.nb_membres_actifs ?? nbOscMembres;
  const userCanVoteInPole =
    !!user?.is_superuser ||
    !!user?.is_staff ||
    (isOscUser && oscPoleIds !== null && oscPoleIds.includes(pole.id));
  const checkingVoteAccess = isOscUser && oscPoleIds === null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-poppins">
      {/* Breadcrumb */}
      <Link
        href="/espace-collaboratif/pole-concertation"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E05017] mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Tous les pôles
      </Link>

      {/* Pole header */}
      <div className="bg-[#f0f9ff] rounded-xl p-6 mb-6 border border-gray-200">
        {pole.category && (
          <div className="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white bg-[#E05017] mb-3">
            {pole.category}
          </div>
        )}
        <h1 className="text-2xl font-bold text-[#2a591d] mb-2">{pole.name}</h1>
        {pole.description && (
          <p className="text-gray-600 text-sm">{pole.description}</p>
        )}
        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2 rounded-lg bg-white/80 border border-gray-200 px-3 py-2">
            <Users className="w-4 h-4 text-[#E05017]" />
            <span><strong>{nbOscMembres}</strong> OSC membres</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/80 border border-gray-200 px-3 py-2">
            <Users className="w-4 h-4 text-[#2a591d]" />
            <span><strong>{nbMembresActifs}</strong> membres actifs</span>
          </div>
        </div>
      </div>

      {/* Objectifs annuels */}
      {objectifsAnnuels.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#E05017]" />
            <h2 className="font-bold text-gray-800">Objectifs annuels du pôle</h2>
          </div>
          <ul className="space-y-2">
            {objectifsAnnuels.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E05017] mt-2 flex-shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Régions d'influence */}
      {regionsInfluence.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#E05017]" />
            <h2 className="font-bold text-gray-800">Régions d&apos;influence</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {regionsInfluence.map((region, i) => (
              <span key={i} className="px-3 py-1 bg-[#2a591d]/10 text-[#2a591d] rounded-full text-sm font-medium">
                {region}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Réalisations */}
      {realisations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#E05017]" />
            <h2 className="font-bold text-gray-800">Nos réalisations</h2>
          </div>
          <ul className="space-y-2">
            {realisations.map((realisation, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a591d] mt-2 flex-shrink-0" />
                {realisation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projets en cours */}
      {projetsEnCours.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-[#E05017]" />
            <h2 className="font-bold text-gray-800">Nos projets en cours</h2>
          </div>
          <ul className="space-y-2">
            {projetsEnCours.map((projet, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E05017] mt-2 flex-shrink-0" />
                {projet}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Agenda */}
      {agendaItems.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-[#E05017]" />
            <h2 className="font-bold text-gray-800">Agenda</h2>
          </div>
          <div className="space-y-3">
            {agendaItems.map((item, i) => {
              const status = AGENDA_STATUS_META[item.statut ?? "en_cours"];
              return (
                <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  {item.date && (
                    <div className="flex-shrink-0 text-center bg-[#E05017] text-white rounded-lg px-3 py-2 min-w-[60px]">
                      <p className="text-xs font-semibold">
                        {new Date(item.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </p>
                      <p className="text-xs">{new Date(item.date).getFullYear()}</p>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-800 text-sm">{item.titre}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sondages */}
      {sondages.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Vote className="w-5 h-5 text-[#E05017]" />
            <h2 className="font-bold text-gray-800">Sondages et votes</h2>
          </div>

          {voteError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {voteError}
            </div>
          )}

          <div className="space-y-5">
            {sondages.map((sondage) => {
              const isClosed = sondage.status !== "ouvert";
              const canVote = !!token && !isClosed && userCanVoteInPole && !checkingVoteAccess;
              const selectedOptionId = selectedOptions[sondage.id] ?? sondage.user_vote_option_id ?? undefined;
              return (
                <div key={sondage.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-sm">{sondage.question}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isClosed ? "bg-gray-200 text-gray-600" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isClosed ? "Fermé" : "Ouvert"}
                        </span>
                      </div>
                      {sondage.description && (
                        <p className="text-xs text-gray-500 mt-1">{sondage.description}</p>
                      )}
                      {sondage.closes_at && (
                        <p className="text-[11px] text-gray-400 mt-1">
                          Clôture : {formatDateTime(sondage.closes_at)}
                        </p>
                      )}
                    </div>
                    {sondage.can_show_results && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <BarChart3 className="w-3.5 h-3.5" />
                        {sondage.total_votes} vote{sondage.total_votes !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {sondage.options.map((option) => {
                      const checked = selectedOptionId === option.id;
                      return (
                        <label
                          key={option.id}
                          className={`block rounded-lg border px-3 py-2 transition-colors ${
                            checked ? "border-[#E05017] bg-white" : "border-gray-200 bg-white/80"
                          } ${canVote ? "cursor-pointer hover:border-[#E05017]/60" : "cursor-default"}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <input
                                type="radio"
                                name={`sondage-${sondage.id}`}
                                checked={checked}
                                disabled={!canVote}
                                onChange={() => setSelectedOptions((prev) => ({ ...prev, [sondage.id]: option.id }))}
                                className="accent-[#E05017]"
                              />
                              {option.label}
                            </span>
                            {sondage.user_vote_option_id === option.id && (
                              <span className="text-[11px] font-semibold text-[#E05017]">Votre choix</span>
                            )}
                          </div>

                          {sondage.can_show_results && (
                            <div className="mt-2">
                              <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                                <span>{option.votes_count} vote{option.votes_count !== 1 ? "s" : ""}</span>
                                <span>{option.percentage}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#E05017]"
                                  style={{ width: `${option.percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {!sondage.can_show_results && (
                    <p className="mt-3 text-xs text-gray-500">
                      Les résultats seront visibles selon la règle définie par l&apos;administrateur.
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {token ? (
                      <button
                        onClick={() => handleVote(sondage)}
                        disabled={!canVote || !selectedOptionId || votingId === sondage.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E05017] text-white text-sm font-semibold hover:bg-[#c44315] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {votingId === sondage.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Vote className="w-4 h-4" />}
                        {sondage.user_vote_option_id ? "Modifier mon vote" : "Voter"}
                      </button>
                    ) : (
                      <Link
                        href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                        className="text-sm text-[#E05017] font-semibold hover:underline"
                      >
                        Se connecter pour voter
                      </Link>
                    )}

                    {checkingVoteAccess && (
                      <span className="text-xs text-gray-400">Vérification de votre pôle...</span>
                    )}
                    {token && !checkingVoteAccess && !userCanVoteInPole && (
                      <span className="text-xs text-gray-400">Vote réservé aux OSC membres de ce pôle.</span>
                    )}
                    {isClosed && (
                      <span className="text-xs text-gray-400">Ce sondage est fermé.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          {sujets.length} discussion{sujets.length !== 1 ? "s" : ""}
        </h2>
        {token ? (
          (() => {
            // OSC user who hasn't loaded their poles yet → loading state, allow
            const oscRestricted = isOscUser && oscPoleIds !== null && pole && !oscPoleIds.includes(pole.id);
            if (oscRestricted) {
              return (
                <div
                  title="Ce pôle ne correspond pas à vos domaines prioritaires"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-400 rounded-full text-sm font-semibold cursor-not-allowed select-none"
                >
                  <Lock className="w-4 h-4" />
                  Accès non autorisé
                </div>
              );
            }
            return (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] transition-colors"
              >
                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showForm ? "Annuler" : "Nouveau sujet"}
              </button>
            );
          })()
        ) : (
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
            className="text-sm text-[#E05017] font-semibold hover:underline"
          >
            Se connecter pour participer
          </Link>
        )}
      </div>

      {/* New sujet form */}
      {showForm && (
        <form
          onSubmit={handleCreateSujet}
          className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Créer un nouveau sujet</h3>
          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
              placeholder="Titre de la discussion..."
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
              placeholder="Décrivez votre sujet..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] disabled:opacity-50"
          >
            {submitting ? "Publication..." : "Publier"}
          </button>
        </form>
      )}

      {/* Sujets list */}
      {sujets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>Aucune discussion pour l&apos;instant.</p>
          {token && (() => {
            const oscRestricted = isOscUser && oscPoleIds !== null && pole && !oscPoleIds.includes(pole.id);
            if (oscRestricted) return null;
            return (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-[#E05017] font-semibold hover:underline text-sm"
              >
                Soyez le premier à lancer une discussion !
              </button>
            );
          })()}
        </div>
      ) : (
        <div className="space-y-3">
          {sujets.map((sujet) => (
            <Link
              key={sujet.id}
              href={`/espace-collaboratif/pole-concertation/${poleSlug}/${sujet.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-[#E05017] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {sujet.is_pinned && (
                      <Pin className="w-4 h-4 text-[#E05017] flex-shrink-0" />
                    )}
                    <h3 className="font-semibold text-gray-900 truncate">{sujet.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Par <span className="font-medium">{sujet.author_name || "Anonyme"}</span>
                    {" · "}
                    {formatDate(sujet.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {sujet.comments_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {sujet.views_count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
