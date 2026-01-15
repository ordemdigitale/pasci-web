"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import slugify from "slugify";
import { IOscType } from "@/types/api.types";

// Schema de validation
const oscTypeSchema = z.object({
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
});

type OscTypeForm = z.infer<typeof oscTypeSchema>;

export default function EditOscTypePage() {
  const router = useRouter();
  const params = useParams();
  const osctypeSlug = params.osctypeSlug as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [oscType, setOscType] = useState<IOscType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  console.log("osctype:", oscType)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<OscTypeForm>({
    resolver: zodResolver(oscTypeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Générer un aperçu du slug en temps réel
  const nameValue = watch("name");
  const slugPreview = nameValue ? slugify(nameValue, { lower: true, strict: true }) : "";

  // Charger les données du OSC Type
  useEffect(() => {
    const fetchOscType = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://localhost:8000/api/v1/crasc/osc-type/${osctypeSlug}`,
          {
            cache: "no-store",
          }
        );
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Type d'OSC non trouvé");
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setOscType(data);
        reset({
          name: data.name,
          description: data.description || "",
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    if (osctypeSlug) {
      fetchOscType();
    }
  }, [osctypeSlug, reset]);

  // Gestion de la soumission du formulaire
  const onSubmit = async (data: OscTypeForm) => {
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/crasc/osc-type/${osctypeSlug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      
      const responseData = await response.json();
      
      if (response.ok) {
        setSuccessMessage("Type d'OSC mis à jour avec succès !");
        setOscType(responseData);
        
        // Rediriger après 2 secondes
        setTimeout(() => {
          router.push("/admin/gestion-des-crasc/type-de-osc");
        }, 2000);
      } else {
        // Gestion des erreurs
        if (response.status === 409) {
          setError("Un type d'OSC avec ce nom existe déjà.");
        } else if (response.status === 404) {
          setError("Type d'OSC non trouvé.");
        } else if (responseData.detail) {
          setError(responseData.detail.message || "Erreur lors de la mise à jour");
        } else {
          setError(`Erreur ${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      setError("Erreur réseau. Vérifiez votre connexion.");
      console.error("Erreur:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Supprimer le type d'OSC
  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce type d'OSC ? Cette action est irréversible.")) {
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/crasc/osc-type/${osctypeSlug}`,
        {
          method: "DELETE",
        }
      );
      
      if (response.ok) {
        router.push("/admin/gestion-des-crasc/type-de-osc");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.detail || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur réseau lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !oscType) {
    return (
      <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-semibold text-red-800">Erreur</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
            <Link
              href="/admin/gestion-des-crasc/type-de-osc"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto font-poppins bg-slate-50 min-h-screen p-4 md:p-8">
      {/* En-tête */}
      <Link
        href="/admin/gestion-des-crasc/type-de-osc"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4"
      >
        ← Aller aux types de OSC
      </Link>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier le type d'OSC
          </h1>
          {oscType && (
            <p className="text-gray-600 mt-1">
              Modifier les informations du type &quot;{oscType.name}&quot;
            </p>
          )}
        </div>
        
      </div>

      {/* Messages d'alerte */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Informations actuelles */}
      {oscType && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Slug actuel</p>
            <p className="font-medium">{oscType.slug}</p>
          </div> */}
          {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Date de création</p>
            <p className="font-medium">
              {new Date(oscType.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div> */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">OSCs associées</p>
            <p className="font-medium">
              {oscType.oscs?.length === 0 ? 
              <span>Aucune OSC pour le moment</span>
              : 
              <span>
                {oscType.oscs?.map((osc) => (
                  <p>{osc && osc.name}</p>
                ))}
              </span>}
            </p>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Champ Nom */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Nom du type d'OSC *
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Ex: Association, Fondation, ONG"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name.message}
            </p>
          )}
          
          {/* Aperçu du slug */}
          {nameValue && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Nouveau slug généré :</p>
              <p className="font-mono text-blue-700">{slugPreview}</p>
              <p className="text-xs text-gray-500 mt-1">
                Le slug sera automatiquement mis à jour lors de l&apos;enregistrement.
              </p>
            </div>
          )}
        </div>

        {/* Champ Description */}
        <div className="mb-8">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description (optionnel)
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none ${
              errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Décrivez ce type d'organisation..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description.message}
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">
            {watch("description")?.length || 0}/500 caractères
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
            
            <button
              type="button"
              onClick={() => reset()}
              disabled={submitting}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Annuler les modifications
            </button>
          </div>
          
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
          >
            Supprimer ce type
          </button>
        </div>
      </form>

      {/* Section Avertissement Suppression */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="font-medium text-yellow-800">Attention</h3>
            <p className="text-yellow-700 text-sm mt-1">
              La suppression d&apos;un type d&apos;OSC est irréversible. 
              Assurez-vous qu&apos;aucune OSC n&apos;est associée à ce type avant de le supprimer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}