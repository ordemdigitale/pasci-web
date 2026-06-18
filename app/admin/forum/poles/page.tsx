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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface IPoleConcertation {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  image_path: string | null;
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

  useEffect(() => {
    fetchPoles();
  }, []);

  async function fetchPoles() {
    setLoading(true);
    try {
      // Fetch all poles including inactive (admin view)
      const res = await fetchWithAuth(API_ENDPOINTS.forum.poles + "?limit=100");
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
      const res = await fetchWithAuth(API_ENDPOINTS.forum.poleBySlug(pole.slug), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !pole.is_active }),
      });
      if (!res.ok) throw new Error();
      setPoles((prev) =>
        prev.map((p) => (p.slug === pole.slug ? { ...p, is_active: !p.is_active } : p))
      );
    } catch {
      alert("Erreur lors de la mise à jour.");
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
                {/* Category badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[#E05017]/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[#E05017]" />
                  </div>
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
