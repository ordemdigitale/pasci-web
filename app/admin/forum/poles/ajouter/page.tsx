"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api-config";
import { fetchWithAuth } from "@/lib/auth";
import { ArrowLeft, Plus, Trash2, Loader2, Image as ImageIcon, X } from "lucide-react";

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

export default function AdminAjouterPolePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [objectifs, setObjectifs] = useState<string[]>([""]);
  const [objectifsAnnuels, setObjectifsAnnuels] = useState<string[]>([""]);
  const [nbOscMembres, setNbOscMembres] = useState("");
  const [regionsInfluence, setRegionsInfluence] = useState<string[]>([""]);
  const [realisations, setRealisations] = useState<string[]>([""]);
  const [agenda, setAgenda] = useState<{ date: string; titre: string; description: string }[]>([
    { date: "", titre: "", description: "" },
  ]);

  function addObjectif() { setObjectifs((p) => [...p, ""]); }
  function removeObjectif(i: number) { setObjectifs((p) => p.filter((_, idx) => idx !== i)); }
  function updateObjectif(i: number, v: string) { setObjectifs((p) => p.map((o, idx) => (idx === i ? v : o))); }

  function addObjectifAnnuel() { setObjectifsAnnuels((p) => [...p, ""]); }
  function removeObjectifAnnuel(i: number) { setObjectifsAnnuels((p) => p.filter((_, idx) => idx !== i)); }
  function updateObjectifAnnuel(i: number, v: string) { setObjectifsAnnuels((p) => p.map((o, idx) => (idx === i ? v : o))); }

  function addRegion() { setRegionsInfluence((p) => [...p, ""]); }
  function removeRegion(i: number) { setRegionsInfluence((p) => p.filter((_, idx) => idx !== i)); }
  function updateRegion(i: number, v: string) { setRegionsInfluence((p) => p.map((o, idx) => (idx === i ? v : o))); }

  function addRealisation() { setRealisations((p) => [...p, ""]); }
  function removeRealisation(i: number) { setRealisations((p) => p.filter((_, idx) => idx !== i)); }
  function updateRealisation(i: number, v: string) { setRealisations((p) => p.map((o, idx) => (idx === i ? v : o))); }

  function addAgendaItem() { setAgenda((p) => [...p, { date: "", titre: "", description: "" }]); }
  function removeAgendaItem(i: number) { setAgenda((p) => p.filter((_, idx) => idx !== i)); }
  function updateAgendaItem(i: number, field: "date" | "titre" | "description", v: string) {
    setAgenda((p) => p.map((item, idx) => (idx === i ? { ...item, [field]: v } : item)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const filteredObjectifs = objectifs.filter((o) => o.trim());
      const filteredObjAnnuels = objectifsAnnuels.filter((o) => o.trim());
      const filteredRegions = regionsInfluence.filter((o) => o.trim());
      const filteredRealisations = realisations.filter((o) => o.trim());
      const filteredAgenda = agenda.filter((a) => a.titre.trim() || a.date.trim());
      const formData = new FormData();
      formData.append("name", name.trim());
      if (category) formData.append("category", category);
      if (description.trim()) formData.append("description", description.trim());
      formData.append("is_active", String(isActive));
      if (filteredObjectifs.length > 0) formData.append("objectifs", JSON.stringify(filteredObjectifs));
      if (filteredObjAnnuels.length > 0) formData.append("objectifs_annuels", JSON.stringify(filteredObjAnnuels));
      if (nbOscMembres.trim()) formData.append("nb_osc_membres", nbOscMembres.trim());
      if (filteredRegions.length > 0) formData.append("regions_influence", JSON.stringify(filteredRegions));
      if (filteredRealisations.length > 0) formData.append("realisations", JSON.stringify(filteredRealisations));
      if (filteredAgenda.length > 0) formData.append("agenda", JSON.stringify(filteredAgenda));
      if (image) formData.append("image", image);

      const res = await fetchWithAuth(API_ENDPOINTS.forum.poles, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erreur lors de la création.");
      }
      router.push("/admin/forum/poles");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Nouveau pôle de concertation</h1>

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
              placeholder="Ex: Pôle Gouvernance et Citoyenneté"
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
              placeholder="Description du pôle..."
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-[#E05017] transition-colors"
              style={{ height: "160px" }}
              onClick={() => document.getElementById("pole-image-input-add")?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImage(null); setImagePreview(null); }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-sm">Cliquer pour ajouter une image</span>
                  <span className="text-xs">JPG, PNG, WEBP</span>
                </div>
              )}
            </div>
            <input
              id="pole-image-input-add"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImage(file);
                if (file) setImagePreview(URL.createObjectURL(file));
              }}
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

          {/* Objectifs annuels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Objectifs annuels du pôle</label>
            <div className="space-y-2">
              {objectifsAnnuels.map((obj, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => updateObjectifAnnuel(i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                    placeholder={`Objectif annuel ${i + 1}...`}
                  />
                  {objectifsAnnuels.length > 1 && (
                    <button type="button" onClick={() => removeObjectifAnnuel(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addObjectifAnnuel} className="flex items-center gap-1 text-sm text-[#E05017] hover:underline mt-1">
                <Plus className="w-4 h-4" /> Ajouter un objectif annuel
              </button>
            </div>
          </div>

          {/* Nombre d'OSC membres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d&apos;OSC membres</label>
            <input
              type="number"
              min="0"
              value={nbOscMembres}
              onChange={(e) => setNbOscMembres(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
              placeholder="Ex: 12"
            />
          </div>

          {/* Régions d'influence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Régions d&apos;influence</label>
            <div className="space-y-2">
              {regionsInfluence.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => updateRegion(i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                    placeholder={`Région ${i + 1}...`}
                  />
                  {regionsInfluence.length > 1 && (
                    <button type="button" onClick={() => removeRegion(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addRegion} className="flex items-center gap-1 text-sm text-[#E05017] hover:underline mt-1">
                <Plus className="w-4 h-4" /> Ajouter une région
              </button>
            </div>
          </div>

          {/* Réalisations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nos réalisations</label>
            <div className="space-y-2">
              {realisations.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => updateRealisation(i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                    placeholder={`Réalisation ${i + 1}...`}
                  />
                  {realisations.length > 1 && (
                    <button type="button" onClick={() => removeRealisation(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addRealisation} className="flex items-center gap-1 text-sm text-[#E05017] hover:underline mt-1">
                <Plus className="w-4 h-4" /> Ajouter une réalisation
              </button>
            </div>
          </div>

          {/* Agenda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agenda</label>
            <div className="space-y-3">
              {agenda.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 relative">
                  {agenda.length > 1 && (
                    <button type="button" onClick={() => removeAgendaItem(i)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => updateAgendaItem(i, "date", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                  />
                  <input
                    type="text"
                    value={item.titre}
                    onChange={(e) => updateAgendaItem(i, "titre", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                    placeholder="Titre de l'événement..."
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateAgendaItem(i, "description", e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E05017]"
                    placeholder="Description (optionnel)..."
                  />
                </div>
              ))}
              <button type="button" onClick={addAgendaItem} className="flex items-center gap-1 text-sm text-[#E05017] hover:underline mt-1">
                <Plus className="w-4 h-4" /> Ajouter un événement
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
              {submitting ? "Création..." : "Créer le pôle"}
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
