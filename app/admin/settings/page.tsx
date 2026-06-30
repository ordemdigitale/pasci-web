"use client";

import { useState, useEffect, useRef } from 'react';
import { Save, Image as ImageIcon, X } from 'lucide-react';
import { fetchWithAuth } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formationImage, setFormationImage] = useState<string | null>(null);
  const [newFormationImage, setNewFormationImage] = useState<File | null>(null);
  const [formationPreview, setFormationPreview] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [imageSaved, setImageSaved] = useState(false);

  useEffect(() => {
    fetchWithAuth(`${API_BASE}/api/v1/config`)
      .then((r) => r.ok ? r.json() : {})
      .then((cfg: Record<string, string>) => {
        if (cfg.formation_default_image) setFormationImage(cfg.formation_default_image);
      })
      .catch(() => {});
  }, []);

  const handleImageFile = (file: File) => {
    setNewFormationImage(file);
    setFormationPreview(URL.createObjectURL(file));
  };

  const saveFormationImage = async () => {
    if (!newFormationImage) return;
    setSavingImage(true);
    try {
      const fd = new FormData();
      fd.append("image", newFormationImage);
      const res = await fetchWithAuth(`${API_BASE}/api/v1/config/upload/formation_default_image`, { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormationImage(data.value);
        setNewFormationImage(null);
        setFormationPreview(null);
        setImageSaved(true);
        setTimeout(() => setImageSaved(false), 2000);
      }
    } finally {
      setSavingImage(false);
    }
  };
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="space-y-6">
        {/* Image générique formations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-[#E05017]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Image générique des formations</h2>
              <p className="text-sm text-gray-600">Affichée pour toutes les formations sans vignette personnalisée</p>
            </div>
          </div>

          <div className="max-w-sm">
            {(formationPreview || formationImage) && (
              <div className="relative rounded-lg overflow-hidden aspect-video mb-3 bg-gray-100">
                <img src={formationPreview || formationImage || ""} alt="Image générique" className="w-full h-full object-cover" />
                {formationPreview && (
                  <button type="button" onClick={() => { setNewFormationImage(null); setFormationPreview(null); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
            {!formationPreview && (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#E05017] hover:bg-orange-50 transition-colors mb-3">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">{formationImage ? "Changer l'image" : "Choisir une image"}</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
            {formationPreview && (
              <button type="button" onClick={saveFormationImage} disabled={savingImage}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg text-sm font-medium hover:bg-[#c94510] disabled:opacity-50">
                <Save className="w-4 h-4" />
                {imageSaved ? "Enregistré ✓" : savingImage ? "Enregistrement..." : "Enregistrer l'image"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
