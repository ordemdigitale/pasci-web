"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validation pour le formulaire d'ajout de région CIV
const crascSchema = z.object({
  name: z.string().min(5, "Le nom du crasc doit contenir au moins 5 caractères."),
  description: z.string().optional(),
  osc_count: z.string().min(1, "Renseigner le nombre de OSC pour ce CRASC."),
});

type CrascSchemaForm = z.infer<typeof crascSchema>;

export default function AdminAddCrasc() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, reset, setValue, register } = useForm<CrascSchemaForm>({
    resolver: zodResolver(crascSchema),
    defaultValues: { name: "", description: "", osc_count: "" }
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: CrascSchemaForm) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.name) {
        formData.append("name", values.name);
      }
      if (values.description && values.description.trim() !== "") {
        formData.append("description", values.description);
      }

      if (values.osc_count) {
        formData.append("osc_count", values.osc_count);
      }
      
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        if (xhr.status === 201) {
          reset();
          router.push("/admin/gestion-des-crasc");
        } else {
          // Parse error response
          let errorMessage = "Une erreur est survenue lors de la création du CRASC.";
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
                  if (error.field === 'name') {
                    errorMessage = error.message;
                    fieldErrors.title = error.message;
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
      };
      
      xhr.onerror = () => {
        console.error("Erreur réseau lors de l'envoi du formulaire");
        alert("Erreur réseau. Vérifiez votre connexion et que l'API est en cours d'exécution.");
        setLoading(false);
      };
      
      xhr.open("POST", "http://localhost:8000/api/v1/crasc/region-crasc");
      xhr.send(formData);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du CRASC: ", error);
      alert("Une erreur inattendue est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter un CRASC</h2>
        <Link href="/admin/gestion-des-crasc" className="underline mt-4 text-sm text-blue-600">
          ← Retour à la page de gestion des CRASC
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        {/* Nom du CRASC */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom du CRASC</label>
          <input
            id="name"
            type="text"
            {...control.register("name")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="CRASC Sud"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description (optionelle)</label>
          <input
            id="description"
            type="text"
            {...control.register("description")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        {/* Nombre de OSC du CRASC */}
        <div className="mb-4">
          <label htmlFor="osc_count" className="block text-gray-700 font-medium mb-2">Nombre de OSC</label>
          <input
            id="osc_count"
            type="text"
            {...control.register("osc_count")}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {errors.osc_count && <p className="text-red-500 text-sm mt-1">{errors.osc_count.message}</p>}
        </div>
        {/* Groupe de boutons */}
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
