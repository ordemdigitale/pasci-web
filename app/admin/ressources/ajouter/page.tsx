"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as Select from "@radix-ui/react-select";
import { ICrasc, IOsc } from "@/types/api.types";
import { fetchAllCrasc, fetchAllOsc } from "@/lib/fetch-crasc";
import {
  ArrowLeft,
  FileText,
  Upload,
  X,
  Check,
  Loader2,
  AlertCircle,
  ChevronDown,
  Building2,
  Users,
  File as FileIcon,
} from 'lucide-react';
import { fetchWithAuth } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Schema de validation
const documentSchema = z.object({
  title: z.string().min(8, "Le titre doit contenir au moins 8 caractères."),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  crasc_id: z.string().optional().nullable(),
  osc_id: z.string().optional().nullable(),
  file: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file instanceof File;
      },
      { message: "Le fichier doit être un fichier valide" }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 50 * 1024 * 1024;
      },
      { message: "Le fichier doit être inférieur à 50MB" }
    )
    .refine(
      (file) => {
        if (!file) return true;
        const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain"];
        const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
        return validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      },
      { message: "Format non supporté. Utilisez PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX ou TXT" }
    ),
});

type DocumentForm = z.infer<typeof documentSchema>;

const categories = [
  "Rapport",
  "Guide",
  "Étude",
  "Manuel",
  "PV",
  "Infographie",
  "Politique",
  "Récit",
  "Plan",
];

export default function AdminAjoutDocument() {
  const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
  const [oscs, setOscs] = useState<IOsc[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Récupérer les CRASC et OSC
  useEffect(() => {
    fetchAllCrasc()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur CRASC:", error));

    fetchAllOsc()
      .then(data => setOscs(data))
      .catch(error => console.error("Erreur OSC:", error));
  }, []);

  const { register, control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
    defaultValues: { title: "", description: "", category: "", crasc_id: "", osc_id: "" },
  });

  const documentFile = watch("file");

  // Preview du nom de fichier
  useEffect(() => {
    if (documentFile) {
      setPreviewFileName(documentFile.name);
    } else {
      setPreviewFileName(null);
    }
  }, [documentFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setValue("file", file);
  };

  const handleRemoveFile = () => {
    setValue("file", undefined);
    setPreviewFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Soumission du formulaire
  const onSubmit = async (values: DocumentForm) => {
    console.log("Form submitted with values:", values);
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.description) formData.append("description", values.description);
      if (values.category) formData.append("category", values.category);
      if (values.crasc_id) formData.append("crasc_id", values.crasc_id);
      if (values.osc_id) formData.append("osc_id", values.osc_id);
      if (values.file) formData.append("file", values.file);

      console.log("Sending request to:", `${API_BASE_URL}/api/v1/documentation`);
      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      const response = await fetchWithAuth(`${API_BASE_URL}/api/v1/documentation`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        const errorMessage = errorData.detail?.errors?.[0]?.message || 
                            errorData.detail || 
                            `Erreur ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Success response:", result);

      setSuccessMessage("✅ Document ajouté avec succès!");
      reset();
      setPreviewFileName(null);

      setTimeout(() => {
        router.push("/admin/ressources");
      }, 2000);
    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      setErrorMessage(error.message || "Une erreur est survenue lors de la création du document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 font-poppins">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#2A591D] to-[#3d7a28] rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ajouter un Document</h1>
              <p className="text-white/80 mt-1">Ajoutez un nouveau document à la bibliothèque</p>
            </div>
          </div>
          <Link
            href="/admin/ressources"
            className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la gestion des ressources
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
              <FileText className="w-5 h-5 text-[#2A591D]" />
              <h2 className="text-xl font-bold text-gray-900">Informations de base</h2>
            </div>

            {/* Titre */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Titre du document <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all ${errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Ex: Guide de rédaction de propositions de projets"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all ${errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Description du document..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
              )}
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} value={field.value ?? undefined}>
                    <Select.Trigger className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-[#2A591D] focus:border-transparent transition-all flex items-center justify-between">
                      <Select.Value placeholder="Sélectionnez une catégorie" />
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Select.Trigger>
                    <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto z-50">
                      <Select.Viewport>
                        {categories.map((cat) => (
                          <Select.Item
                            key={cat}
                            value={cat}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          >
                            <Select.ItemText>{cat}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </div>
          </div>

          {/* Section: Associations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Building2 className="w-5 h-5 text-[#2A591D]" />
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
                    <Select.Root onValueChange={field.onChange} value={field.value ?? undefined}>
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
                    <Select.Root onValueChange={field.onChange} value={field.value ?? undefined}>
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

          {/* Section: Fichier document */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <FileIcon className="w-5 h-5 text-[#2A591D]" />
              <h2 className="text-xl font-bold text-gray-900">Fichier document</h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${errors.file
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-[#2A591D] hover:bg-gray-50"
                }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewFileName ? (
                <div className="flex flex-col items-center">
                  <FileIcon className="w-12 h-12 text-[#2A591D] mb-4" />
                  <p className="text-gray-900 font-medium mb-2">{previewFileName}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Supprimer le fichier
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-700 font-medium mb-1">
                    Cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-gray-500 text-sm">
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT • Max 50MB
                  </p>
                </>
              )}
            </div>

            {errors.file?.message && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {String(errors.file.message)}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setPreviewFileName(null);
              }}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Réinitialiser
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-[#2A591D] to-[#3d7a28] text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Ajouter le document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
