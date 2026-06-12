"use client";
import { fetchWithAuth } from "@/lib/auth";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Plus, Trash2, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IOffreProjet, IPTF } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Validation schema
const projetSchema = z.object({
  nom: z.string().min(5, "Le nom doit contenir au moins 5 caractères."),
  osc: z.string().min(2, "L'OSC porteuse est requise."),
  domaine: z.string().min(1, "Le domaine est requis."),
  zone: z.string().min(2, "La zone est requise."),
  durée: z.string().min(1, "La durée est requise."),
  budget: z.string().min(1, "Le budget est requis."),
  offre_url: z.string().url("Lien de l'offre invalide").or(z.literal("")).optional(),
  objectif: z.string().optional(),
  description: z.string().optional(),
  beneficiaires: z.string().optional(),
  statut: z.string().min(1, "Le statut est requis."),
  progression: z.number().min(0).max(100),
});

type ProjetFormData = z.infer<typeof projetSchema>;

const domaines = [
  "Environnement",
  "Éducation",
  "Santé",
  "Culture & Économie",
  "Agriculture",
  "Eau & Assainissement",
  "Développement communautaire",
];

const zones = [
  "Abidjan",
  "Bouaké",
  "Yamoussoukro",
  "Korhogo",
  "San-Pédro",
  "Daloa",
  "Région du Nord",
  "Région du Sud",
  "Région de l'Ouest",
  "Région du Centre",
];

