"use client";
import { fetchWithAuth } from "@/lib/auth";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Plus, Trash2, Home, Heart, TrendingUp, UtensilsCrossed, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { IJobs } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Validation schema
const jobSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères."),
  employer: z.string().min(2, "L'employeur est requis."),
  description: z.string().min(50, "La description doit contenir au moins 50 caractères."),
  location: z.string().min(2, "La localisation est requise."),
  type: z.string().min(1, "Le type de contrat est requis."),
  publication_date: z.string().optional(),
  expiration_date: z.string().optional(),
  is_expired: z.boolean().optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface Mission {
  title: string;
  description: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const iconOptions = [
  { value: "Home", label: "Télétravail", icon: Home },
  { value: "Heart", label: "Santé", icon: Heart },
  { value: "TrendingUp", label: "Carrière", icon: TrendingUp },
  { value: "UtensilsCrossed", label: "Restaurant", icon: UtensilsCrossed },
  { value: "GraduationCap", label: "Formation", icon: GraduationCap },
  { value: "Users", label: "Équipe", icon: Users },
];

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<IJobs | null>(null);

  // États pour les listes dynamiques
  const [missions, setMissions] = useState<Mission[]>([{ title: "", description: "" }]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<Benefit[]>([{ icon: "Home", title: "", description: "" }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  // Fonctions pour gérer les missions
  const addMission = () => {
    setMissions([...missions, { title: "", description: "" }]);
  };

  const removeMission = (index: number) => {
    setMissions(missions.filter((_, i) => i !== index));
  };

  const updateMission = (index: number, field: keyof Mission, value: string) => {
    const newMissions = [...missions];
    newMissions[index][field] = value;
    setMissions(newMissions);
  };

  // Fonctions pour gérer les requirements
  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  // Fonctions pour gérer les benefits
  const addBenefit = () => {
    setBenefits([...benefits, { icon: "Home", title: "", description: "" }]);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const updateBenefit = (index: number, field: keyof Benefit, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index][field] = value;
    setBenefits(newBenefits);
  };

  // Load job data
  useEffect(() => {
    const loadJob = async () => {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/jobs/${slug}`);
        if (!response.ok) {
          throw new Error("Offre d'emploi non trouvée");
        }
        const data = await response.json();
        setJob(data);

        // Set form values
        setValue("title", data.title);
        setValue("employer", data.employer);
        setValue("description", data.description);
        setValue("location", data.location);
        setValue("type", data.type);
        setValue("is_expired", data.is_expired);

        // Set dates if available
        if (data.publication_date) {
          const pubDate = new Date(data.publication_date);
          setValue("publication_date", pubDate.toISOString().split('T')[0]);
        }
        if (data.expiration_date) {
          const expDate = new Date(data.expiration_date);
          setValue("expiration_date", expDate.toISOString().split('T')[0]);
        }

        // Load missions, requirements, benefits
        if (data.missions_list && data.missions_list.length > 0) {
          setMissions(data.missions_list);
        }
        if (data.requirements_list && data.requirements_list.length > 0) {
          setRequirements(data.requirements_list);
        }
        if (data.benefits_list && data.benefits_list.length > 0) {
          setBenefits(data.benefits_list);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [slug, setValue]);

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Filtrer les missions, requirements et benefits vides
      const filteredMissions = missions.filter(m => m.title.trim() && m.description.trim());
      const filteredRequirements = requirements.filter(r => r.trim());
      const filteredBenefits = benefits.filter(b => b.title.trim() && b.description.trim());

      // Préparer les données
      const payload: any = {
        title: data.title,
        employer: data.employer,
        description: data.description,
        location: data.location,
        type: data.type,
        is_expired: data.is_expired || false,
        missions: filteredMissions.length > 0 ? JSON.stringify(filteredMissions) : null,
        requirements: filteredRequirements.length > 0 ? JSON.stringify(filteredRequirements) : null,
        benefits: filteredBenefits.length > 0 ? JSON.stringify(filteredBenefits) : null,
      };

      // Ajouter les dates si fournies
      if (data.publication_date) {
        payload.publication_date = new Date(data.publication_date).toISOString();
      }
      if (data.expiration_date) {
        payload.expiration_date = new Date(data.expiration_date).toISOString();
      }

      const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/jobs/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de la mise à jour de l'offre d'emploi");
      }

      router.push("/admin/emplois");
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

  if (error && !job) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
          <Link
            href="/admin/emplois"
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
            href="/admin/emplois"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Modifier l'offre d'emploi
          </h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de {job?.title}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations principales
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Intitulé du poste *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Ex: Développeur Full Stack"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employeur *
                </label>
                <input
                  {...register("employer")}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Ex: PASCI Côte d'Ivoire"
                />
                {errors.employer && (
                  <p className="text-red-600 text-sm mt-1">{errors.employer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description du poste *
                </label>
                <textarea
                  {...register("description")}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  placeholder="Décrivez en détail les missions et responsabilités..."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Localisation *
                  </label>
                  <input
                    {...register("location")}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    placeholder="Ex: Abidjan, Côte d'Ivoire"
                  />
                  {errors.location && (
                    <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type de contrat *
                  </label>
                  <select
                    {...register("type")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Dates et statut
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de publication
                  </label>
                  <input
                    {...register("publication_date")}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date d'expiration
                  </label>
                  <input
                    {...register("expiration_date")}
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  {...register("is_expired")}
                  type="checkbox"
                  id="is_expired"
                  className="w-4 h-4 text-[#E05017] border-gray-300 rounded focus:ring-[#E05017]"
                />
                <label htmlFor="is_expired" className="text-sm font-semibold text-gray-700">
                  Marquer comme expirée
                </label>
              </div>
            </div>
          </div>

          {/* Missions & Responsabilités */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Missions & Responsabilités
              </h2>
              <button
                type="button"
                onClick={addMission}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            <div className="space-y-4">
              {missions.map((mission, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-[#E05017] font-bold text-lg">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    {missions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMission(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Titre de la mission
                      </label>
                      <input
                        type="text"
                        value={mission.title}
                        onChange={(e) => updateMission(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                        placeholder="Ex: Coordination de projets stratégiques"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={mission.description}
                        onChange={(e) => updateMission(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                        placeholder="Décrivez cette mission..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profil Recherché */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Profil Recherché
              </h2>
              <button
                type="button"
                onClick={addRequirement}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                    placeholder="Ex: Formation supérieure (Bac+5)..."
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Avantages & Culture */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Avantages & Culture
              </h2>
              <button
                type="button"
                onClick={addBenefit}
                className="flex items-center gap-2 px-4 py-2 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {iconOptions.find(opt => opt.value === benefit.icon)?.icon && (
                        <div className="bg-[#E05017]/10 text-[#E05017] p-2 rounded-lg">
                          {(() => {
                            const IconComponent = iconOptions.find(opt => opt.value === benefit.icon)?.icon;
                            return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
                          })()}
                        </div>
                      )}
                    </div>
                    {benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Icône
                      </label>
                      <select
                        value={benefit.icon}
                        onChange={(e) => updateBenefit(index, 'icon', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                      >
                        {iconOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Titre
                      </label>
                      <input
                        type="text"
                        value={benefit.title}
                        onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                        placeholder="Ex: Télétravail hybride"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={benefit.description}
                        onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E05017] focus:border-[#E05017]"
                        placeholder="Ex: 2 jours par semaine"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour l'offre"}
            </button>
            <Link
              href="/admin/emplois"
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
