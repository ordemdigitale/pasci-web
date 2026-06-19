"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { getToken } from "@/lib/auth";
import {
  FORMALISATION_FILE_ACCEPT,
  FORMALISATION_FILE_MAX_SIZE,
  isFormalisationFileAccepted,
} from "@/lib/formalisation-file";
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
  Image as ImageIcon
} from 'lucide-react';

type ApiFieldError = {
  field?: string;
  message?: string;
};

const supportingDocumentSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => !file || file.size <= FORMALISATION_FILE_MAX_SIZE, {
    message: "Le fichier doit être inférieur à 10MB",
  })
  .refine(isFormalisationFileAccepted, {
    message: "Format non supporté. Utilisez PDF, Word, JPG, PNG ou WebP",
  });

// Schema de validation pour le formulaire d'ajout d'OSC
const oscSchema = z.object({
  name: z.string().min(4, "Le nom de l'OSC doit contenir au moins 4 caractères."),
  sigle: z.string().optional(),
  description: z.string().max(500, "La description ne peut pas dépasser 500 caractères.").optional(),
  crasc_id: z.string().min(1, "Veuillez sélectionner un CRASC."),
  type_id: z.string().min(1, "Veuillez sélectionner un type d'OSC."),
  // Informations de contact
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  region_nom: z.string().optional(),
  departement: z.string().optional(),
  sous_prefecture: z.string().optional(),
  ville: z.string().optional(),
  origine_organisation: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  type_document_formalisation: z.string().optional(),
  document_formalisation_file: supportingDocumentSchema,
  existence_siege: z.string().optional(),
  manuel_procedures: z.string().optional(),
  plan_action_annee_cours: z.string().optional(),
  plan_action_annee_cours_details: z.string().optional(),
  plan_action: z.string().optional(),
  plan_action_document_file: supportingDocumentSchema,
  rapports_annuels: z.string().optional(),
  rapports_annuels_document_file: supportingDocumentSchema,
  adhesion_crasc: z.string().optional(),
  adhesion_crasc_statut: z.string().optional(),
  adhesion_crasc_document_file: supportingDocumentSchema,
  niveau_regroupement: z.enum(["Simple", "Réseau", "Fédération", "Plateforme", "Confédération"]).optional().or(z.literal("")),
  categorie: z.string().optional(),
  domaine_prioritaire: z.string().optional(),
  domaine_prioritaire_2: z.string().optional(),
  domaine_prioritaire_3: z.string().optional(),
  domaine_prioritaire_4: z.string().optional(),
  domaine_prioritaire_5: z.string().optional(),
  nb_membres: z.string().optional(),
  nb_femmes_membres: z.string().optional(),
  nb_hommes_membres: z.string().optional(),
  nb_membres_jeunes: z.string().optional(),
  nb_membres_handicap: z.string().optional(),
  nb_membres_be: z.string().optional(),
  nombre_mandats_be: z.string().optional(),
  duree_mandat_be: z.string().optional(),
  nb_personnes_engagees: z.string().optional(),
  nb_cdi: z.string().optional(),
  nb_cdd: z.string().optional(),
  nb_beneficiaires: z.string().optional(),
  nb_femmes_beneficiaires: z.string().optional(),
  nb_jeunes_beneficiaires: z.string().optional(),
  nb_beneficiaires_handicap: z.string().optional(),
  organes_gouvernance: z.string().optional(),
  pays_couverture: z.string().optional(),
  date_designation_responsable: z.string().optional(),
  date_prochaine_designation: z.string().optional(),
  nb_activites: z.string().optional(),
  date_derniere_activite: z.string().optional(),
  recommandations: z.string().optional(),
  recommandations_2: z.string().optional(),
  thumbnail: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB max
      { message: "L'image doit être inférieure à 5MB" }
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      { message: "Format d'image non supporté. Utilisez JPG, PNG ou WebP" }
    ),
});

type OscForm = z.infer<typeof oscSchema>;
type ProofFileField = "plan_action_document_file" | "rapports_annuels_document_file" | "adhesion_crasc_document_file";

