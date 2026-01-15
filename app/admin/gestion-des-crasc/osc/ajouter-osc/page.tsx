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
import Image from "next/image";

// Schema de validation pour le formulaire d'ajout de région CIV
const oscSchema = z.object({
  name: z.string().min(4, "Le nom de l'OSC doit contenir au moins 4 caractères."),
  description: z.string().optional(),
  region_id: z.string().min(1, "Veuillez sélectionner un CRASC."),
  type_id: z.string().min(1, "Veuillez sélectionner un type de OSC."),
  thumbnail_path: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024, // 5MB max
      { message: "L'image doit être inférieure à 5MB" }
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      { message: "Format d'image non supporté. Utilisez le format JPG, PNG ou WebP" }
    ),
});

type OscForm = z.infer<typeof oscSchema>;

export default function AdminAjoutOsc() {
  const [crascRegions, setCrascRegions] = useState<ICrasc[]>([]);
  const [oscType, setOscType] = useState<IOscType[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // Récupérer les régions CRASC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllCrasc()
      .then(data => setCrascRegions(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux régions CRASC: ", error));
  }, []);
  // Récupérer les types de OSC depuis l'API lors du montage du composant
  useEffect(() => {
    fetchAllOscType()
      .then(data => setOscType(data))
      .catch(error => console.error("Erreur lors de la récupération des données relatives aux types de OSC: ", error));
  }, []);

  const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<OscForm>({
    resolver: zodResolver(oscSchema),
    defaultValues: { name: "", description: "", region_id: "", type_id: "" },
  });
  const thumbnailFile = watch("thumbnail_path");

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
  }, [thumbnailFile])

  // Gestion du changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail_path", file);
    }
  };

  // Supprimer l'image selectionnée
  const handleRemoveImage = () => {
    setValue("thumbnail_path", undefined);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: OscForm) => {
    setLoading(true);
    setUploadProgress(0);
    
    try {
      // Créer FormData pour envoyer l'image
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.description && values.description.trim() !== "") {
        formData.append("description", values.description);
      }
      if (values.region_id) {
        formData.append("region_id", values.region_id);
      }
      if (values.type_id) {
        formData.append("type_id", values.type_id);
      }
      
      if (values.thumbnail_path) {
        formData.append("thumbnail_path", values.thumbnail_path);
      }

      // Créer une requête XMLHttpRequest pour suivre la progression
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201) {
          // Rediriger ou afficher un message de succès
          reset();
          setPreviewImage(null);
          router.push("/admin/gestion-des-crasc");
        } else {
          // Parse error response
          let errorMessage = "Une erreur est survenue lors de la création de l'OSC.";
          let fieldErrors: Record<string, string> = {};

          try {
            const response = JSON.parse(xhr.responseText);

            if(response.detail) {
              // Handle structured error response
              if (typeof response.detail === 'string') {
                errorMessage = response.detail;
              } else if (response.detail.type === 'duplicate_error' && response.detail.errors) {
                // Handle duplicate title error
                response.detail.errors.forEach((error: any) => {
                  if (error.field === 'title') {
                    errorMessage = error.message;
                    fieldErrors.title = error.message;
                  }
                });
              } else if (response.detail.type === 'validation_error' && response.detail.errors) {
                // Handle validation errors
                response.detail.errors.forEach((error: any) => {
                  fieldErrors[error.field] = error.message;
                  if (error.field === 'thumbnail') {
                    errorMessage = error.message;
                  }
                });
              }
            }
          } catch (e) {
            // Response is not JSON or parsing failed
            errorMessage = `Erreur ${xhr.status}: ${xhr.statusText}`;
          }
          // Show error message
          alert(errorMessage);
          // If we have field-specific errors, we could set them in form state
          // For now, we just log them
          if (Object.keys(fieldErrors).length > 0) {
            console.log("Field errors:", fieldErrors);
          }
        }
        setLoading(false);
        setUploadProgress(null);
      };

      xhr.onerror = () => {
        console.error("Erreur réseau lors de l'envoi du formulaire");
        alert("Erreur réseau. Vérifiez votre connexion et que l'API est en cours d'exécution.");
        setLoading(false);
        setUploadProgress(null);
      };

      xhr.open("POST", "http://localhost:8000/api/v1/crasc/osc");
      xhr.send(formData);
      
    } catch (error) {
      console.error("Erreur lors de la création de l'Osc: ", error);
      alert("Une erreur inattendue est survenue. Veuillez réessayer.");
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter une OSC</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          ← Retour à la page de gestion des CRASC
        </Link>
      </div>

      {/* Le formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <div className="grid grid-cols-2 gap-12">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom de l&apos;OSC</label>
            <input
              id="name"
              type="text"
              {...control.register("name")}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <input
              id="description"
              type="text"
              {...control.register("description")}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="mb-4">
            <label htmlFor="crasc_region_id" className="block text-gray-700 font-medium mb-2">CRASC associé</label>
            <Controller
              name="region_id"
              control={control}
              render={({ field }) => (
                <Select.Root onValueChange={field.onChange} value={field.value}>
                  <Select.Trigger className="w-full p-2 border border-gray-300 rounded-lg text-left">
                    <Select.Value placeholder="Sélectionnez une région CRASC" />
                    <Select.Icon className="ml-2">▼</Select.Icon>
                  </Select.Trigger>
                  <Select.Content className="bg-white border border-gray-300 rounded-lg mt-1">
                    <Select.ScrollUpButton className="text-center p-2 cursor-pointer">▲</Select.ScrollUpButton>
                    <Select.Viewport>
                      {crascRegions.map((region) => (
                        <Select.Item
                          key={region.id}
                          value={region.id.toString()}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <Select.ItemText>{region.name}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="text-center p-2 cursor-pointer">▼</Select.ScrollDownButton>
                  </Select.Content>
                </Select.Root>
              )}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type_id" className="block text-gray-700 font-medium mb-2">Type de OSC</label>
            <Controller
              name="type_id"
              control={control}
              render={({ field }) => (
                <Select.Root onValueChange={field.onChange} value={field.value}>
                  <Select.Trigger className="w-full p-2 border border-gray-300 rounded-lg text-left">
                    <Select.Value placeholder="Sélectionnez un type de OSC" />
                    <Select.Icon className="ml-2">▼</Select.Icon>
                  </Select.Trigger>
                  <Select.Content className="bg-white border border-gray-300 rounded-lg mt-1">
                    <Select.ScrollUpButton className="text-center p-2 cursor-pointer">▲</Select.ScrollUpButton>
                    <Select.Viewport>
                      {oscType.map((type) => (
                        <Select.Item
                          key={type.id}
                          value={type.id.toString()}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <Select.ItemText>{type.name}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton className="text-center p-2 cursor-pointer">▼</Select.ScrollDownButton>
                  </Select.Content>
                </Select.Root>
              )}
            />
          </div>
        </div>

        {/* Upload d'image */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Image de couverture (optionnel)
          </label>
          
          <div className="space-y-4">
            {/* Zone de drag & drop / sélection de fichier */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                errors.thumbnail_path ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
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
                  <div className="relative w-48 h-48 mb-4">
                    <Image
                      src={previewImage}
                      alt="Aperçu de l'image"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Supprimer l'image
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    Cliquez pour sélectionner une image ou glissez-déposez
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Formats supportés: JPG, PNG, WebP (max 5MB)
                  </p>
                </>
              )}
            </div>
            
            {errors.thumbnail_path && (
              <p className="text-red-500 text-sm">{errors.thumbnail_path.message}</p>
            )}
            
            {/* Barre de progression */}
            {uploadProgress !== null && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Téléchargement: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Ajout en cours...
              </>
            ) : (
              "Valider"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setPreviewImage(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </section>
  )
}
