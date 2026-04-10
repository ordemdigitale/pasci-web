"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Megaphone } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

interface Iannonce {
  id: number;
  texte: string;
  is_active: boolean;
  ordre: number;
  created_at: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Iannonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/annonces`);
      if (res.ok) setAnnonces(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnonces(); }, []);

  const handleToggle = async (annonce: Iannonce) => {
    setTogglingId(annonce.id);
    try {
      await fetchWithAuth(`${API_BASE}/api/v1/annonces/${annonce.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !annonce.is_active }),
      });
      setAnnonces((prev) =>
        prev.map((a) => a.id === annonce.id ? { ...a, is_active: !a.is_active } : a)
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    setDeletingId(id);
    try {
      await fetchWithAuth(`${API_BASE}/api/v1/annonces/${id}`, { method: "DELETE" });
      setAnnonces((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E05017]/10 rounded-lg">
            <Megaphone className="w-6 h-6 text-[#E05017]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bande défilante</h1>
            <p className="text-sm text-gray-500">Gérer les annonces affichées sous le menu</p>
          </div>
        </div>
        <Link
          href="/admin/annonces/ajouter"
          className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c94510] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : annonces.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
          <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune annonce</p>
          <p className="text-gray-400 text-sm mt-1">Créez votre première annonce pour la bande défilante</p>
        </div>
      ) : (
        <div className="space-y-3">
          {annonces.map((annonce) => (
            <div
              key={annonce.id}
              className={`bg-white rounded-lg border p-4 flex items-center gap-4 transition-opacity ${
                annonce.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
              }`}
            >
              {/* Ordre badge */}
              <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center shrink-0">
                {annonce.ordre}
              </span>

              {/* Text */}
              <p className="flex-1 text-sm text-gray-800 line-clamp-1">{annonce.texte}</p>

              {/* Status */}
              <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                annonce.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {annonce.is_active ? "Active" : "Inactive"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggle(annonce)}
                  disabled={togglingId === annonce.id}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  title={annonce.is_active ? "Désactiver" : "Activer"}
                >
                  {annonce.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <Link
                  href={`/admin/annonces/${annonce.id}/modifier`}
                  className="p-1.5 rounded hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(annonce.id)}
                  disabled={deletingId === annonce.id}
                  className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
