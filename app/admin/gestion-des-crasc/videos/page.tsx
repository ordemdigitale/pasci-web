"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchAllCrasc, fetchCrascVideos, createCrascVideo, deleteCrascVideo } from "@/lib/fetch-crasc";
import { getToken } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { ICrasc, ICrascVideo } from "@/types/api.types";
import {
  Video,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building2,
  ExternalLink,
  X,
} from "lucide-react";

function getEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const vid =
        u.searchParams.get("v") ||
        (u.hostname === "youtu.be" ? u.pathname.slice(1) : null) ||
        u.pathname.split("/").pop();
      if (vid) return `https://www.youtube.com/embed/${vid}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const vid = u.pathname.split("/").filter(Boolean).pop();
      if (vid) return `https://player.vimeo.com/video/${vid}`;
    }
  } catch {}
  return null;
}

export default function AdminCrascVideosPage() {
  const { user } = useAuth();
  const isRedacteurCrasc = !!user?.is_redacteur && !!user?.crasc_id && !user?.is_staff && !user?.is_superuser;

  const [crascs, setCrascs] = useState<ICrasc[]>([]);
  const [selectedCrascId, setSelectedCrascId] = useState<number | null>(null);
  const [videos, setVideos] = useState<ICrascVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ titre: "", url: "", description: "", ordre: "0" });

  useEffect(() => {
    if (isRedacteurCrasc && user?.crasc_id) {
      // Rédacteur CRASC : forcer son propre CRASC
      setSelectedCrascId(user.crasc_id);
      setLoading(false);
    } else {
      fetchAllCrasc()
        .then((data) => {
          setCrascs(data);
          if (data.length > 0) setSelectedCrascId(parseInt(data[0].id));
        })
        .catch(() => setError("Impossible de charger les CRASC."))
        .finally(() => setLoading(false));
    }
  }, [isRedacteurCrasc, user?.crasc_id]);

  useEffect(() => {
    if (!selectedCrascId) return;
    setLoading(true);
    fetchCrascVideos(selectedCrascId)
      .then(setVideos)
      .catch(() => setError("Impossible de charger les vidéos."))
      .finally(() => setLoading(false));
  }, [selectedCrascId]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCrascId) return;
    const token = getToken();
    if (!token) return setError("Non authentifié.");
    setSubmitting(true);
    try {
      const video = await createCrascVideo(
        {
          crasc_id: selectedCrascId,
          titre: form.titre,
          url: form.url,
          description: form.description || undefined,
          ordre: parseInt(form.ordre) || 0,
        },
        token
      );
      setVideos((prev) => [...prev, video].sort((a, b) => a.ordre - b.ordre));
      setForm({ titre: "", url: "", description: "", ordre: "0" });
      setShowForm(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette vidéo ?")) return;
    const token = getToken();
    if (!token) return setError("Non authentifié.");
    setDeleting(id);
    try {
      await deleteCrascVideo(id, token);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  }

  const selectedCrasc = crascs.find((c) => parseInt(c.id) === selectedCrascId);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-poppins">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestion des Vidéos</h1>
            <p className="text-white/80 mt-1">Gérez les vidéos YouTube/Vimeo de chaque CRASC</p>
          </div>
        </div>
        <Link
          href="/admin/gestion-des-crasc"
          className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la gestion des CRASC
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        {/* CRASC Selector — masqué pour le rédacteur CRASC */}
        {!isRedacteurCrasc && (
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2A591D]" />
                CRASC
              </h3>
              <div className="space-y-1">
                {crascs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCrascId(parseInt(c.id)); setShowForm(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCrascId === parseInt(c.id)
                        ? "bg-[#2A591D] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Videos Section */}
        <div className={isRedacteurCrasc ? "md:col-span-4 space-y-4" : "md:col-span-3 space-y-4"}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Vidéos {selectedCrasc ? `— ${selectedCrasc.name}` : ""}
            </h2>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#3d7a28] transition-colors font-semibold text-sm"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Annuler" : "Ajouter une vidéo"}
            </button>
          </div>

          {/* Add form */}
          {showForm && (
            <form
              onSubmit={handleAdd}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4"
            >
              <h3 className="font-bold text-gray-900">Nouvelle vidéo</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.titre}
                  onChange={(e) => setForm({ ...form, titre: e.target.value })}
                  placeholder="Titre de la vidéo"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  URL YouTube ou Vimeo <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
                />
                {form.url && getEmbedUrl(form.url) && (
                  <div className="mt-2 rounded-lg overflow-hidden aspect-video">
                    <iframe
                      src={getEmbedUrl(form.url)!}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description (optionnel)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Courte description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A591D] resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    min="0"
                    value={form.ordre}
                    onChange={(e) => setForm({ ...form, ordre: e.target.value })}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A591D]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 px-6 py-2 bg-[#2A591D] text-white rounded-lg font-semibold text-sm hover:bg-[#3d7a28] disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Ajouter
                </button>
              </div>
            </form>
          )}

          {/* Videos list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#2A591D]" />
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Video className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune vidéo ajoutée pour ce CRASC.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => {
                const embedUrl = getEmbedUrl(video.url);
                return (
                  <div key={video.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail or embed preview */}
                      <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
                        {embedUrl ? (
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 line-clamp-1">{video.titre}</p>
                        {video.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{video.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-400">Ordre : {video.ordre}</span>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Voir la vidéo
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(video.id)}
                        disabled={deleting === video.id}
                        className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deleting === video.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