export default function AdminAjoutOsc() {
  const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
  const [oscType, setOscType] = useState<IOscType[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentFormalisationInputRef = useRef<HTMLInputElement>(null);
  const planActionDocumentInputRef = useRef<HTMLInputElement>(null);
  const rapportsAnnuelsDocumentInputRef = useRef<HTMLInputElement>(null);
  const adhesionCrascDocumentInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Récupérer les régions CRASC depuis l'API
  useEffect(() => {
    fetchAllCrasc()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur lors de la récupération des CRASC: ", error));
  }, []);

  // Récupérer les types d'OSC depuis l'API
  useEffect(() => {
    fetchAllOscType()
      .then(data => setOscType(data))
      .catch(error => console.error("Erreur lors de la récupération des types d'OSC: ", error));
  }, []);

  const { control, handleSubmit, formState: { errors }, reset, setValue, watch, register } = useForm<OscForm>({
    resolver: zodResolver(oscSchema),
    defaultValues: {
      name: "",
      sigle: "",
      description: "",
      crasc_id: "",
      type_id: "",
      email: "",
      phone: "",
      region_nom: "",
      departement: "",
      sous_prefecture: "",
      ville: "",
      origine_organisation: "",
      address: "",
      latitude: "",
      longitude: "",
      type_document_formalisation: "",
      existence_siege: "",
      manuel_procedures: "",
      plan_action_annee_cours: "",
      plan_action_annee_cours_details: "",
      plan_action: "",
      rapports_annuels: "",
      adhesion_crasc: "",
      adhesion_crasc_statut: "",
      niveau_regroupement: "",
      categorie: "",
      domaine_prioritaire: "",
      domaine_prioritaire_2: "",
      domaine_prioritaire_3: "",
      domaine_prioritaire_4: "",
      domaine_prioritaire_5: "",
      nb_membres: "",
      nb_femmes_membres: "",
      nb_hommes_membres: "",
      nb_membres_jeunes: "",
      nb_membres_handicap: "",
      nb_membres_be: "",
      nombre_mandats_be: "",
      duree_mandat_be: "",
      nb_personnes_engagees: "",
      nb_cdi: "",
      nb_cdd: "",
      nb_beneficiaires: "",
      nb_femmes_beneficiaires: "",
      nb_jeunes_beneficiaires: "",
      nb_beneficiaires_handicap: "",
      organes_gouvernance: "",
      pays_couverture: "",
      date_designation_responsable: "",
      date_prochaine_designation: "",
      nb_activites: "",
      date_derniere_activite: "",
      recommandations: "",
      recommandations_2: "",
    },
  });

  const thumbnailFile = watch("thumbnail");
  const documentFormalisationFile = watch("document_formalisation_file");
  const planActionValue = watch("plan_action");
  const rapportsAnnuelsValue = watch("rapports_annuels");
  const adhesionCrascStatutValue = watch("adhesion_crasc_statut");

  const renderProofUpload = (
    field: ProofFileField,
    inputRef: React.RefObject<HTMLInputElement | null>,
    label: string
  ) => {
    const selectedFile = watch(field);
    return (
      <div className="md:col-span-2 rounded-xl border border-dashed border-[#2A591D]/30 bg-[#2A591D]/5 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-left transition-all ${
            errors[field]
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-[#2A591D] hover:bg-white"
          }`}
        >
          <span className="flex items-center gap-2 text-gray-700">
            <Upload className="w-4 h-4 text-[#2A591D]" />
            {selectedFile?.name || "Déposer la preuve"}
          </span>
          <span className="mt-1 block text-xs text-gray-500">PDF, Word, JPG, PNG ou WebP • 10MB max</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={FORMALISATION_FILE_ACCEPT}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) setValue(field, file);
          }}
        />
        {selectedFile && (
          <button
            type="button"
            onClick={() => {
              setValue(field, undefined);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Retirer le fichier
          </button>
        )}
        {errors[field] && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors[field]?.message}
          </p>
        )}
      </div>
    );
  };

  // Gestion du preview de l'image
  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(thumbnailFile);
    } else {
      setPreviewImage(null);
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
    setPreviewImage(null);
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
      const appendIfFilled = (key: keyof OscForm, apiKey: string = key) => {
        const value = values[key];
        if (typeof value === "string" && value.trim() !== "") {
          formData.append(apiKey, value);
        }
      };
      formData.append("name", values.name);
      appendIfFilled("sigle");

      if (values.description && values.description.trim() !== "") {
        formData.append("description", values.description);
      }
      if (values.crasc_id) {
        formData.append("crasc_id", values.crasc_id);
      }
      if (values.type_id) {
        formData.append("type_id", values.type_id);
      }

      // Informations de contact
      if (values.email && values.email.trim() !== "") {
        formData.append("email", values.email);
      }
      if (values.phone && values.phone.trim() !== "") {
        formData.append("phone", values.phone);
      }
      appendIfFilled("region_nom");
      appendIfFilled("departement");
      appendIfFilled("sous_prefecture");
      if (values.ville && values.ville.trim() !== "") {
        formData.append("ville", values.ville);
      }
      appendIfFilled("origine_organisation");
      if (values.address && values.address.trim() !== "") {
        formData.append("address", values.address);
      }
      if (values.latitude && values.latitude.trim() !== "") {
        formData.append("latitude", values.latitude);
      }
      if (values.longitude && values.longitude.trim() !== "") {
        formData.append("longitude", values.longitude);
      }
      [
        "type_document_formalisation",
        "existence_siege",
        "manuel_procedures",
        "plan_action_annee_cours",
        "plan_action_annee_cours_details",
        "plan_action",
        "rapports_annuels",
        "niveau_regroupement",
        "categorie",
        "domaine_prioritaire",
        "domaine_prioritaire_2",
        "domaine_prioritaire_3",
        "domaine_prioritaire_4",
        "domaine_prioritaire_5",
        "nb_membres",
        "nb_femmes_membres",
        "nb_hommes_membres",
        "nb_membres_jeunes",
        "nb_membres_handicap",
        "nb_membres_be",
        "nombre_mandats_be",
        "duree_mandat_be",
        "nb_personnes_engagees",
        "nb_cdi",
        "nb_cdd",
        "nb_beneficiaires",
        "nb_femmes_beneficiaires",
        "nb_jeunes_beneficiaires",
        "nb_beneficiaires_handicap",
        "organes_gouvernance",
        "pays_couverture",
        "date_designation_responsable",
        "date_prochaine_designation",
        "nb_activites",
        "date_derniere_activite",
        "recommandations",
        "recommandations_2",
      ].forEach((key) => {
        const value = values[key as keyof OscForm];
        if (typeof value === "string" && value !== "") formData.append(key, value);
      });
      if (values.adhesion_crasc_statut) {
        formData.append("adhesion_crasc_statut", values.adhesion_crasc_statut);
        if (values.adhesion_crasc_statut === "oui") {
          formData.append("adhesion_crasc", "true");
        } else if (values.adhesion_crasc_statut === "non") {
          formData.append("adhesion_crasc", "false");
        }
      }

      if (values.thumbnail) {
        formData.append("thumbnail", values.thumbnail);
      }
      if (values.document_formalisation_file) {
        formData.append("document_formalisation_file", values.document_formalisation_file);
      }
      if (values.plan_action_document_file) {
        formData.append("plan_action_document_file", values.plan_action_document_file);
      }
      if (values.rapports_annuels_document_file) {
        formData.append("rapports_annuels_document_file", values.rapports_annuels_document_file);
      }
      if (values.adhesion_crasc_document_file) {
        formData.append("adhesion_crasc_document_file", values.adhesion_crasc_document_file);
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201) {
          setSuccessMessage("OSC créée avec succès!");
          reset();
          setPreviewImage(null);
          if (documentFormalisationInputRef.current) documentFormalisationInputRef.current.value = "";
          if (planActionDocumentInputRef.current) planActionDocumentInputRef.current.value = "";
          if (rapportsAnnuelsDocumentInputRef.current) rapportsAnnuelsDocumentInputRef.current.value = "";
          if (adhesionCrascDocumentInputRef.current) adhesionCrascDocumentInputRef.current.value = "";

          // Rediriger après 2 secondes
          setTimeout(() => {
            router.push("/admin/gestion-des-crasc/osc");
          }, 2000);
        } else {
          let errorMsg = "Une erreur est survenue lors de la création de l'OSC.";

          try {
            const response = JSON.parse(xhr.responseText);
            if (response.detail) {
              if (typeof response.detail === 'string') {
                errorMsg = response.detail;
              } else if (response.detail.type === 'duplicate_error' && response.detail.errors) {
                response.detail.errors.forEach((error: ApiFieldError) => {
                  if (error.field === 'name') {
                    errorMsg = error.message || errorMsg;
                  }
                });
              } else if (response.detail.type === 'validation_error' && response.detail.errors) {
                response.detail.errors.forEach((error: ApiFieldError) => {
                  if (error.field === 'thumbnail') {
                    errorMsg = error.message || errorMsg;
                  }
                });
              }
            }
          } catch {
            errorMsg = `Erreur ${xhr.status}: ${xhr.statusText}`;
          }

          setErrorMessage(errorMsg);
        }
        setLoading(false);
        setUploadProgress(null);
      };

      xhr.onerror = () => {
        setErrorMessage("Erreur réseau. Vérifiez votre connexion et que l'API est en cours d'exécution.");
        setLoading(false);
        setUploadProgress(null);
      };

      xhr.open("POST", `${API_BASE_URL}/api/v1/crasc/osc`);
      const token = getToken();
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);

    } catch (error) {
      console.error("Erreur lors de la création de l'OSC: ", error);
      setErrorMessage("Une erreur inattendue est survenue. Veuillez réessayer.");
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50 py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/gestion-des-crasc"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la gestion des CRASC
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-[#2A591D]" />
          Ajouter une OSC
        </h1>
        <p className="text-gray-600 mt-2">Remplissez les informations ci-dessous pour créer une nouvelle organisation</p>
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
                Nom de l&apos;OSC <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#2A591D]'
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

            <div>
              <label htmlFor="sigle" className="block text-sm font-semibold text-gray-700 mb-2">
                Sigle ou abréviation
              </label>
              <input
                id="sigle"
                type="text"
                {...register("sigle")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="Ex: APD"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-gray-500 text-xs">(max 500 caractères)</span>
              </label>
              <textarea
                id="description"
                {...register("description")}
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
                CRASC associé <span className="text-red-500">*</span>
              </label>
              <Controller
                name="crasc_id"
                control={control}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} value={field.value}>
                    <Select.Trigger className={`w-full px-4 py-3 border-2 rounded-lg text-left flex items-center justify-between transition-all ${errors.crasc_id ? 'border-red-300' : 'border-gray-200 hover:border-[#2A591D]'
                      }`}>
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
              {errors.crasc_id && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.crasc_id.message}
                </p>
              )}
            </div>

            {/* Type d'OSC */}
            <div>
              <label htmlFor="type_id" className="block text-sm font-semibold text-gray-700 mb-2">
                Type d&apos;OSC <span className="text-red-500">*</span>
              </label>
              <Controller
                name="type_id"
                control={control}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} value={field.value}>
                    <Select.Trigger className={`w-full px-4 py-3 border-2 rounded-lg text-left flex items-center justify-between transition-all ${errors.type_id ? 'border-red-300' : 'border-gray-200 hover:border-[#2A591D]'
                      }`}>
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
              {errors.type_id && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.type_id.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Niveau de regroupement
              </label>
              <Controller
                name="niveau_regroupement"
                control={control}
                render={({ field }) => (
                  <Select.Root onValueChange={field.onChange} value={field.value}>
                    <Select.Trigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-[#2A591D] transition-all">
                      <Select.Value placeholder="Sélectionnez un niveau" />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Select.Trigger>
                    <Select.Content className="bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden z-50">
                      <Select.Viewport className="p-1">
                        {[
                          ["Simple", "Simple"],
                          ["Réseau", "Réseau"],
                          ["Fédération", "Fédération"],
                          ["Plateforme", "Plateforme"],
                          ["Confédération", "Confédération"],
                        ].map(([value, label]) => (
                          <Select.Item key={value} value={value} className="px-4 py-2 hover:bg-[#2A591D]/10 cursor-pointer rounded transition-colors outline-none">
                            <Select.ItemText>{label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Root>
                )}
              />
            </div>

            <div>
              <label htmlFor="categorie" className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie d&apos;organisation
              </label>
              <select
                id="categorie"
                {...register("categorie")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
              >
                <option value="">Sélectionner</option>
                <option value="organisation_jeune">Organisation de jeune (ODJ)</option>
                <option value="organisation_femme">Organisation de femme</option>
                <option value="organisation_mixte">Organisation mixte</option>
              </select>
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
                {...register("email")}
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
                {...register("phone")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="+225 XX XX XX XX XX"
              />
            </div>

            <div>
              <label htmlFor="region_nom" className="block text-sm font-semibold text-gray-700 mb-2">
                Région
              </label>
              <input
                id="region_nom"
                type="text"
                {...register("region_nom")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="Région"
              />
            </div>

            <div>
              <label htmlFor="departement" className="block text-sm font-semibold text-gray-700 mb-2">
                Département
              </label>
              <input
                id="departement"
                type="text"
                {...register("departement")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="Département"
              />
            </div>

            <div>
              <label htmlFor="sous_prefecture" className="block text-sm font-semibold text-gray-700 mb-2">
                Sous-préfecture
              </label>
              <input
                id="sous_prefecture"
                type="text"
                {...register("sous_prefecture")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="Sous-préfecture"
              />
            </div>

            <div>
              <label htmlFor="origine_organisation" className="block text-sm font-semibold text-gray-700 mb-2">
                L&apos;organisation est née où ?
              </label>
              <select
                id="origine_organisation"
                {...register("origine_organisation")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
              >
                <option value="">Sélectionner</option>
                <option value="cote_ivoire">Côte d&apos;Ivoire</option>
                <option value="etranger">À l&apos;étranger</option>
              </select>
            </div>

            {/* Ville */}
            <div>
              <label htmlFor="ville" className="block text-sm font-semibold text-gray-700 mb-2">
                Ville
              </label>
              <input
                id="ville"
                type="text"
                {...register("ville")}
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
                {...register("address")}
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
                {...register("latitude")}
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
                {...register("longitude")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all"
                placeholder="-4.033333"
              />
            </div>
          </div>
        </div>

        {/* Autoévaluation */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E05017]" /> Autoévaluation de l’OSC
          </h2>
          <p className="text-sm text-gray-500 mb-6">La note sur 20 et la couleur sont calculées automatiquement.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau de formalisation</label>
              <select {...register("type_document_formalisation")} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] outline-none">
                <option value="">Sélectionner</option>
                <option value="statuts_reglement">Statuts et règlement — 1 point</option>
                <option value="recepisse_depot">Récépissé de dépôt — 3 points</option>
                <option value="recepisse_declaration">Récépissé de déclaration — 5 points</option>
                <option value="agrement_decret">Agrément / décret — 5 points</option>
                <option value="journal_officiel">Déclaration au journal officiel — 7 points</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Justificatif de formalisation</label>
              <button
                type="button"
                onClick={() => documentFormalisationInputRef.current?.click()}
                className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-left transition-all ${
                  errors.document_formalisation_file
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-[#2A591D] hover:bg-[#2A591D]/5"
                }`}
              >
                <span className="flex items-center gap-2 text-gray-700">
                  <Upload className="w-4 h-4 text-[#2A591D]" />
                  {documentFormalisationFile?.name || "Déposer le fichier justificatif"}
                </span>
                <span className="mt-1 block text-xs text-gray-500">PDF, Word, JPG, PNG ou WebP • 10MB max</span>
              </button>
              <input
                ref={documentFormalisationInputRef}
                type="file"
                accept={FORMALISATION_FILE_ACCEPT}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setValue("document_formalisation_file", file);
                }}
              />
              {documentFormalisationFile && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("document_formalisation_file", undefined);
                    if (documentFormalisationInputRef.current) documentFormalisationInputRef.current.value = "";
                  }}
                  className="mt-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  Retirer le fichier
                </button>
              )}
              {errors.document_formalisation_file && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.document_formalisation_file.message}
                </p>
              )}
            </div>
            {[
              ["existence_siege", "Existence d’un siège — 3 points"],
              ["manuel_procedures", "Manuel de procédures — 3 points"],
              ["plan_action_annee_cours", "Plan d’action pour l’année en cours"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <select {...register(name as keyof OscForm)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] outline-none">
                  <option value="">Sélectionner</option>
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Plan d’action — 3 points</label>
              <select {...register("plan_action")} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] outline-none">
                <option value="">Sélectionner</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>
            {planActionValue === "true" &&
              renderProofUpload("plan_action_document_file", planActionDocumentInputRef, "Preuve du plan d’action")}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Rapports annuels d’activités — 3 points</label>
              <select {...register("rapports_annuels")} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] outline-none">
                <option value="">Sélectionner</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>
            {rapportsAnnuelsValue === "true" &&
              renderProofUpload("rapports_annuels_document_file", rapportsAnnuelsDocumentInputRef, "Preuve des rapports annuels")}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Adhésion au CRASC — 1 point si Oui</label>
              <select {...register("adhesion_crasc_statut")} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] outline-none">
                <option value="">Sélectionner</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
                <option value="en_cours">En cours</option>
              </select>
            </div>
            {adhesionCrascStatutValue === "oui" &&
              renderProofUpload("adhesion_crasc_document_file", adhesionCrascDocumentInputRef, "Preuve d’adhésion au CRASC")}
          </div>
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Plan d’action pour l’année en cours et activités/initiatives à venir</label>
            <textarea
              {...register("plan_action_annee_cours_details")}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all resize-none"
              placeholder="Décrivez le plan et les activités à venir..."
            />
          </div>
        </div>

        {/* Domaines prioritaires */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2A591D]" />
            Domaines prioritaires
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              ["domaine_prioritaire", "1er domaine prioritaire"],
              ["domaine_prioritaire_2", "2ème domaine prioritaire"],
              ["domaine_prioritaire_3", "3ème domaine prioritaire"],
              ["domaine_prioritaire_4", "4ème domaine prioritaire"],
              ["domaine_prioritaire_5", "5ème domaine prioritaire"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <input {...register(name as keyof OscForm)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Membres et bénéficiaires */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2A591D]" />
            Membres et bénéficiaires
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["nb_membres", "Nombre total de membres"],
              ["nb_femmes_membres", "Nombre de femmes membres"],
              ["nb_hommes_membres", "Nombre d’hommes membres"],
              ["nb_membres_jeunes", "Nombre de membres jeunes"],
              ["nb_membres_handicap", "Nombre de membres en situation de handicap"],
              ["nb_membres_be", "Nombre de membres du BE"],
              ["nb_personnes_engagees", "Nombre total de personnes engagées"],
              ["nb_cdi", "Nombre de personnes sous CDI"],
              ["nb_cdd", "Nombre de personnes sous CDD"],
              ["nb_beneficiaires", "Nombre total de bénéficiaires"],
              ["nb_femmes_beneficiaires", "Nombre de femmes bénéficiaires"],
              ["nb_jeunes_beneficiaires", "Nombre de jeunes bénéficiaires"],
              ["nb_beneficiaires_handicap", "Nombre de bénéficiaires en situation de handicap"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <input {...register(name as keyof OscForm)} type="number" min="0" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Gouvernance et activités */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#2A591D]" />
            Gouvernance et activités
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de mandat du BE ou DE actuel</label>
              <input {...register("nombre_mandats_be")} type="number" min="0" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Durée de mandat du BE ou DE actuel</label>
              <input {...register("duree_mandat_be")} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" placeholder="Ex: 3 ans" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date de désignation du/de la responsable actuel(le)</label>
              <input {...register("date_designation_responsable")} type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prochaine date de désignation</label>
              <input {...register("date_prochaine_designation")} type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre d’activités réalisées dans les 12 derniers mois</label>
              <input {...register("nb_activites")} type="number" min="0" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date de la dernière activité réalisée</label>
              <input {...register("date_derniere_activite")} type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organes de gouvernance</label>
              <textarea {...register("organes_gouvernance")} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all resize-none" placeholder="AG, CA, BE, CC, DE, CG, CS..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pays de couverture en plus de la Côte d’Ivoire</label>
              <textarea {...register("pays_couverture")} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Première recommandation</label>
              <textarea {...register("recommandations")} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deuxième recommandation</label>
              <textarea {...register("recommandations_2")} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#2A591D] focus:ring-2 focus:ring-[#2A591D]/20 outline-none transition-all resize-none" />
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
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${errors.thumbnail
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
                    Supprimer l&apos;image
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium mb-1">
                    Cliquez pour sélectionner une image
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

            {/* Barre de progression */}
            {uploadProgress !== null && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#2A591D] h-3 rounded-full transition-all duration-300 flex items-center justify-center"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress > 10 && (
                      <span className="text-xs text-white font-semibold">{uploadProgress}%</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center font-medium">
                  Téléchargement en cours...
                </p>
              </div>
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
                Création en cours...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Créer l&apos;OSC
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setPreviewImage(null);
              setErrorMessage(null);
              setSuccessMessage(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            disabled={loading}
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </section>
  )
}
