"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { fetchWithAuth } from "@/lib/auth";
import { ArrowLeft, MessageSquare, Pin, Trash2, Eye, Loader2 } from "lucide-react";

interface IForumSujet {
  id: number;
  title: string;
  slug: string;
  content: string;
  author_name: string | null;
  is_pinned: boolean;
  views_count: number;
  comments_count: number;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPoleSujetsPage() {
  const params = useParams();
  const poleSlug = params.poleSlug as string;

  const [poleName, setPoleName] = useState("");
  const [sujets, setSujets] = useState<IForumSujet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [pinningSlug, setPinningSlug] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(API_ENDPOINTS.forum.poleBySlug(poleSlug)).then((r) => r.json()),
      fetch(API_ENDPOINTS.forum.sujets(poleSlug)).then((r) => r.json()),
    ])
      .then(([poleData, sujetsData]) => {
        setPoleName(poleData.name || poleSlug);
        setSujets(Array.isArray(sujetsData) ? sujetsData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [poleSlug]);

  async function handleTogglePin(sujet: IForumSujet) {
    setPinningSlug(sujet.slug);
    try {
      const res = await fetchWithAuth(
        API_ENDPOINTS.forum.sujetDetail(poleSlug, sujet.slug),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_pinned: !sujet.is_pinned }),
        }
      );
      if (!res.ok) throw new Error();
      setSujets((prev) =>
        prev
          .map((s) => (s.slug === sujet.slug ? { ...s, is_pinned: !s.is_pinned } : s))
          .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0))
      );
    } catch {
      alert("Erreur lors de la mise à jour.");
    } finally {
      setPinningSlug(null);
    }
  }

  async function handleDelete(sujet: IForumSujet) {
    if (!confirm(`Supprimer le sujet "${sujet.title}" et tous ses commentaires ?`)) return;
    setDeletingSlug(sujet.slug);
    try {
      const res = await fetchWithAuth(
        API_ENDPOINTS.forum.sujetDetail(poleSlug, sujet.slug),
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      setSujets((prev) => prev.filter((s) => s.slug !== sujet.slug));
    } catch {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/forum/poles"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E05017] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux pôles
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{poleName}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {sujets.length} sujet{sujets.length !== 1 ? "s" : ""} · Gestion des discussions
            </p>
          </div>
          <Link
            href={`/espace-collaboratif/pole-concertation/${poleSlug}`}
            target="_blank"
            className="text-sm text-[#E05017] hover:underline flex items-center gap-1"
          >
            <Eye className="w-4 h-4" /> Voir sur le site
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : sujets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun sujet dans ce pôle.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sujets.map((sujet) => (
              <div
                key={sujet.id}
                className={`bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4 ${
                  sujet.is_pinned ? "border-[#E05017]/30 bg-orange-50/30" : "border-gray-200"
                }`}
              >
                {/* Pin indicator */}
                <div className="flex-shrink-0 mt-1">
                  {sujet.is_pinned && <Pin className="w-4 h-4 text-[#E05017]" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{sujet.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{sujet.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>Par <span className="font-medium text-gray-600">{sujet.author_name || "Anonyme"}</span></span>
                    <span>{formatDate(sujet.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {sujet.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> {sujet.comments_count}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePin(sujet)}
                    disabled={pinningSlug === sujet.slug}
                    className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                      sujet.is_pinned
                        ? "text-[#E05017] bg-orange-50 hover:bg-orange-100"
                        : "text-gray-400 hover:bg-gray-100 hover:text-[#E05017]"
                    }`}
                    title={sujet.is_pinned ? "Désépingler" : "Épingler"}
                  >
                    {pinningSlug === sujet.slug ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Pin className="w-4 h-4" />
                    )}
                  </button>

                  <Link
                    href={`/espace-collaboratif/pole-concertation/${poleSlug}/${sujet.slug}`}
                    target="_blank"
                  >
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir la discussion"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(sujet)}
                    disabled={deletingSlug === sujet.slug}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    {deletingSlug === sujet.slug ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
