"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { IPoleConcertation, IForumSujet } from "@/types/api.types";
import { getToken } from "@/lib/auth";
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  Pin,
  Plus,
  X,
} from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PagePoleForum() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const poleSlug = params.poleSlug as string;

  const [pole, setPole] = useState<IPoleConcertation | null>(null);
  const [sujets, setSujets] = useState<IForumSujet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

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
      <div className="bg-[#f0f9ff] rounded-xl p-6 mb-8 border border-gray-200">
        <div className="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white bg-[#E05017] mb-3">
          {pole.category}
        </div>
        <h1 className="text-2xl font-bold text-[#2a591d] mb-2">{pole.name}</h1>
        {pole.description && (
          <p className="text-gray-600 text-sm">{pole.description}</p>
        )}
      </div>

      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          {sujets.length} discussion{sujets.length !== 1 ? "s" : ""}
        </h2>
        {token ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Annuler" : "Nouveau sujet"}
          </button>
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
          {token && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-[#E05017] font-semibold hover:underline text-sm"
            >
              Soyez le premier à lancer une discussion !
            </button>
          )}
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
