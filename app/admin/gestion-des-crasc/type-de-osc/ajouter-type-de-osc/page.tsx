"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validation formulaire d'ajout de Type de OSC
const oscTypeSchema = z.object({
  name: z.string().min(3, "Le type de OSC doit contenir au moins 3 caractères."),
  description: z.string().optional(),
});

type OscTypeForm = z.infer<typeof oscTypeSchema>;

export default function AdminAjoutTypeOsc() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<OscTypeForm>({
    resolver: zodResolver(oscTypeSchema),
    defaultValues: { name: "", description: "" }
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (values: OscTypeForm) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.description && values.description.trim() !== "") {
        formData.append("description", values.description)
      }

      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 201) {
          // Rediriger ou afficher un message de succès
          reset();
          router.push("/admin/gestion-des-crasc/type-de-osc");
        } else {
          // Parse error response
          let errorMessage = "Une erreur est survenue lors de l'ajout de l'actualité.";
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
      
      xhr.open("POST", "http://localhost:8000/api/v1/crasc/osc-type");
      xhr.send(formData);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout d'une actualité: ", error);
      alert("Une erreur inattendue est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto font-poppins bg-slate-50">
      <div className="mb-4">
        <Link href="/admin/gestion-des-crasc" className="hover:underline text-sm text-blue-600">
          ← Aller aux types de OSC
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Ajouter un type de OSC</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Type de OSC</label>
          <input
            id="name"
            type="text"
            {...control.register("name")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Association"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#2A591D] text-white rounded-lg hover:bg-[#244a17] transition-colors cursor-pointer"
        >
          {loading ? "Ajout en cours..." : "Valider"}
        </button>
      </form>
    </section>
  )
}
