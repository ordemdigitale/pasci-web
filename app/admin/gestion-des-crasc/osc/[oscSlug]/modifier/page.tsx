"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrasc, IOscType } from "@/types/api.types";
import {
  fetchAllCrasc,
  fetchAllOscType
} from "@/lib/fetch-crasc";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  FileText,
  Upload,
  X,
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
  Image as ImageIcon,
  Save
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Schema de validation pour le formulaire de modification d'OSC
const oscSchema = z.object({
  name: z.string().min(4, "Le nom de l'OSC doit contenir au moins 4 caractères.").optional(),
  description: z.string().max(500, "La description ne peut pas dépasser 500 caractères.").optional(),
  crasc_id: z.string().optional(),
  type_id: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  ville: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  thumbnail: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      { message: "L'image doit être inférieure à 5MB" }
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      { message: "Format d'image non supporté. Utilisez JPG, PNG ou WebP" }
    ),
});

type OscForm = z.infer<typeof oscSchema>;

interface IOscDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string;
  thumbnail_path: string;
  type?: {
    id: number;
    name: string;
    slug: string;
  };
  crasc?: {
    id: number;
    name: string;
    slug: string;
  };
  ville: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

export default function ModifierOscPage() {
  const params = useParams();
  const oscSlug = params.oscSlug as string;
  const router = useRouter();

  const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
  const [oscType, setOscType] = useState<IOscType[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [osc, setOsc] = useState<IOscDetail | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Récupérer les données de l'OSC
  useEffect(() => {
    const fetchOsc = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("OSC non trouvée");
        }

        const data = await response.json();
        setOsc(data);
        setPreviewImage(data.thumbnail_url || null);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setFetchLoading(false);
      }
    };

    if (oscSlug) {
      fetchOsc();
    }
  }, [oscSlug]);

  // Récupérer les régions CRASC
  useEffect(() => {
    fetchAllCrasc()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur lors de la récupération des CRASC: ", error));
  }, []);

  // Récupérer les types d'OSC
  useEffect(() => {
    fetchAllOscType()
      .then(data => setOscType(data))
      .catch(error => console.error("Erreur lors de la récupération des types d'OSC: ", error));
  }, []);

  const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<OscForm>({
    resolver: zodResolver(oscSchema),
    defaultValues: {
      name: "",
      description: "",
      crasc_id: "",
      type_id: "",
      email: "",
      phone: "",
      ville: "",
      address: "",
      latitude: "",
      longitude: ""
    },
  });

  // Remplir le formulaire avec les données de l'OSC
  useEffect(() => {
    if (osc) {
      setValue("name", osc.name || "");
      setValue("description", osc.description || "");
      setValue("crasc_id", osc.crasc?.id.toString() || "");
      setValue("type_id", osc.type?.id.toString() || "");
      setValue("email", osc.email || "");
      setValue("phone", osc.phone || "");
      setValue("ville", osc.ville || "");
      setValue("address", osc.address || "");
      setValue("latitude", osc.latitude?.toString() || "");
      setValue("longitude", osc.longitude?.toString() || "");
    }
  }, [osc, setValue]);

  const thumbnailFile = watch("thumbnail");

  // Gestion du preview de l'image
  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(thumbnailFile);
    }
  }, [thumbnailFile]);

  // Gestion du changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);
    }
  };

  // Supprimer l'image sélectionnée
  const handleRemoveImage = () => {
    setValue("thumbnail", undefined);
    setPreviewImage(osc?.thumbnail_url || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: OscForm) => {
    setLoading(true);
    setUploadProgress(0);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();

      if (values.name && values.name.trim() !== "") {
        formData.append("name", values.name);
      }
      if (values.description && values.description.trim() !== "") {
        formData.append("description", values.description);
      }
      if (values.crasc_id) {
        formData.append("crasc_id", values.crasc_id);
      }
      if (values.type_id) {
        formData.append("type_id", values.type_id);
      }
      if (values.email && values.email.trim() !== "") {
        formData.append("email", values.email);
      }
      if (values.phone && values.phone.trim() !== "") {
        formData.append("phone", values.phone);
      }
      if (values.ville && values.ville.trim() !== "") {
        formData.append("ville", values.ville);
      }
      if (values.address && values.address.trim() !== "") {
        formData.append("address", values.address);
      }
      if (values.latitude && values.latitude.trim() !== "") {
        formData.append("latitude", values.latitude);
      }
      if (values.longitude && values.longitude.trim() !== "") {
        formData.append("longitude", values.longitude);
      }
      if (values.thumbnail) {
        formData.append("thumbnail", values.thumbnail);
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/crasc/osc/${oscSlug}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("OSC modifiée avec succès!");
        setTimeout(() => {
          router.push(`/admin/gestion-des-crasc/osc/${oscSlug}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        let errorMsg = "Une erreur est survenue lors de la modification de l'OSC.";

        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMsg = errorData.detail;
          }
        }
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error("Erreur lors de la modification de l'OSC: ", error);
      setErrorMessage("Erreur réseau. Vérifiez votre connexion et que l'API est en cours d'exécution.");
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 font-poppins flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2A591D] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!osc) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 font-poppins">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800">{errorMessage || "OSC non trouvée"}</p>
            <Link
              href="/admin/gestion-des-crasc/osc"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              ← Retour à la liste des OSC
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/admin/gestion-des-crasc/osc/${oscSlug}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux détails de l'OSC
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-[#2A591D]" />
          Modifier {osc.name}
        </h1>
        <p className="text-gray-600 mt-2">Modifiez les informations de l'organisation</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-green-800 font-semibold">{successMessage}</p>
            <p className="text-green-600 text-sm">Redirection en cours...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
        {/* Informations de base */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2A591D]" />
            Informations de base
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nom de l'OSC
              </label>
              <input
                id="name"
                type="text"
                {...control.register("name")}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all ${
                  errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#2A591D]'
                }`}
                placeholder="Ex: Association pour le développement"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-gray-500 text-xs">(max 500 caractères)</span>
              </label>
              <textarea
                id="description"
                {...control.register("description")}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all resize-none"
                placeholder="Décrivez brièvement l'organisation..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Associations */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#2A591D]" />
            Associations
          </h2>

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
                  <Select.Root onValueChange={field.onChange} value={field.value}>
                    <Select.Trigger className="w-full px-4 py-3 border-2 border-gray-200 hover:border-[#2A591D] rounded-lg text-left flex items-center justify-between transition-all">
                      <Select.Value placeholder="Sélectionnez un CRASC" />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Select.Trigger>
                    <Select.Content className="bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden z-50">
                      <Select.Viewport className="p-1">
                        {crascRegions.map((region) => (
                          <Select.Item
                            key={region.id}
                            value={region.id.toString()}
                            className="px-4 py-2 hover:bg-[#2A591D]/10 cursor-pointer rounded transition-colors outline-none"
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

            {/* Type d'OSC */}
            <div>
              <label htmlFor="type_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Type d'OSC
              </label>
              <Controller
                name="type_id"
                control={control}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} value={field.value}>
                    <Select.Trigger className="w-full px-4 py-3 border-2 border-gray-200 hover:border-[#2A591D] rounded-lg text-left flex items-center justify-between transition-all">
                      <Select.Value placeholder="Sélectionnez un type" />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Select.Trigger>
                    <Select.Content className="bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden z-50">
                      <Select.Viewport className="p-1">
                        {oscType.map((type) => (
                          <Select.Item
                            key={type.id}
                            value={type.id.toString()}
                            className="px-4 py-2 hover:bg-[#2A591D]/10 cursor-pointer rounded transition-colors outline-none"
                          >
                            <Select.ItemText>{type.name}</Select.ItemText>
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

        {/* Informations de contact */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2A591D]" />
            Informations de contact
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...control.register("email")}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#2A591D]'
                }`}
                placeholder="contact@osc.org"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                {...control.register("phone")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="+225 XX XX XX XX XX"
              />
            </div>

            {/* Ville */}
            <div>
              <label htmlFor="ville" className="block text-sm font-semibold text-gray-700 mb-2">
                Ville
              </label>
              <input
                id="ville"
                type="text"
                {...control.register("ville")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="Abidjan"
              />
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse
              </label>
              <input
                id="address"
                type="text"
                {...control.register("address")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="Cocody, Boulevard..."
              />
            </div>

            {/* Latitude */}
            <div>
              <label htmlFor="latitude" className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude (optionnel)
              </label>
              <input
                id="latitude"
                type="text"
                {...control.register("latitude")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="5.316667"
              />
            </div>

            {/* Longitude */}
            <div>
              <label htmlFor="longitude" className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude (optionnel)
              </label>
              <input
                id="longitude"
                type="text"
                {...control.register("longitude")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="-4.033333"
              />
            </div>
          </div>
        </div>

        {/* Upload d'image */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#2A591D]" />
            Image de couverture
          </h2>

          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                errors.thumbnail
                  ? "border-red-300 bg-red-50"
                  : previewImage
                  ? "border-[#2A591D] bg-[#2A591D]/5"
                  : "border-gray-300 hover:border-[#2A591D] hover:bg-[#2A591D]/5"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail"
              />

              {previewImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-64 h-64 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={previewImage}
                      alt="Aperçu de l'image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Changer l'image
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-1">
                    Cliquez pour sélectionner une nouvelle image
                  </p>
                  <p className="text-gray-500 text-sm">
                    Formats: JPG, PNG, WebP • Taille max: 5MB
                  </p>
                </>
              )}
            </div>

            {errors.thumbnail && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.thumbnail.message}
              </p>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2A591D] to-[#1f4416] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Modification en cours...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer les modifications
              </>
            )}
          </button>

          <Link
            href={`/admin/gestion-des-crasc/osc/${oscSlug}`}
            className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Annuler
          </Link>
        </div>
      </form>
    </section>
  );
}
