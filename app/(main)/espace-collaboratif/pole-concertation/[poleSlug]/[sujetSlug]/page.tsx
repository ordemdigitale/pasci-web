"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { IForumSujetDetail, IForumCommentaire } from "@/types/api.types";
import { getToken, getStoredUser } from "@/lib/auth";
import { ArrowLeft, Eye, MessageSquare, Trash2, Send } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PageSujetDetail() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const poleSlug = params.poleSlug as string;
  const sujetSlug = params.sujetSlug as string;

  const [sujet, setSujet] = useState<IForumSujetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setToken(getToken());
    setCurrentUser(getStoredUser());
  }, []);

  useEffect(() => {
    fetch(API_ENDPOINTS.forum.sujetDetail(poleSlug, sujetSlug))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // S'assurer que commentaires est toujours un tableau
        if (data && typeof data === "object" && data.id) {
          setSujet({ ...data, commentaires: Array.isArray(data.commentaires) ? data.commentaires : [] });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [poleSlug, sujetSlug]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!comment.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(API_ENDPOINTS.forum.createCommentaire(poleSlug, sujetSlug), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur.");
      }
      const newComment: IForumCommentaire = await res.json();
      setSujet((prev) =>
        prev
          ? {
              ...prev,
              commentaires: [...prev.commentaires, newComment],
              comments_count: prev.comments_count + 1,
            }
          : prev
      );
      setComment("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!token) return;
    if (!confirm("Supprimer ce commentaire ?")) return;
    try {
      await fetch(API_ENDPOINTS.forum.deleteCommentaire(commentId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSujet((prev) =>
        prev
          ? {
              ...prev,
              commentaires: prev.commentaires.filter((c) => c.id !== commentId),
              comments_count: Math.max(0, prev.comments_count - 1),
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-6 w-64" />
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!sujet) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Sujet introuvable.</p>
        <Link
          href={`/espace-collaboratif/pole-concertation/${poleSlug}`}
          className="text-[#E05017] mt-4 inline-block"
        >
          ← Retour aux discussions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 font-poppins">
      {/* Breadcrumb */}
      <Link
        href={`/espace-collaboratif/pole-concertation/${poleSlug}`}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E05017] mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux discussions
      </Link>

      {/* Original post */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-3">{sujet.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span className="font-medium text-gray-600">{sujet.author_name || "Anonyme"}</span>
          <span>·</span>
          <span>{formatDate(sujet.created_at)}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {sujet.views_count}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> {sujet.comments_count}
          </span>
        </div>
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-4">
          {sujet.content}
        </div>
      </div>

      {/* Comments */}
      <h2 className="text-base font-bold text-gray-800 mb-4">
        {(sujet.commentaires ?? []).length} réponse{(sujet.commentaires ?? []).length !== 1 ? "s" : ""}
      </h2>

      <div className="space-y-4 mb-8">
        {(sujet.commentaires ?? []).map((c) => {
          const isOwner = currentUser && c.author_id === currentUser.id;
          const isStaff = currentUser && (currentUser.is_staff || currentUser.is_superuser);
          return (
            <div key={c.id} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="font-semibold text-sm text-gray-800">
                    {c.author_name || "Anonyme"}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">{formatDate(c.created_at)}</span>
                </div>
                {(isOwner || isStaff) && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reply form */}
      {token ? (
        <form
          onSubmit={handleComment}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <h3 className="font-semibold text-gray-800 mb-3">Votre réponse</h3>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <textarea
            ref={commentRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] mb-3"
            placeholder="Votre réponse..."
          />
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Envoi..." : "Répondre"}
          </button>
        </form>
      ) : (
        <div className="bg-[#f0f9ff] border border-blue-100 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm mb-3">
            Vous devez être connecté pour participer à cette discussion.
          </p>
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
            className="inline-block px-6 py-2 bg-[#E05017] text-white rounded-full text-sm font-semibold hover:bg-[#C54415] transition-colors"
          >
            Se connecter
          </Link>
        </div>
      )}
    </div>
  );
}
