"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Images, GripVertical, Save } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { ImageWithFallback } from "@/lib/imageWithFallback";

interface IHeroSlide {
  id: number;
  image_url: string;
  ordre: number;
  is_active: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_TITLE = "Centre Régional d'Appui à la Société Civile (CRASC)";
const DEFAULT_DESC = "Cette Plateforme digitale est la résultante d'une démarche alliant à la fois, inclusivité, représentativité, accessibilité et pérennité. Multifonctionnelle et dynamique, elle vise à accroître la visibilité des OSC, la synergie d'action, le partage d'expérience et la professionnalisation.";

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<IHeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroTitle, setHeroTitle] = useState(DEFAULT_TITLE);
  const [heroDesc, setHeroDesc] = useState(DEFAULT_DESC);
  const [savingText, setSavingText] = useState(false);
  const [textSaved, setTextSaved] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/v1/hero-slides`);
      if (res.ok) setSlides(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
    fetchWithAuth(`${API_BASE}/api/v1/config`)
      .then((r) => r.ok ? r.json() : {})
      .then((cfg: Record<string, string>) => {
        if (cfg.hero_title) setHeroTitle(cfg.hero_title);
        if (cfg.hero_description) setHeroDesc(cfg.hero_description);
      })
      .catch(() => {});
  }, []);

  const saveText = async () => {
    setSavingText(true);
    try {
      await Promise.all([
        fetchWithAuth(`${API_BASE}/api/v1/config/hero_title`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: heroTitle }),
        }),
        fetchWithAuth(`${API_BASE}/api/v1/config/hero_description`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: heroDesc }),
        }),
      ]);
      setTextSaved(true);
      setTimeout(() => setTextSaved(false), 2000);
    } finally {
      setSavingText(false);
    }
  };

  const handleToggle = async (slide: IHeroSlide) => {
    setTogglingId(slide.id);
    try {
      const fd = new FormData();
      fd.append("is_active", String(!slide.is_active));
      await fetchWithAuth(`${API_BASE}/api/v1/hero-slides/${slide.id}`, { method: "PATCH", body: fd });
      setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, is_active: !s.is_active } : s));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette image ?")) return;
    setDeletingId(id);
    try {
      await fetchWithAuth(`${API_BASE}/api/v1/hero-slides/${id}`, { method: "DELETE" });
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 font-poppins">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E05017]/10 rounded-lg">
            <Images className="w-6 h-6 text-[#E05017]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Slider CRASC</h1>
            <p className="text-sm text-gray-500">Images du slider sur la page d&apos;accueil</p>
          </div>
        </div>
        <Link
          href="/admin/hero-slides/ajouter"
          className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c94510] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Ajouter une image
        </Link>
      </div>

      {/* Texte de la section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Texte de la section</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]/30 focus:border-[#E05017]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={heroDesc}
            onChange={(e) => setHeroDesc(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]/30 focus:border-[#E05017] resize-none"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={saveText}
            disabled={savingText}
            className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c94510] text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {textSaved ? "Enregistré ✓" : savingText ? "Enregistrement..." : "Enregistrer le texte"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg aspect-video animate-pulse" />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
          <Images className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune image</p>
          <p className="text-gray-400 text-sm mt-1">Ajoutez des images pour le slider de la page d&apos;accueil</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`relative rounded-lg overflow-hidden border-2 group transition-all ${
                slide.is_active ? "border-gray-200" : "border-gray-100 opacity-50"
              }`}
            >
              <div className="aspect-video">
                <ImageWithFallback
                  src={slide.image_url}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Ordre badge */}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                #{slide.ordre}
              </div>

              {/* Status badge */}
              <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                slide.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
              }`}>
                {slide.is_active ? "Active" : "Inactive"}
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleToggle(slide)}
                  disabled={togglingId === slide.id}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title={slide.is_active ? "Désactiver" : "Activer"}
                >
                  {slide.is_active ? <EyeOff className="w-4 h-4 text-gray-700" /> : <Eye className="w-4 h-4 text-gray-700" />}
                </button>
                <Link
                  href={`/admin/hero-slides/${slide.id}/modifier`}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-gray-700" />
                </Link>
                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={deletingId === slide.id}
                  className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
