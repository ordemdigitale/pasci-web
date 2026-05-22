"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { fetchWithAuth, getToken } from "@/lib/auth";
import {
  BookOpen,
  Upload,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  Download,
  Eye,
  EyeOff,
  X,
  CheckCircle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ICatalogue {
  id: number;
  titre: string;
  description?: string | null;
  fichier_path: string;
  fichier_url: string;
  is_active: boolean;
  created_at: string;
}

async function fetchCatalogues(): Promise<ICatalogue[]> {
  const res = await fetch(`${API_BASE}/api/v1/formations/catalogue?active_only=false`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Impossible de charger les catalogues.");
  return res.json();
}

export default function AdminCataloguePage() {
  const [catalogues, setCatalogues] = useState<ICatalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCatalogues()
      .then(setCatalogues)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Veuillez sélectionner un fichier PDF.");
    const token = getToken();
    if (!token) return setError("Non authentifié.");
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("titre", titre);
      if (description) formData.append("description", description);
      formData.append("fichier", file);
      const res = await fetch(`${API_BASE}/api/v1/formations/catalogue`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Erreur lors de l'upload.");
      }
      const newCat: ICatalogue = await res.json();
      setCatalogues((prev) => [newCat, ...prev]);
      setTitre("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess("Catalogue ajouté avec succès.");
      setTimeout(() => setSuccess(null), 4000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce catalogue ? Cette action est irréversible.")) return;
    const token = getToken();
    if (!token) return setError("Non authentifié.");
    setDeleting(id);
    try {
      const res = await fetch(`${API_BASE}/api/v1/formations/catalogue/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression.");
      setCatalogues((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggle(cat: ICatalogue) {
    const token = getToken();
    if (!token) return setError("Non authentifié.");
    setToggling(cat.id);
    try {
      const formData = new FormData();
      formData.append("is_active", String(!cat.is_active));
      const res = await fetch(`${API_BASE}/api/v1/formations/catalogue/${cat.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour.");
      const updated: ICatalogue = await res.json();
      setCatalogues((prev) => prev.map((c) => (c.id === cat.id ? updated : c)));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-poppins">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E05017] to-[#c44315] rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Catalogue de Formations</h1>
            <p className="text-white/80 mt-1">Gérez les catalogues PDF téléchargeables</p>
          </div>
        </div>
        <Link
          href="/admin/formations"
          className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux formations
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
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ajouter un catalogue</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="ex : Catalogue de formations 2025"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte description du catalogue..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fichier PDF <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#E05017] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3 text-[#E05017]">
                  <FileText className="w-6 h-6" />
                  <span className="font-semibold text-sm">{file.name}</span>
                  <span className="text-gray-400 text-xs">({(file.size / 1024 / 1024).toFixed(2)} Mo)</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Cliquez pour sélectionner un fichier PDF</p>
                  <p className="text-xs text-gray-400">PDF uniquement</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !file || !titre}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#E05017] text-white rounded-xl font-bold hover:bg-[#c44315] disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...</>
            ) : (
              <><Upload className="w-4 h-4" /> Ajouter le catalogue</>
            )}
          </button>
        </form>
      </div>

      {/* Catalogues List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Catalogues existants</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
          </div>
        ) : catalogues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <FileText className="w-14 h-14 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun catalogue ajouté pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {catalogues.map((cat) => (
              <div
                key={cat.id}
                className={`bg-white rounded-xl border p-4 shadow-sm flex items-center gap-4 ${
                  cat.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 line-clamp-1">{cat.titre}</p>
                  {cat.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">{cat.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ajouté le {new Date(cat.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    {" · "}
                    <span className={cat.is_active ? "text-green-600 font-semibold" : "text-gray-400"}>
                      {cat.is_active ? "Visible" : "Masqué"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={cat.fichier_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                    title="Voir le PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleToggle(cat)}
                    disabled={toggling === cat.id}
                    className={`p-2 rounded-lg transition-colors ${
                      cat.is_active
                        ? "text-amber-500 hover:bg-amber-50"
                        : "text-green-500 hover:bg-green-50"
                    }`}
                    title={cat.is_active ? "Masquer" : "Afficher"}
                  >
                    {toggling === cat.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : cat.is_active ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deleting === cat.id}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    {deleting === cat.id ? (
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
