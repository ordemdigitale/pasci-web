"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrasc, IOsc } from "@/types/api.types";
import { fetchAllCrasc, fetchAllOsc } from "@/lib/fetch-crasc";
import { getFormationBySlug } from "@/lib/fetch-formations";
import {
  ArrowLeft,
  BookOpen,
  X,
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Schema de validation
const formationSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
  description: z.string().optional().nullable(),
  trainer: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  registration_deadline: z.string().optional().nullable(),
  max_participants: z.number().int().positive().optional().nullable(),
  current_participants: z.number().int().nonnegative().optional().nullable(),
  registration_link: z.string().url("Lien invalide").or(z.literal("")).optional().nullable(),
  materials_link: z.string().url("Lien invalide").or(z.literal("")).optional().nullable(),
  is_published: z.boolean(),
  is_completed: z.boolean(),
  crasc_id: z.string().optional().nullable(),
  osc_id: z.string().optional().nullable(),
});

type FormationForm = z.infer<typeof formationSchema>;

export default function AdminModifierFormation() {
  const params = useParams();
  const slug = params.slug as string;
  const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
  const [oscs, setOscs] = useState<IOsc[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormationForm>({
    resolver: zodResolver(formationSchema),
  });

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        // Charger la formation
        const formation = await getFormationBySlug(slug);

        // Convertir les dates pour datetime-local input
        const formatDateForInput = (dateStr: string | null) => {
          if (!dateStr) return "";
          try {
            const date = new Date(dateStr);
            return date.toISOString().slice(0, 16);
          } catch {
            return "";
          }
        };

        // Pré-remplir le formulaire
        setValue("title", formation.title);
        setValue("description", formation.description || "");
        setValue("trainer", formation.trainer || "");
        setValue("location", formation.location || "");
        setValue("start_date", formatDateForInput(formation.start_date));
        setValue("end_date", formatDateForInput(formation.end_date));
        setValue("registration_deadline", formatDateForInput(formation.registration_deadline));
        setValue("max_participants", formation.max_participants || undefined);
        setValue("current_participants", formation.current_participants);
        setValue("registration_link", formation.registration_link || "");
        setValue("materials_link", formation.materials_link || "");
        setValue("is_published", formation.is_published);
        setValue("is_completed", formation.is_completed);
        setValue("crasc_id", formation.crasc_id?.toString() || "");
        setValue("osc_id", formation.osc_id?.toString() || "");

        // Charger CRASC et OSC
        const [crascData, oscData] = await Promise.all([fetchAllCrasc(), fetchAllOsc()]);
        setCrascRegions(crascData);
        setOscs(oscData);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setErrorMessage("Erreur lors du chargement de la formation");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [slug, setValue]);

  // Soumission du formulaire
  const onSubmit = async (values: FormationForm) => {
    console.log("Form submitted with values:", values);
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      if (values.trainer) formData.append("trainer", values.trainer);
      if (values.location) formData.append("location", values.location);
      if (values.start_date) formData.append("start_date", values.start_date);
      if (values.end_date) formData.append("end_date", values.end_date);
      if (values.registration_deadline)
        formData.append("registration_deadline", values.registration_deadline);
      if (values.max_participants !== null && values.max_participants !== undefined)
        formData.append("max_participants", values.max_participants.toString());
      if (values.current_participants !== null && values.current_participants !== undefined)
        formData.append("current_participants", values.current_participants.toString());
      if (values.registration_link) formData.append("registration_link", values.registration_link);
      if (values.materials_link) formData.append("materials_link", values.materials_link);
      formData.append("is_published", values.is_published.toString());
      formData.append("is_completed", values.is_completed.toString());
      if (values.crasc_id) formData.append("crasc_id", values.crasc_id);
      if (values.osc_id) formData.append("osc_id", values.osc_id);

      console.log("Sending PATCH request to:", `${API_BASE_URL}/api/v1/formations/${slug}`);

      const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/formations/${slug}`, {
        method: "PATCH",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        const errorMessage =
          errorData.detail?.errors?.[0]?.message ||
          errorData.detail ||
          `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Success response:", result);

      setSuccessMessage("✅ Formation modifiée avec succès!");

      setTimeout(() => {
        router.push("/admin/formations");
      }, 2000);
    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      setErrorMessage(
        error.message || "Une erreur est survenue lors de la modification de la formation."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2A591D]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Modifier la Formation</h1>
              <p className="text-white/80 mt-1">Modifiez les informations de la formation</p>
            </div>
          </div>
          <Link
            href="/admin/formations"
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la gestion des formations
          </Link>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit(
            (data) => {
              console.log("Form validation passed, submitting:", data);
              onSubmit(data);
            },
            (errors) => {
              console.error("Form validation errors:", errors);
              setErrorMessage("Veuillez corriger les erreurs dans le formulaire.");
            }
          )}
          className="space-y-6"
        >
          {/* Section: Informations de base */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <BookOpen className="w-5 h-5 text-[#2A591D]" />
              <h2 className="text-xl font-bold text-gray-900">Informations de base</h2>
            </div>

            {/* Titre */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Titre de la formation <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Gestion de Projet pour OSC"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Description de la formation..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
              )}
            </div>

            {/* Formateur et Lieu */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="trainer" className="block text-sm font-semibold text-gray-700 mb-2">
                  Formateur
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="trainer"
                    type="text"
                    {...register("trainer")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent"
                    placeholder="Nom du formateur"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Lieu
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="location"
                    type="text"
                    {...register("location")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent"
                    placeholder="Lieu de la formation"
                  />
                </div>
              </div>
            </div>

            {/* Statuts */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  id="is_published"
                  type="checkbox"
                  {...register("is_published")}
                  className="w-5 h-5 text-[#2A591D] border-gray-300 rounded focus:ring-[#2A591D]"
                />
                <label htmlFor="is_published" className="text-sm font-semibold text-gray-700">
                  Formation publiée
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="is_completed"
                  type="checkbox"
                  {...register("is_completed")}
                  className="w-5 h-5 text-[#2A591D] border-gray-300 rounded focus:ring-[#2A591D]"
                />
                <label htmlFor="is_completed" className="text-sm font-semibold text-gray-700">
                  Formation terminée
                </label>
              </div>
            </div>
          </div>

          {/* Section: Dates et inscriptions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-[#2A591D]" />
              <h2 className="text-xl font-bold text-gray-900">Dates et inscriptions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Date de début */}
              <div>
                <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  id="start_date"
                  type="datetime-local"
                  {...register("start_date")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent"
                />
              </div>

              {/* Date de fin */}
              <div>
                <label htmlFor="end_date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  id="end_date"
                  type="datetime-local"
                  {...register("end_date")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Date limite d'inscription */}
              <div>
                <label
                  htmlFor="registration_deadline"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Date limite d'inscription
                </label>
                <input
                  id="registration_deadline"
                  type="datetime-local"
                  {...register("registration_deadline")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent"
                />
              </div>

              {/* Participants actuels */}
              <div>
                <label
                  htmlFor="current_participants"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Participants actuels
                </label>
                <input
                  id="current_participants"
                  type="number"
                  {...register("current_participants", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent"
                  min="0"
                />
              </div>

              {/* Nombre max de participants */}
              <div>
                <label
                  htmlFor="max_participants"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Maximum de participants
                </label>
                <input
                  id="max_participants"
                  type="number"
                  {...register("max_participants", { valueAsNumber: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent"
                  placeholder="Ex: 30"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Section: Liens */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <LinkIcon className="w-5 h-5 text-[#2A591D]" />
              <h2 className="text-xl font-bold text-gray-900">Liens et ressources</h2>
            </div>

            {/* Lien d'inscription */}
            <div className="mb-6">
              <label
                htmlFor="registration_link"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Lien d'inscription
              </label>
              <input
                id="registration_link"
                type="url"
                {...register("registration_link")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent ${
                  errors.registration_link ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/inscription"
              />
              {errors.registration_link && (
                <p className="text-red-500 text-sm mt-2">{errors.registration_link.message}</p>
              )}
            </div>

            {/* Lien supports */}
            <div>
              <label
                htmlFor="materials_link"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Lien vers les supports de formation
              </label>
              <input
                id="materials_link"
                type="url"
                {...register("materials_link")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent ${
                  errors.materials_link ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://example.com/supports"
              />
              {errors.materials_link && (
                <p className="text-red-500 text-sm mt-2">{errors.materials_link.message}</p>
              )}
            </div>
          </div>

          {/* Section: Associations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Users className="w-5 h-5 text-[#2A591D]" />
              <h2 className="text-xl font-bold text-gray-900">Associations</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* CRASC */}
              <div>
                <label htmlFor="crasc_id" className="block text-sm font-semibold text-gray-700 mb-2">
                  CRASC associé
                </label>
                <Controller
                  name="crasc_id"
                  control={control}
                  render={({ field }) => (
                    <Select.Root onValueChange={field.onChange} value={field.value || undefined}>
                      <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all flex items-center justify-between">
                        <Select.Value placeholder="Sélectionnez un CRASC" />
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </Select.Trigger>
                      <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto z-50">
                        <Select.Viewport>
                          {crascRegions.map((region) => (
                            <Select.Item
                              key={region.id}
                              value={region.id.toString()}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                              <Select.ItemText>{region.name}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </div>

              {/* OSC */}
              <div>
                <label htmlFor="osc_id" className="block text-sm font-semibold text-gray-700 mb-2">
                  OSC associée
                </label>
                <Controller
                  name="osc_id"
                  control={control}
                  render={({ field }) => (
                    <Select.Root onValueChange={field.onChange} value={field.value || undefined}>
                      <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all flex items-center justify-between">
                        <Select.Value placeholder="Sélectionnez une OSC" />
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      </Select.Trigger>
                      <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto z-50">
                        <Select.Viewport>
                          {oscs.map((osc) => (
                            <Select.Item
                              key={osc.id}
                              value={osc.id.toString()}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                            >
                              <Select.ItemText>{osc.name}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Root>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[#2A591D] to-[#3d7a28] text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Modification en cours...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