export default function EditProjetPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projet, setProjet] = useState<IOffreProjet | null>(null);

  // Listes dynamiques
  const [resultats, setResultats] = useState<string[]>([""]);
  const [partenaires, setPartenaires] = useState<string[]>([""]);

  // PTF
  const [ptfList, setPtfList] = useState<IPTF[]>([]);
  const [selectedPtfId, setSelectedPtfId] = useState<string>("");

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjetFormData>({
    resolver: zodResolver(projetSchema),
  });

  const progression = watch("progression");

  // Load projet data
  useEffect(() => {
    const loadProjet = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/offre-projets/${slug}`);
        if (!response.ok) {
          throw new Error("Projet non trouvé");
        }
        const data = await response.json();
        setProjet(data);

        // Set form values
        setValue("nom", data.nom);
        setValue("osc", data.osc);
        setValue("domaine", data.domaine);
        setValue("zone", data.zone);
        setValue("durée", data.durée);
        setValue("budget", data.budget);
        setValue("offre_url", data.offre_url || "");
        setValue("statut", data.statut);
        setValue("progression", data.progression);

        if (data.objectif) setValue("objectif", data.objectif);
        if (data.description) setValue("description", data.description);
        if (data.beneficiaires) setValue("beneficiaires", data.beneficiaires);

        // Load resultats
        if (data.resultats_attendus_list && data.resultats_attendus_list.length > 0) {
          setResultats(data.resultats_attendus_list);
        }

        // Load partenaires
        if (data.partenaires_list && data.partenaires_list.length > 0) {
          setPartenaires(data.partenaires_list);
        }

        // Load image
        if (data.image_url) {
          setCurrentImage(data.image_url);
        }

        // Load PTF
        if (data.ptf_id) {
          setSelectedPtfId(data.ptf_id.toString());
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjet();
  }, [slug, setValue]);

  // Load PTF list
  useEffect(() => {
    const loadPtfList = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/ptf`);
        if (response.ok) {
          const data = await response.json();
          setPtfList(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des PTF:", err);
      }
    };
    loadPtfList();
  }, []);

  // Gestion des résultats attendus
  const addResultat = () => {
    setResultats([...resultats, ""]);
  };

  const removeResultat = (index: number) => {
    setResultats(resultats.filter((_, i) => i !== index));
  };

  const updateResultat = (index: number, value: string) => {
    const newResultats = [...resultats];
    newResultats[index] = value;
    setResultats(newResultats);
  };

  // Gestion des partenaires
  const addPartenaire = () => {
    setPartenaires([...partenaires, ""]);
  };

  const removePartenaire = (index: number) => {
    setPartenaires(partenaires.filter((_, i) => i !== index));
  };

  const updatePartenaire = (index: number, value: string) => {
    const newPartenaires = [...partenaires];
    newPartenaires[index] = value;
    setPartenaires(newPartenaires);
  };

  // Gestion de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setCurrentImage(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: ProjetFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Filtrer les listes vides
      const filteredResultats = resultats.filter(r => r.trim());
      const filteredPartenaires = partenaires.filter(p => p.trim());

      // Créer FormData pour envoyer l'image
      const formData = new FormData();
      formData.append("nom", data.nom);
      formData.append("osc", data.osc);
      formData.append("domaine", data.domaine);
      formData.append("zone", data.zone);
      formData.append("durée", data.durée);
      formData.append("budget", data.budget);
      formData.append("offre_url", data.offre_url || "");
      formData.append("statut", data.statut);
      formData.append("progression", data.progression.toString());

      if (data.objectif) formData.append("objectif", data.objectif);
      if (data.description) formData.append("description", data.description);
      if (data.beneficiaires) formData.append("beneficiaires", data.beneficiaires);

      if (filteredResultats.length > 0) {
        formData.append("resultats_attendus", JSON.stringify(filteredResultats));
      }
      if (filteredPartenaires.length > 0) {
        formData.append("partenaires", JSON.stringify(filteredPartenaires));
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (selectedPtfId) {
        formData.append("ptf_id", selectedPtfId);
      }

      const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/offre-projets/${slug}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de la mise à jour du projet");
      }

      router.push("/admin/projets");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#E05017]" />
      </div>
    );
  }

  if (error && !projet) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
          <Link
            href="/admin/projets"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/projets"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Modifier le projet
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de {projet?.nom}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form - Même structure que le formulaire d'ajout */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations principales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations principales
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du projet *
                </label>
                <input
                  {...register("nom")}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Ex: Eau Potable pour Tous"
                />
                {errors.nom && (
                  <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  OSC Porteuse *
                </label>
                <input
                  {...register("osc")}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Ex: Initiative Eau Claire"
                />
                {errors.osc && (
                  <p className="text-red-600 text-sm mt-1">{errors.osc.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Domaine *
                  </label>
                  <select
                    {...register("domaine")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  >
                    <option value="">Sélectionnez un domaine</option>
                    {domaines.map((domaine) => (
                      <option key={domaine} value={domaine}>
                        {domaine}
                      </option>
                    ))}
                  </select>
                  {errors.domaine && (
                    <p className="text-red-600 text-sm mt-1">{errors.domaine.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zone *
                  </label>
                  <select
                    {...register("zone")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  >
                    <option value="">Sélectionnez une zone</option>
                    {zones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                  {errors.zone && (
                    <p className="text-red-600 text-sm mt-1">{errors.zone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Durée *
                  </label>
                  <input
                    {...register("durée")}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    placeholder="Ex: 24 mois"
                  />
                  {errors.durée && (
                    <p className="text-red-600 text-sm mt-1">{errors.durée.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget *
                  </label>
                  <input
                    {...register("budget")}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    placeholder="Ex: 250 millions FCFA"
                  />
                  {errors.budget && (
                    <p className="text-red-600 text-sm mt-1">{errors.budget.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lien de l&apos;offre
                </label>
                <input
                  {...register("offre_url")}
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="https://exemple.org/offre"
                />
                {errors.offre_url && (
                  <p className="text-red-600 text-sm mt-1">{errors.offre_url.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Descriptions
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Objectif principal
                </label>
                <textarea
                  {...register("objectif")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Décrivez l'objectif principal du projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description détaillée
                </label>
                <textarea
                  {...register("description")}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Description détaillée du projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bénéficiaires
                </label>
                <textarea
                  {...register("beneficiaires")}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Ex: 15,000 personnes dans 15 villages"
                />
              </div>
            </div>
          </div>

          {/* Statut et Progression */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Statut et Progression
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Statut *
                </label>
                <select
                  {...register("statut")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                >
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
                {errors.statut && (
                  <p className="text-red-600 text-sm mt-1">{errors.statut.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Progression ({progression}%)
                </label>
                <input
                  {...register("progression", { valueAsNumber: true })}
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Partenaire Technique et Financier */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Partenaire Technique et Financier
            </h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PTF associé (optionnel)
              </label>
              <select
                value={selectedPtfId}
                onChange={(e) => setSelectedPtfId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
              >
                <option value="">Aucun PTF</option>
                {ptfList.map((ptf) => (
                  <option key={ptf.id} value={ptf.id.toString()}>
                    {ptf.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Résultats attendus */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Résultats attendus
              </h2>
              <button
                type="button"
                onClick={addResultat}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {resultats.map((resultat, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={resultat}
                    onChange={(e) => updateResultat(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    placeholder="Ex: Amélioration de l'accès à l'eau potable"
                  />
                  {resultats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResultat(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Partenaires */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Partenaires
              </h2>
              <button
                type="button"
                onClick={addPartenaire}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {partenaires.map((partenaire, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={partenaire}
                    onChange={(e) => updatePartenaire(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    placeholder="Ex: UNICEF, GIZ, Ministère..."
                  />
                  {partenaires.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePartenaire(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Image du projet
            </h2>

            {!imagePreview && !currentImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Cliquez pour télécharger une nouvelle image
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  PNG, JPG jusqu'à 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Choisir une image
                </label>
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={imagePreview || currentImage || ""}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {currentImage && !imagePreview && (
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload-replace"
                    />
                    <label
                      htmlFor="image-upload-replace"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Remplacer l'image
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour le projet"}
            </button>
            <Link
              href="/admin/projets"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-bold text-center"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
