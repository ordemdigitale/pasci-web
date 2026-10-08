"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Images, GripVertical, Save, Upload, RotateCcw, Loader2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { ImageWithFallback } from "@/lib/imageWithFallback";

interface IHeroSlide {
  id: number;
  image_url: string;
  title?: string | null;
  description?: string | null;
  ordre: number;
  is_active: boolean;
  type: string;
  date_expiration?: string | null;
  est_expiree?: boolean;
  a_descriptif?: boolean;
}

// Image affichée quand aucune slide n'est active (site public, components/home/SectionHero.tsx)
const IMAGE_DEFAUT_ORIGINE = "/images/de715dfa-b501-4ea4-9532-9d32d85c10e0.png";

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
  // Image par défaut du carrousel (1.6), modifiable comme le texte par défaut
  const [imageDefaut, setImageDefaut] = useState("");
  const [envoiImage, setEnvoiImage] = useState(false);
  const [erreurImage, setErreurImage] = useState("");

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
        setImageDefaut(cfg.hero_image_defaut || "");
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

  const changerImageDefaut = async (fichier: File | null) => {
    setEnvoiImage(true);
    setErreurImage("");
    try {
      if (fichier) {
        const fd = new FormData();
        fd.append("image", fichier);
        const res = await fetchWithAuth(`${API_BASE}/api/v1/config/upload/hero_image_defaut`, { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Envoi impossible.");
        setImageDefaut(data.value);
      } else {
        await fetchWithAuth(`${API_BASE}/api/v1/config/hero_image_defaut`, { method: "PUT", body: JSON.stringify({ value: "" }) });
        setImageDefaut("");
      }
    } catch (err) {
      setErreurImage(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setEnvoiImage(false);
    }
  };

  const slidesHaut = slides.filter((s) => s.type === "haut");
  const slidesBas = slides.filter((s) => s.type === "bas");

  const SlideGrid = ({ items }: { items: IHeroSlide[] }) => (
    items.length === 0 ? (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <Images className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Aucune image pour cette section</p>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((slide) => (
          <div
            key={slide.id}
            className={`relative rounded-lg overflow-hidden border-2 group transition-all ${
              slide.is_active && !slide.est_expiree ? "border-gray-200" : "border-gray-100 opacity-50"
            }`}
          >
            <div className="aspect-video">
              <ImageWithFallback
                src={slide.image_url}
                alt={slide.title || `Slide ${slide.id}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 bg-white min-h-[88px]">
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                {slide.title || "Sans titre"}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                {slide.description || "Aucune description liée à cette image"}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {slide.date_expiration && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${slide.est_expiree ? "bg-red-100 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                    {slide.est_expiree ? "Expirée le " : "Expire le "}
                    {new Date(slide.date_expiration).toLocaleDateString("fr-FR")}
                  </span>
                )}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${slide.a_descriptif ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {slide.a_descriptif ? "Descriptif « Voir plus »" : "Sans descriptif"}
                </span>
              </div>
            </div>

            {/* Ordre badge */}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              #{slide.ordre}
            </div>

            {/* Status badge */}
            <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
              slide.est_expiree ? "bg-red-500 text-white" : slide.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}>
              {slide.est_expiree ? "Expirée" : slide.is_active ? "Active" : "Inactive"}
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
    )
  );

  return (
    <div className="p-6 font-poppins">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E05017]/10 rounded-lg">
            <Images className="w-6 h-6 text-[#E05017]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des slides</h1>
            <p className="text-sm text-gray-500">Images du slider de la page d&apos;accueil</p>
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

      {/* Texte par défaut */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Texte et image par défaut du carrousel</h2>
        <p className="text-xs text-gray-500">
          Le texte est utilisé lorsqu&apos;une image du carrousel n&apos;a pas son propre titre ou sa propre description.
          L&apos;image par défaut s&apos;affiche (avec ce texte) lorsqu&apos;aucune image n&apos;est active.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageDefaut || IMAGE_DEFAUT_ORIGINE} alt="Image par défaut du carrousel" className="w-48 aspect-video object-cover rounded-lg border border-gray-200" />
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#E05017] text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-[#c94510]">
              {envoiImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Changer l&apos;image par défaut
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                aria-label="Image par défaut du carrousel"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) changerImageDefaut(f);
                  e.target.value = "";
                }}
              />
            </label>
            {imageDefaut && (
              <button onClick={() => changerImageDefaut(null)} className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                <RotateCcw className="w-4 h-4" /> Image d&apos;origine
              </button>
            )}
            {erreurImage && <span className="text-sm text-red-600">{erreurImage}</span>}
          </div>
        </div>
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
      ) : (
        <div className="space-y-8">
          {/* Section slides du haut */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Slider Héro (haut)</h2>
                <p className="text-xs text-gray-500 mt-0.5">Images du carousel dans la section héro (à gauche, en haut de la page d&apos;accueil)</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                {slidesHaut.length} image{slidesHaut.length !== 1 ? "s" : ""}
              </span>
            </div>
            <SlideGrid items={slidesHaut} />
          </div>

          {/* Section slides du bas (partenaires) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Slider photo (bas)</h2>
                <p className="text-xs text-gray-500 mt-0.5">Images du grand carousel pleine largeur sous les actualités</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                {slidesBas.length} image{slidesBas.length !== 1 ? "s" : ""}
              </span>
            </div>
            <SlideGrid items={slidesBas} />
          </div>
        </div>
      )}
    </div>
  );
}
