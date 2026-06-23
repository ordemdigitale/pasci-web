"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ModifierAnnoncePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [texte, setTexte] = useState("");
  const [ordre, setOrdre] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [dateFin, setDateFin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/api/v1/annonces/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTexte(data.texte || "");
        setOrdre(data.ordre ?? 0);
        setIsActive(data.is_active ?? true);
        setDateFin(data.date_fin ? data.date_fin.slice(0, 16) : "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texte.trim()) { setError("Le texte est requis."); return; }
    setSaving(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/annonces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: texte.trim(), ordre, is_active: isActive, date_fin: dateFin || null }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour.");
      router.push("/admin/annonces");
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 font-poppins max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 font-poppins max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/annonces" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Modifier l&apos;annonce</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Texte de l&apos;annonce <span className="text-red-500">*</span>
          </label>
          <textarea
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]/30 focus:border-[#E05017] resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{texte.length}/500</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d&apos;affichage</label>
            <input
              type="number"
              value={ordre}
              onChange={(e) => setOrdre(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]/30 focus:border-[#E05017]"
            />
            <p className="text-xs text-gray-400 mt-1">0 = affiché en premier</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]/30 focus:border-[#E05017]"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date d&apos;expiration</label>
          <input
            type="datetime-local"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]/30 focus:border-[#E05017]"
          />
          <p className="text-xs text-gray-400 mt-1">Laisser vide pour aucune expiration automatique</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/annonces"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c94510] text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
