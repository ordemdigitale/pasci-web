"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { fetchWithAuth } from "@/lib/auth";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Gouvernance",
  "Droits humains",
  "Environnement",
  "Éducation",
  "Santé",
  "Économie",
  "Genre",
  "Jeunesse",
  "Culture",
  "Sécurité",
  "Autre",
];

export default function AdminModifierPolePage() {
  const params = useParams();
  const router = useRouter();
  const poleSlug = params.poleSlug as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [objectifs, setObjectifs] = useState<string[]>([""]);

  useEffect(() => {
    fetch(API_ENDPOINTS.forum.poleBySlug(poleSlug))
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || "");
        setCategory(data.category || "");
        setDescription(data.description || "");
        setImagePath(data.image_path || "");
        setIsActive(data.is_active ?? true);
        try {
          const parsed = data.objectifs ? JSON.parse(data.objectifs) : [];
          setObjectifs(parsed.length > 0 ? parsed : [""]);
        } catch {
          setObjectifs([""]);
        }
      })
      .catch(() => setError("Impossible de charger le pôle."))
      .finally(() => setLoading(false));
  }, [poleSlug]);

  function addObjectif() {
    setObjectifs((prev) => [...prev, ""]);
  }

  function removeObjectif(index: number) {
    setObjectifs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateObjectif(index: number, value: string) {
    setObjectifs((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const filteredObjectifs = objectifs.filter((o) => o.trim());
      const body = {
        name: name.trim(),
        category: category || null,
        description: description.trim() || null,
        image_path: imagePath.trim() || null,
        is_active: isActive,
        objectifs: filteredObjectifs.length > 0 ? JSON.stringify(filteredObjectifs) : null,
      };
      const res = await fetchWithAuth(API_ENDPOINTS.forum.poleBySlug(poleSlug), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de la mise à jour.");
      }
      router.push("/admin/forum/poles");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/forum/poles"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#E05017] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux pôles
        </Link>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Modifier le pôle</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du pôle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            >
              <option value="">-- Sélectionner --</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
            <input
              type="text"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
              placeholder="/images/pole.jpg"
            />
          </div>

          {/* Objectifs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs</label>
            <div className="space-y-2">
              {objectifs.map((obj, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => updateObjectif(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                    placeholder={`Objectif ${index + 1}...`}
                  />
                  {objectifs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjectif(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addObjectif}
                className="flex items-center gap-1 text-sm text-[#E05017] hover:underline mt-1"
              >
                <Plus className="w-4 h-4" /> Ajouter un objectif
              </button>
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-[#E05017]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Pôle actif (visible sur le site)
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#E05017] text-white rounded-lg text-sm font-semibold hover:bg-[#c44315] disabled:opacity-50 transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
            <Link href="/admin/forum/poles">
              <button
                type="button"
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
