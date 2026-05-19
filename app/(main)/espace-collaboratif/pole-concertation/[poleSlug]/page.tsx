"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { IPoleConcertation, IForumSujet } from "@/types/api.types";
import { getToken, fetchWithAuth } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  Pin,
  Plus,
  X,
  Target,
  Users,
  MapPin,
  Star,
  CalendarDays,
} from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
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
    Promise.all([
      fetch(API_ENDPOINTS.forum.poleBySlug(poleSlug)).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(API_ENDPOINTS.forum.sujets(poleSlug)).then((r) => {
        if (!r.ok) return [];
        return r.json();
      }),
    ])
      .then(([poleData, sujetsData]) => {
        // Vérifier que poleData est bien un objet avec un id (pas une erreur API)
        if (poleData && typeof poleData === "object" && poleData.id) {
          setPole(poleData);
        }
        setSujets(Array.isArray(sujetsData) ? sujetsData : []);
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
        {pole.nb_osc_membres != null && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-[#E05017]" />
            <span><strong>{pole.nb_osc_membres}</strong> OSC membres</span>
          </div>
        )}
      </div>

      {/* Objectifs annuels */}
      {pole.objectifs_annuels && (() => {
        try {
          const list: string[] = JSON.parse(pole.objectifs_annuels);
          if (list.length === 0) return null;
          return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-[#E05017]" />
                <h2 className="font-bold text-gray-800">Objectifs annuels du pôle</h2>
              </div>
              <ul className="space-y-2">
                {list.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E05017] mt-2 flex-shrink-0" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          );
        } catch { return null; }
      })()}

      {/* Régions d'influence */}
      {pole.regions_influence && (() => {
        try {
          const list: string[] = JSON.parse(pole.regions_influence);
          if (list.length === 0) return null;
          return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[#E05017]" />
                <h2 className="font-bold text-gray-800">Régions d&apos;influence</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {list.map((r, i) => (
                  <span key={i} className="px-3 py-1 bg-[#2a591d]/10 text-[#2a591d] rounded-full text-sm font-medium">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          );
        } catch { return null; }
      })()}

      {/* Réalisations */}
      {pole.realisations && (() => {
        try {
          const list: string[] = JSON.parse(pole.realisations);
          if (list.length === 0) return null;
          return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-[#E05017]" />
                <h2 className="font-bold text-gray-800">Nos réalisations</h2>
              </div>
              <ul className="space-y-2">
                {list.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2a591d] mt-2 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          );
        } catch { return null; }
      })()}

      {/* Agenda */}
      {pole.agenda && (() => {
        try {
          const items: { date: string; titre: string; description: string }[] = JSON.parse(pole.agenda);
          if (items.length === 0) return null;
          return (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-[#E05017]" />
                <h2 className="font-bold text-gray-800">Agenda</h2>
              </div>
              <div className="space-y-3">
                {items.map((item, i) => (
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
                      <p className="font-semibold text-gray-800 text-sm">{item.titre}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        } catch { return null; }
      })()}

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
