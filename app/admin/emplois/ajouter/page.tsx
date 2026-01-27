"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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
});

type JobFormData = z.infer<typeof jobSchema>;

export default function AddJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Préparer les données
      const payload: any = {
        title: data.title,
        employer: data.employer,
        description: data.description,
        location: data.location,
        type: data.type,
        is_expired: false,
      };

      // Ajouter les dates si fournies
      if (data.publication_date) {
        payload.publication_date = new Date(data.publication_date).toISOString();
      }
      if (data.expiration_date) {
        payload.expiration_date = new Date(data.expiration_date).toISOString();
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de la création de l'offre d'emploi");
      }

      router.push("/admin/emplois");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Créer une nouvelle offre d'emploi
          </h1>
          <p className="text-gray-600 mt-2">
            Publiez une nouvelle opportunité professionnelle
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
              Dates
            </h2>

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
                <p className="text-gray-500 text-xs mt-1">
                  Laissez vide pour utiliser la date actuelle
                </p>
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
                <p className="text-gray-500 text-xs mt-1">
                  Date limite de candidature
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#E05017] text-white rounded-lg hover:bg-[#c44315] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Création en cours..." : "Créer l'offre d'emploi"}
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
